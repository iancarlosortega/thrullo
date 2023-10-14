'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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
	useDisclosure,
} from '@nextui-org/react';
import { HiPencil, HiPhotograph, HiUsers } from 'react-icons/hi';
import { MdLabel } from 'react-icons/md';
import { FaUserCircle } from 'react-icons/fa';
import { useDebounce } from '@/hooks';
import { IoDocumentTextSharp } from 'react-icons/io5';
import { LabelsMenu } from '../menus/LabelsMenu';
import { MembersMenu } from '../menus/MembersMenu';
import useUIStore from '@/store/uiStore';
import { Card, Database, User } from '@/types';
import { ProfilePhoto } from '../UI/ProfilePhoto';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { classNames } from '@/utils';
import { ConfirmRemoveCardMember } from './ConfirmRemoveCardMember';

interface Props {
	card: Card;
	listTitle: string;
	members: User[];
}

export const CardInformation = ({
	isOpen,
	onChange,
	onClose,
	card,
	listTitle,
	members,
}: UseDisclosureProps & Props) => {
	const { id, title, description, cover_url, updated_at } = card;
	const assignedUsers = card.assigned_users.map((user: any) => user.user_id);

	const [cardDescription, setCardDescription] = useState(description || '');
	const debouncedInputValue = useDebounce(cardDescription, 2000);
	const [isUpdatingDescription, setIsUpdatingDescription] = useState(false);
	const [isEdittingMode, setIsEdittingMode] = useState(false);

	const setIsLabelMenuOpen = useUIStore(state => state.setIsLabelMenuOpen);
	const setIsMembersMenuOpen = useUIStore(state => state.setIsMembersMenuOpen);
	const {
		isOpen: isDeleteMenuOpen,
		onOpen: onDeleteMenuOpen,
		onOpenChange: onDeleteMenuOpenChange,
		onClose: onDeleteMenuClose,
	} = useDisclosure();
	const supabase = createClientComponentClient<Database>();
	const router = useRouter();

	const handleInputChange = (e: any) => {
		setIsUpdatingDescription(true);
		setCardDescription(e.target.value);
	};

	useEffect(() => {
		if (!isOpen) return;
		setIsLabelMenuOpen(false);
		setIsMembersMenuOpen(false);
		setIsEdittingMode(false);
	}, [isOpen, setIsLabelMenuOpen, setIsMembersMenuOpen]);

	useEffect(() => {
		if (debouncedInputValue === description) return;

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

		updateBoardDescription();
	}, [debouncedInputValue, description, id, supabase]);

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

							<div className='grid gap-6 md:grid-cols-[65%_35%] my-4'>
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
								<aside className='w-[90%]'>
									<section>
										<div className='flex items-center gap-2 '>
											<FaUserCircle className='text-secondary-lt font-semibold' />
											<p className='text-sm text-secondary-lt font-semibold'>
												Actions
											</p>
										</div>

										{assignedUsers.length === 0 && (
											<div className='relative'>
												<Button
													onPress={() => setIsMembersMenuOpen(true)}
													className='bg-secondary-lts text-secondary dark:bg-neutral-950/50 font-medium justify-start w-[160px] my-2'
													startContent={<HiUsers />}>
													Members
												</Button>
												<MembersMenu members={members} card={card} />
											</div>
										)}

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
									</section>

									{assignedUsers.length > 0 && (
										<section className='mt-4 w-full'>
											<div className='flex items-center gap-2 '>
												<HiUsers className='text-secondary-lt font-semibold' />
												<p className='text-sm text-secondary-lt font-semibold'>
													Members
												</p>
											</div>
											<ul className='my-4'>
												{assignedUsers.map(member => (
													<li key={member.id}>
														<div className='flex items-center justify-between my-2'>
															<div className='flex items-center gap-2'>
																<ProfilePhoto user={member} />
																<p className='text-sm text-secondary dark:text-secondary-lt'>
																	{member.full_name}
																</p>
															</div>
															<div>
																<Button
																	onPress={onDeleteMenuOpen}
																	isIconOnly
																	radius='full'
																	color='danger'
																	variant='flat'
																	size='sm'>
																	<AiOutlineMinus />
																</Button>
															</div>
														</div>
														<ConfirmRemoveCardMember
															isOpen={isDeleteMenuOpen}
															onChange={onDeleteMenuOpenChange}
															onClose={onDeleteMenuClose}
															memberId={member.id}
															cardId={card.id}
														/>
													</li>
												))}
											</ul>
											<div className='relative'>
												<button
													onClick={() => setIsMembersMenuOpen(true)}
													className={classNames(
														'bg-[#DAE4FD] px-4 py-3 flex justify-between items-center',
														'rounded-2xl text-primary text-sm w-full font-medium',
														'dark:bg-sky-500/10 dark:border-sky-500/20',
														'hover:bg-[#E1E7FD] transition-all duration-200'
													)}>
													Add another list
													<AiOutlinePlus className='text-2xl' />
												</button>
												<MembersMenu members={members} card={card} />
											</div>
										</section>
									)}
								</aside>
							</div>
						</ModalBody>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};
