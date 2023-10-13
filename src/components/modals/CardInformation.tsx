'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'sonner';
import {
	Modal,
	ModalContent,
	ModalBody,
	Button,
	UseDisclosureProps,
	Textarea,
	Spinner,
} from '@nextui-org/react';
import { Card, Database } from '@/types';
import { HiPencil, HiPhotograph, HiUsers } from 'react-icons/hi';
import { MdLabel } from 'react-icons/md';
import { FaUserCircle } from 'react-icons/fa';
import { useDebounce } from '@/hooks';
import { IoDocumentTextSharp } from 'react-icons/io5';
import { LabelsMenu } from '../menus/LabelsMenu';
import useUIStore from '@/store/uiStore';

interface Props {
	card: Card;
	listTitle: string;
}

export const CardInformation = ({
	isOpen,
	onChange,
	onClose,
	card,
	listTitle,
}: UseDisclosureProps & Props) => {
	const { id, title, description, cover_url, updated_at } = card;

	const [cardDescription, setCardDescription] = useState(description || '');
	const debouncedInputValue = useDebounce(cardDescription, 2000);
	const [isUpdatingDescription, setIsUpdatingDescription] = useState(false);
	const [isEdittingMode, setIsEdittingMode] = useState(false);

	const { setIsLabelMenuOpen } = useUIStore();
	const router = useRouter();
	const supabase = createClientComponentClient<Database>();

	const handleInputChange = (e: any) => {
		setIsUpdatingDescription(true);
		setCardDescription(e.target.value);
	};

	useEffect(() => {
		if (!isOpen) return;
		setIsLabelMenuOpen(false);
		setIsEdittingMode(false);
	}, [isOpen, setIsLabelMenuOpen]);

	useEffect(() => {
		if (debouncedInputValue === description) return;
		updateBoardDescription();
	}, [debouncedInputValue, description]);

	const updateBoardDescription = async () => {
		const { error } = await supabase
			.from('cards')
			.update({
				description: debouncedInputValue,
				updated_at: new Date().toISOString(),
			})
			.eq('id', id);

		if (error) {
			console.log(error);
			toast.error(error.message);
			return;
		}

		setIsUpdatingDescription(false);
	};

	return (
		<Modal
			backdrop='opaque'
			isOpen={isOpen}
			onOpenChange={onChange}
			placement='top'
			size='lg'
			classNames={{
				base: 'max-w-[90vw] w-[800px] overflow-visible',
				closeButton:
					'bg-primary hover:bg-blue-400 transition-colors text-white rounded-lg text-2xl font-bold',
			}}>
			<ModalContent>
				{onClose => (
					<>
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

							<div className='grid gap-6 md:grid-cols-[75%_25%] my-4'>
								<div>
									<header className='mb-4'>
										<h3 className='font-medium text-xl'>{title}</h3>
										<p className='text-secondary text-sm font-semibold'>
											in list{' '}
											<span className='text-tertiary dark:text-secondary-lt'>
												{listTitle}
											</span>
										</p>
									</header>

									<section>
										<div className='flex items-center gap-6'>
											<div className='flex items-center gap-2'>
												<IoDocumentTextSharp className='text-secondary-lt font-semibold' />
												<p className='text-sm text-secondary-lt font-semibold'>
													Description
												</p>
											</div>
											<Button
												variant='bordered'
												className='text-secondary'
												onPress={() => setIsEdittingMode(!isEdittingMode)}
												startContent={<HiPencil />}>
												Edit
											</Button>
										</div>
										{isEdittingMode ? (
											<div className='mb-4'>
												<Textarea
													placeholder='Enter a card description'
													value={cardDescription}
													onChange={handleInputChange}
												/>
												<div className='w-full flex justify-end pr-2 pt-2'>
													{isUpdatingDescription ? (
														<Spinner
															size='sm'
															classNames={{
																circle1: 'dark:border-b-gray-lts',
																circle2: 'dark:border-b-gray-lts',
															}}
														/>
													) : (
														<span className='text-tiny font-semibold text-secondary-lt'>
															Last update{' '}
															{new Date(updated_at).toLocaleString()}
														</span>
													)}
												</div>
											</div>
										) : (
											<>
												{cardDescription ? (
													<p className='mt-4 mb-8'>{cardDescription}</p>
												) : (
													<p className='text-sm text-gray-400 italic'>
														No description
													</p>
												)}
											</>
										)}
									</section>
								</div>

								{/* Actions */}
								<aside>
									<div className='flex items-center gap-2 '>
										<FaUserCircle className='text-secondary-lt font-semibold' />
										<p className='text-sm text-secondary-lt font-semibold'>
											Actions
										</p>
									</div>
									<Button
										className='bg-secondary-lts text-secondary dark:bg-neutral-950/50 font-medium justify-start w-[160px] my-2'
										startContent={<HiUsers />}>
										Members
									</Button>
									<div className='relative'>
										<Button
											onPress={() => setIsLabelMenuOpen(true)}
											className='bg-secondary-lts text-secondary dark:bg-neutral-950/50 font-medium justify-start w-[160px] my-2'
											startContent={<MdLabel />}>
											Labels
										</Button>
										<LabelsMenu card={card} />
									</div>
									<Button
										className='bg-secondary-lts text-secondary dark:bg-neutral-950/50 font-medium justify-start w-[160px] my-2'
										startContent={<HiPhotograph />}>
										Cover
									</Button>
								</aside>
							</div>
						</ModalBody>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};
