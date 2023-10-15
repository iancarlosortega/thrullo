'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { AnimatePresence, motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { AiOutlinePlus } from 'react-icons/ai';
import { classNames } from '@/utils';
import { useOutsideAlerter } from '@/hooks';

interface Props {
	boardId: string;
}

interface IFormValues {
	title: string;
}

export const AddListButton: React.FC<Props> = ({ boardId }) => {
	const [isCreatingMode, setIsCreatingMode] = useState(false);
	const supabase = createClientComponentClient();
	const router = useRouter();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<IFormValues>();

	const handleAddList = async ({ title }: IFormValues) => {
		const { error } = await supabase.from('lists').insert({
			title,
			board_id: boardId,
		});

		if (error) {
			console.error(error);
			toast.error(error.message);
			return;
		}

		toast.success('List created successfully');
		router.refresh();
		setIsCreatingMode(false);
		reset();
	};

	const handleClose = () => {
		setIsCreatingMode(false);
		reset();
	};

	const wrapperRef = useRef<HTMLFormElement>(null);
	useOutsideAlerter(wrapperRef, handleClose);

	return (
		<div className='flex ml-6 items-start'>
			<AnimatePresence>
				{isCreatingMode && (
					<motion.form
						ref={wrapperRef}
						initial={{ opacity: 0, width: 0, marginRight: 0 }}
						animate={{ opacity: 1, width: 300, marginRight: 16 }}
						exit={{ opacity: 0, width: 0, marginRight: 0 }}
						onSubmit={handleSubmit(handleAddList)}
						autoComplete='off'>
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

							<button
								disabled={isSubmitting}
								type='submit'
								className={classNames(
									'mt-2 py-2 px-6 bg-[#219653] text-white text-sm rounded-xl',
									'hover:bg-[#1E8449] transition-colors duration-200',
									'disabled:bg-[#BDBDBD] disabled:cursor-not-allowed'
								)}>
								Save
							</button>
						</div>
						{errors.title && (
							<span className='text-sm text-red-500 my-4'>
								{errors.title.message}
							</span>
						)}
					</motion.form>
				)}
			</AnimatePresence>

			<button
				onClick={() => setIsCreatingMode(true)}
				className={classNames(
					'bg-[#DAE4FD] px-4 py-3 flex justify-between items-center',
					'rounded-2xl text-primary text-sm w-[300px] font-medium',
					'hover:bg-[#E1E7FD] transition-colors duration-200',
					'dark:bg-sky-500/10 dark:border-sky-500/20',
					'dark:hover:bg-sky-500/20 dark:hover:border-sky-500/30'
				)}>
				Add another list
				<AiOutlinePlus className='text-2xl' />
			</button>
		</div>
	);
};
