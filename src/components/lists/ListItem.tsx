'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button, Input } from '@nextui-org/react';
import { RxCross1 } from 'react-icons/rx';
import { AiOutlineCheck } from 'react-icons/ai';
import { ListOptionsButton } from '../buttons/ListOptionsButton';
import { AddCardButton } from '../buttons/AddCardButton';
import { ListCards } from '../cards/ListCards';
import { List } from '@/types';

interface IFormValues {
	title: string;
}

interface Props {
	list: List;
}

export const ListItem: React.FC<Props> = ({ list }) => {
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

	const handleCancel = () => {
		setIsEdittingMode(false);
		reset();
	};

	return (
		<li className='w-[300px]' key={list.id}>
			<div className='flex items-center justify-between'>
				{isEdittingMode ? (
					<form
						onSubmit={handleSubmit(handleUpdateList)}
						autoComplete='off'
						className='relative flex-1'>
						<Input
							autoFocus
							isClearable
							variant='bordered'
							color={errors.title ? 'danger' : undefined}
							errorMessage={errors.title?.message}
							classNames={{
								input: 'text-lg font-medium',
							}}
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
								color='primary'>
								<AiOutlineCheck />
							</Button>
						</div>
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
			<ListCards cards={list.cards} listTitle={list.title} />
			<AddCardButton listId={list.id} />
		</li>
	);
};
