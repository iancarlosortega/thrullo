'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button, Input } from '@nextui-org/react';
import { AiOutlineCheck, AiOutlinePlus } from 'react-icons/ai';
import { RxCross1 } from 'react-icons/rx';
import { classNames } from '@/utils';

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

	const handleCancel = () => {
		setIsCreatingMode(false);
		reset();
	};

	return (
		<div className='flex gap-6 items-center'>
			<form
				onSubmit={handleSubmit(handleAddList)}
				autoComplete='off'
				className={`${
					isCreatingMode
						? 'opacity-1 w-[300px] visible ml-6'
						: 'opacity-0 w-0 invisible ml-0'
				} relative transition-all duration-1000`}>
				<Input
					isClearable
					variant='faded'
					placeholder='Enter list title'
					className='w-[300px]'
					color={errors.title ? 'danger' : undefined}
					errorMessage={errors.title?.message}
					{...register('title', {
						required: 'Title is required',
						minLength: {
							value: 3,
							message: 'Title must be at least 3 characters long',
						},
					})}
				/>
				<div className='absolute top-[45px] right-0 flex items-center gap-2'>
					<Button
						size='sm'
						isIconOnly
						radius='full'
						variant='bordered'
						onPress={handleCancel}>
						<RxCross1 />
					</Button>
					<Button
						type='submit'
						isDisabled={isSubmitting}
						size='sm'
						isIconOnly
						radius='full'
						color='success'
						className='text-white'>
						<AiOutlineCheck />
					</Button>
				</div>
			</form>
			<button
				onClick={() => setIsCreatingMode(true)}
				className={classNames(
					'bg-[#DAE4FD] px-4 py-3 flex justify-between items-center',
					'rounded-2xl text-primary text-sm w-[300px] font-medium',
					'hover:bg-[#E1E7FD] transition-all duration-200'
				)}>
				Add another list
				<AiOutlinePlus className='text-2xl' />
			</button>
		</div>
	);
};
