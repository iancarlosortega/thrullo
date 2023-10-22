'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useForm } from 'react-hook-form';
import { useDisclosure } from '@nextui-org/react';
import { toast } from 'sonner';
import { ProfilePhoto } from '../UI/ProfilePhoto';
import { Comment, Database, User } from '@/types';
import { classNames, formatDate } from '@/utils';
import { ConfirmDeleteComment } from '../modals/ConfirmDeleteComment';

interface Props {
	comment: Comment;
	user: User;
}

interface IFormValues {
	content: string;
}

export const CommentsListItem: React.FC<Props> = ({ comment, user }) => {
	const [isEdittingMode, setIsEdittingMode] = useState(false);
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<IFormValues>({
		defaultValues: {
			content: comment.content,
		},
	});

	const supabase = createClientComponentClient<Database>();
	const router = useRouter();

	const handlePressEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(handleUpdateComment)(e);
		}
	};

	const handleUpdateComment = async ({ content }: IFormValues) => {
		const { error } = await supabase
			.from('comments')
			.update({
				content,
				udpated_at: new Date().toISOString(),
			})
			.match({ id: comment.id });

		if (error) {
			console.error(error);
			toast.error(error.message);
			return;
		}

		setIsEdittingMode(false);
		toast.success('Comment updated successfully');
		router.refresh();
	};

	return (
		<>
			<li className='border-b border-[#F2F2F2] dark:border-gray-500 my-4'>
				<div>
					<div>
						<div className='flex justify-between items-start'>
							<div className='flex items-center gap-2'>
								<ProfilePhoto user={comment.user} />
								<div className='font-semibold'>
									<p>{comment.user.full_name}</p>
									<p className='text-xs text-secondary-lt'>
										{new Date(comment.created_at).toLocaleDateString()} at{' '}
										{new Date(comment.created_at).toLocaleTimeString()}
									</p>
								</div>
							</div>
							{comment.user.id === user?.id && (
								<div className='flex items-center gap-2'>
									<button
										className='hover:text-secondary-lt transition-all duration-200'
										onClick={() => {
											reset();
											setIsEdittingMode(!isEdittingMode);
										}}>
										Edit
									</button>
									<span>-</span>
									<button
										className='hover:text-secondary-lt transition-all duration-200'
										onClick={onOpen}>
										Delete
									</button>
								</div>
							)}
						</div>
						{isEdittingMode ? (
							<form
								onSubmit={handleSubmit(handleUpdateComment)}
								autoComplete='off'
								className='w-full my-3'>
								<div
									className={classNames(
										'p-4 rounded-xl border shadow-[0px_2px_8px_0px_rgba(0,0,0,0.10)]',
										'grid place-items-start bg-white dark:bg-neutral-800',
										`${
											errors.content
												? 'border-red-300'
												: 'border-[#E0E0E0] dark:border-neutral-700'
										}`
									)}>
									<textarea
										placeholder='Write a comment...'
										className={classNames(
											'bg-transparent focus:outline-none w-full resize-none',
											`${errors.content && 'placeholder:text-red-500'}`
										)}
										onKeyDown={handlePressEnter}
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

									<div className='mt-4 flex justify-end w-full items-center gap-2'>
										<button
											onClick={() => {
												reset();
												setIsEdittingMode(false);
											}}
											className={classNames(
												'py-2 px-6 bg-gray-300 text-sm rounded-xl',
												'hover:bg-gray-200 transition-all duration-200',
												'dark:bg-tertiary dark:text-white dark:hover:bg-neutral-900'
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
											Update
										</button>
									</div>
								</div>
								{errors.content && (
									<span className='text-sm text-red-500 my-4'>
										{errors.content.message}
									</span>
								)}
							</form>
						) : (
							<p className='my-3'>{comment.content}</p>
						)}
					</div>
				</div>
			</li>
			<ConfirmDeleteComment
				isOpen={isOpen}
				onChange={onOpenChange}
				onClose={onClose}
				commentId={comment.id}
			/>
		</>
	);
};
