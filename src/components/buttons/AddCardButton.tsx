'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { AiOutlinePlus } from 'react-icons/ai';
import { useOutsideAlerter } from '@/hooks';
import { classNames } from '@/utils';

interface Props {
	listId: string;
}

interface IFormValues {
	title: string;
}

export const AddCardButton: React.FC<Props> = ({ listId }) => {
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
		const { error } = await supabase.from('cards').insert({
			title,
			list_id: listId,
		});

		if (error) {
			console.error(error);
			toast.error(error.message);
			return;
		}

		toast.success('Card created successfully');
		router.refresh();
		setIsCreatingMode(false);
		reset();
	};

	const handleCancel = () => {
		setIsCreatingMode(false);
		reset();
	};

	const wrapperRef = useRef<HTMLFormElement>(null);
	useOutsideAlerter(wrapperRef, handleCancel);

	return (
		<div className='flex flex-col items-start mt-4'>
			<form
				ref={wrapperRef}
				onSubmit={handleSubmit(handleAddList)}
				autoComplete='off'
				className={`${
					isCreatingMode
						? 'opacity-1 h-[150px] visible'
						: 'opacity-0 h-0 invisible'
				} relative transition-all !duration-300 w-full`}>
				<div
					className={classNames(
						'p-4 rounded-xl border shadow-[0px_2px_8px_0px_rgba(0,0,0,0.10)]',
						'grid place-items-start bg-white',
						`${errors.title ? 'border-red-300' : 'border-[#E0E0E0]'}`
					)}>
					<textarea
						placeholder='Enter a title for this card...'
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
							'hover:bg-[#1E8449] transition-all duration-200',
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
			</form>
			<button
				onClick={() => setIsCreatingMode(true)}
				className={classNames(
					'bg-[#DAE4FD] px-4 py-3 flex justify-between items-center',
					'rounded-2xl text-primary text-sm w-[300px] font-medium',
					'hover:bg-[#E1E7FD] transition-all duration-200'
				)}>
				Add another card
				<AiOutlinePlus className='text-2xl' />
			</button>
		</div>
	);
};
