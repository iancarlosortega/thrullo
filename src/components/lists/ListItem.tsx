'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { AnimatePresence, motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import useUIStore from '@/store/uiStore';
import { ListOptionsButton } from '../buttons/ListOptionsButton';
import { AddCardButton } from '../buttons/AddCardButton';
import { CardsListItem } from '../cards';
import { useOutsideAlerter } from '@/hooks';
import { List, User } from '@/types';
import { classNames } from '@/utils';

interface IFormValues {
	title: string;
}

interface Props {
	list: List;
	members: User[];
}

export const ListItem: React.FC<Props> = ({ list, members }) => {
	const [isEdittingMode, setIsEdittingMode] = useState(false);
	const isDragging = useUIStore(state => state.isDragging);
	const currentCardHeight = useUIStore(state => state.currentCardHeight);
	const supabase = createClientComponentClient();
	const router = useRouter();
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<IFormValues>({
		defaultValues: {
			title: list.title,
		},
	});

	const toggleEditListTitle = () => {
		setIsEdittingMode(true);
	};

	const handleUpdateList = async ({ title }: IFormValues) => {
		const { error } = await supabase
			.from('lists')
			.update({
				title,
			})
			.match({ id: list.id });

		if (error) {
			console.error(error);
			toast.error(error.message);
			return;
		}

		toast.success('List updated successfully');
		router.refresh();
		setIsEdittingMode(false);
		reset();
	};

	const handleClose = () => {
		setIsEdittingMode(false);
		reset();
	};

	const handleDrop = async (event: React.DragEvent<HTMLElement>) => {
		event.preventDefault();
		const card = JSON.parse(event.dataTransfer.getData('card'));
		const listTitle = event.dataTransfer.getData('listTitle');

		if (listTitle === list.title) {
			return;
		}

		const { error } = await supabase
			.from('cards')
			.update({
				list_id: list.id,
				updated_at: new Date(),
			})
			.match({ id: card.id });

		if (error) {
			console.error(error);
			toast.error(error.message);
			return;
		}
		router.refresh();
	};

	const wrapperRef = useRef<HTMLFormElement>(null);
	useOutsideAlerter(wrapperRef, handleClose);

	return (
		<aside className='w-[300px] flex-1'>
			<header className='flex items-center justify-between'>
				<AnimatePresence>
					{isEdittingMode ? (
						<motion.form
							ref={wrapperRef}
							initial={{ opacity: 0 }}
							animate={{ opacity: isEdittingMode ? 1 : 0 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.5 }}
							onSubmit={handleSubmit(handleUpdateList)}
							autoComplete='off'
							className='w-full'>
							<div
								className={classNames(
									'p-4 rounded-xl border shadow-[0px_2px_8px_0px_rgba(0,0,0,0.10)]',
									'grid place-items-start bg-white dark:bg-neutral-800',
									`${
										errors.title
											? 'border-red-300'
											: 'border-[#E0E0E0] dark:border-neutral-700'
									}`
								)}>
								<input
									autoFocus
									placeholder='Enter a title for this list...'
									className={classNames(
										'bg-transparent focus:outline-none w-full resize-none',
										`${errors.title && 'placeholder:text-red-500'}`
									)}
									{...register('title', {
										required: 'Title is required',
										minLength: {
											value: 3,
											message: 'Title must be at least 3 characters long',
										},
										maxLength: {
											value: 50,
											message: 'Title must be at most 50 characters long',
										},
									})}
								/>

								<div className='mt-4 flex items-center gap-2'>
									<button
										onClick={handleClose}
										className={classNames(
											'py-2 px-6 bg-tertiary text-white text-sm rounded-xl',
											'hover:bg-neutral-900 transition-all duration-200'
										)}>
										Cancel
									</button>
									<button
										disabled={isSubmitting}
										type='submit'
										className={classNames(
											'py-2 px-6 bg-[#219653] text-white text-sm rounded-xl',
											'hover:bg-[#1E8449] transition-all duration-200',
											'disabled:bg-[#BDBDBD] disabled:cursor-not-allowed'
										)}>
										Save
									</button>
								</div>
							</div>
							{errors.title && (
								<span className='text-sm text-red-500 my-4'>
									{errors.title.message}
								</span>
							)}
						</motion.form>
					) : (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: !isEdittingMode ? 1 : 0 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.5 }}
							className='w-full flex items-center justify-between'>
							<h2 className='text-lg font-medium'>{list.title}</h2>
							<ListOptionsButton
								list={list}
								toggleEditListTitle={toggleEditListTitle}
							/>
						</motion.div>
					)}
				</AnimatePresence>
			</header>
			{list.cards.map(card => (
				<CardsListItem
					card={card}
					listTitle={list.title}
					members={members}
					key={card.id}
				/>
			))}
			<AnimatePresence>
				{isDragging && (
					<motion.div
						onDrop={handleDrop}
						onDragOver={event => event.preventDefault()}
						initial={{ opacity: 0, height: 0 }}
						animate={{
							opacity: isDragging ? 1 : 0,
							height: isDragging ? currentCardHeight : 0,
						}}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.2 }}
						className={classNames(
							'w-full my-4 bg-[#E2E8F6] rounded-xl shadow-[0px_4px_12px_0px_rgba(0,0,0,0.05)]',
							'border border-dashed border-[#2F80ED]'
						)}></motion.div>
				)}
			</AnimatePresence>
			<AddCardButton listId={list.id} />
		</aside>
	);
};
