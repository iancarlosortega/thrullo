'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
	Modal,
	ModalContent,
	ModalBody,
	ModalFooter,
	Button,
	Input,
	UseDisclosureProps,
	Textarea,
} from '@nextui-org/react';
import { AiFillLock, AiOutlinePlus } from 'react-icons/ai';
import { HiPhotograph } from 'react-icons/hi';
import { BiWorld } from 'react-icons/bi';
import useAuthStore from '@/store/authStore';
import { Database } from '@/types';

interface IFormValues {
	title: string;
	description?: string;
	coverUrl?: string;
}

export const AddNewBoard = ({
	isOpen,
	onChange,
	onClose,
}: UseDisclosureProps) => {
	const [isPublic, setisPublic] = useState(false);
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
		if (!isOpen) {
			reset();
		}
	}, [isOpen, reset]);

	const onSubmit = async ({ title, description, coverUrl }: IFormValues) => {
		const { data, error } = await supabase
			.from('boards')
			.insert({
				title,
				description,
				is_public: isPublic,
				cover_url: coverUrl,
				owner: user!.id,
			})
			.select();

		if (error) {
			toast.error(error.message);
			return;
		}

		if (data) {
			toast.success('Board added successfully');
			reset();
			onClose!();
			router.push(`/boards/${data[0].id}`);
		}
	};

	return (
		<Modal
			backdrop='opaque'
			isOpen={isOpen}
			onOpenChange={onChange}
			placement='top'
			classNames={{
				closeButton:
					'bg-primary hover:bg-blue-400 transition-colors text-white rounded-lg text-2xl font-bold',
			}}>
			<ModalContent>
				{onClose => (
					<>
						<form
							onSubmit={handleSubmit(onSubmit)}
							autoComplete='off'
							className='my-4'>
							<ModalBody>
								<div>
									<Image
										src='https://static.vecteezy.com/system/resources/thumbnails/002/292/582/small/elegant-black-and-gold-banner-background-free-vector.jpg'
										alt='Cover Image'
										width={180}
										height={120}
										className='w-full h-[120px] rounded-lg aspect-video object-cover'
									/>
								</div>
								<Input
									autoFocus
									type='text'
									placeholder='Add board title'
									color={errors.title ? 'danger' : undefined}
									errorMessage={errors.title?.message}
									isClearable
									radius='lg'
									classNames={{
										inputWrapper:
											'group-data-[focus-visible=true]:ring-primary',
									}}
									{...register('title', {
										required: 'This field is required',
										minLength: {
											value: 3,
											message: 'Category must be at least 3 characters long',
										},
									})}
								/>

								<Textarea
									type='text'
									placeholder='Enter a description (optional)'
									{...register('description')}
								/>

								<div className='flex justify-between'>
									<Button
										size='lg'
										className='bg-secondary-lts text-secondary font-medium w-[150px]'
										startContent={<HiPhotograph />}>
										Cover
									</Button>
									<Button
										size='lg'
										className={`${
											isPublic
												? 'bg-gradient-to-r from-sky-600 to-sky-500 text-white'
												: 'bg-secondary-lts text-secondary'
										} font-medium w-[150px]`}
										startContent={isPublic ? <BiWorld /> : <AiFillLock />}
										onPress={() => setisPublic(!isPublic)}>
										{isPublic ? 'Public ' : 'Private'}
									</Button>
								</div>
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
									className='font-medium'
									color='primary'
									type='submit'
									isDisabled={isSubmitting}
									startContent={<AiOutlinePlus />}>
									Create
								</Button>
							</ModalFooter>
						</form>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};
