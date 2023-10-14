'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ListOptionsButton } from '../buttons/ListOptionsButton';
import { AddCardButton } from '../buttons/AddCardButton';
import { ListCards } from '../cards/ListCards';
import { classNames } from '@/utils';
import { useOutsideAlerter } from '@/hooks';
import { List, User } from '@/types';

interface IFormValues {
	title: string;
}

interface Props {
	list: List;
	members: User[];
}

export const ListItem: React.FC<Props> = ({ list, members }) => {
	const [isEdittingMode, setIsEdittingMode] = useState(false);
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

	const wrapperRef = useRef<HTMLFormElement>(null);
	useOutsideAlerter(wrapperRef, handleClose);

	return (
		<li className='w-[300px]' key={list.id}>
			<div className='flex items-center justify-between'>
				{isEdittingMode ? (
					<form
						ref={wrapperRef}
						onSubmit={handleSubmit(handleUpdateList)}
						autoComplete='off'
						className={`${
							isEdittingMode
								? 'opacity-1 w-[300px] mr-4 visible'
								: 'opacity-0 w-0 mr-0 invisible'
						} relative transition-all !duration-300`}>
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
					</form>
				) : (
					<h3 className='text-lg font-medium'>{list.title}</h3>
				)}
				{!isEdittingMode && (
					<ListOptionsButton
						list={list}
						toggleEditListTitle={toggleEditListTitle}
					/>
				)}
			</div>
			<ListCards cards={list.cards} listTitle={list.title} members={members} />
			<AddCardButton listId={list.id} />
		</li>
	);
};
