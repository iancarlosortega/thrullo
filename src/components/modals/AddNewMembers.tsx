'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
	Modal,
	ModalContent,
	ModalBody,
	ModalFooter,
	Button,
	UseDisclosureProps,
	Select,
	Chip,
	SelectItem,
	Avatar,
} from '@nextui-org/react';
import { AiOutlineCheck } from 'react-icons/ai';
import useAuthStore from '@/store/authStore';
import { Database, User } from '@/types';

interface Props {
	boardId: string;
}

interface IFormValues {
	users: string;
}

export const AddNewMembers = ({
	isOpen,
	onChange,
	onClose,
	boardId,
}: UseDisclosureProps & Props) => {
	const [users, setUsers] = useState<User[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const { user } = useAuthStore();
	const {
		register,
		reset,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<IFormValues>();
	const router = useRouter();
	const supabase = createClientComponentClient<Database>();

	useEffect(() => {
		const fetchUsers = async () => {
			const { data, error } = await supabase
				.from('users')
				.select('*')
				.neq('id', user!.id);

			if (error) {
				toast.error(error.message);
				return;
			}

			setUsers(data);
			setIsLoading(false);
		};

		fetchUsers();
	}, [supabase, user]);

	useEffect(() => {
		if (!isOpen) {
			reset();
		}
	}, [isOpen, reset]);

	const onSubmit = async ({ users }: IFormValues) => {
		if (users === '' || users.length === 0) return onClose!();

		const usersArr = users.split(',');

		usersArr.forEach(async userId => {
			const { error } = await supabase.from('members').insert({
				user_id: userId,
				board_id: boardId,
			});

			if (error) {
				toast.error(error.message);
				return;
			}
		});

		toast.success('Members added successfully');
		reset();
		onClose!();
		router.refresh();
	};

	return (
		<Modal
			backdrop='opaque'
			isOpen={isOpen}
			onOpenChange={onChange}
			placement='top'
			classNames={{
				backdrop:
					'bg-gradient-to-t from-zinc-300 to-zinc-300/10 backdrop-opacity-20',
			}}>
			<ModalContent>
				{onClose => (
					<>
						<form
							onSubmit={handleSubmit(onSubmit)}
							autoComplete='off'
							className='my-4'>
							<ModalBody>
								<Select
									items={users}
									label='Add new members'
									variant='bordered'
									isMultiline={true}
									selectionMode='multiple'
									placeholder='Select a user'
									labelPlacement='outside'
									classNames={{
										trigger: 'min-h-unit-12 py-2',
									}}
									{...register('users')}
									renderValue={items => {
										return (
											<div className='flex flex-wrap gap-2'>
												{items.map(item => (
													<Chip
														radius='md'
														variant='bordered'
														classNames={{
															content: 'text-sky-500',
															base: 'bg-sky-50 border-sky-500',
														}}
														key={item.key}>
														{item.data?.full_name}
													</Chip>
												))}
											</div>
										);
									}}>
									{user => (
										<SelectItem key={user.id} textValue={user.full_name}>
											<div className='flex gap-2 items-center'>
												<Avatar
													alt={user.full_name}
													className='flex-shrink-0'
													size='sm'
													src={user.avatar_url || undefined}
												/>
												<div className='flex flex-col'>
													<span className='text-small'>{user.full_name}</span>
													<span className='text-tiny text-default-400'>
														{user.email}
													</span>
												</div>
											</div>
										</SelectItem>
									)}
								</Select>
							</ModalBody>
							<ModalFooter>
								<Button
									className='font-medium'
									color='secondary'
									variant='light'
									onPress={onClose}>
									Cancel
								</Button>
								<Button
									className='font-medium bg-primary text-white'
									type='submit'
									isDisabled={isSubmitting}
									startContent={<AiOutlineCheck />}>
									Confirm
								</Button>
							</ModalFooter>
						</form>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};
