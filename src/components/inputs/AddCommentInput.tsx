'use client';

import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ProfilePhoto } from '../UI/ProfilePhoto';
import { classNames } from '@/utils';
import { Database, User } from '@/types';

interface Props {
	cardId: string;
	user: User;
}

interface IFormValues {
	content: string;
}

export const AddCommentInput: React.FC<Props> = ({ cardId, user }) => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<IFormValues>();

	const supabase = createClientComponentClient<Database>();
	const router = useRouter();

	const handlePressEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(handleAddComment)(e);
		}
	};

	const handleAddComment = async ({ content }: IFormValues) => {
		const { error } = await supabase.from('comments').insert({
			content,
			card_id: cardId,
			user_id: user!.id,
		});

		if (error) {
			console.error(error);
			toast.error(error.message);
			return;
		}

		toast.success('Comment created successfully');
		router.refresh();
		reset();
	};

	return (
		<form autoComplete='off' onSubmit={handleSubmit(handleAddComment)}>
			<div
				className={classNames(
					'p-4 rounded-xl border shadow-[0px_2px_8px_0px_rgba(0,0,0,0.10)]',
					'flex gap-4 bg-white dark:bg-neutral-800',
					`${
						errors.content
							? 'border-red-300'
							: 'border-[#E0E0E0] dark:border-neutral-700'
					}`
				)}>
				<div>
					<ProfilePhoto user={user!} />
				</div>
				<div className='flex-1 flex flex-col items-end'>
					<textarea
						onKeyDown={handlePressEnter}
						placeholder='Write a comment...'
						className={classNames(
							'bg-transparent focus:outline-none w-full resize-none',
							`${errors.content && 'placeholder:text-red-500'}`
						)}
						{...register('content', {
							required: 'Content is required',
							minLength: {
								value: 3,
								message: 'Content must be at least 3 characters long',
							},
							maxLength: {
								value: 300,
								message: 'Content must be at most 300 characters long',
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
			</div>
			{errors.content && (
				<span className='text-sm text-red-500 my-4'>
					{errors.content.message}
				</span>
			)}
		</form>
	);
};
