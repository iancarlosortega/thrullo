'use client';

import { useEffect, useState } from 'react';
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
	useDisclosure,
} from '@nextui-org/react';
import { HiPencil, HiPhotograph, HiUsers } from 'react-icons/hi';
import { FaUserCircle } from 'react-icons/fa';
import { useDebounce } from '@/hooks';
import { IoDocumentTextSharp } from 'react-icons/io5';
import { AiOutlineMinus } from 'react-icons/ai';
import { ProfilePhoto } from '../UI/ProfilePhoto';
import { ConfirmRemoveCardMember } from './ConfirmRemoveCardMember';
import { Card, Database, User } from '@/types';
import { AddCardLabelsButton } from '../buttons/AddCardLabelsButton';
import { AddCardMembersButton } from '../buttons/AddCardMembersButton';

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
	const { id, title, description, cover_url, updated_at, assigned_users } =
		card;

	const [cardDescription, setCardDescription] = useState(description || '');
	const debouncedInputValue = useDebounce(cardDescription, 2000);
	const [isUpdatingDescription, setIsUpdatingDescription] = useState(false);
	const [selectedMember, setSelectedMember] = useState('');
	const [isEdittingMode, setIsEdittingMode] = useState(false);
	const {
		isOpen: isDeleteMenuOpen,
		onOpen: onDeleteMenuOpen,
		onOpenChange: onDeleteMenuOpenChange,
		onClose: onDeleteMenuClose,
	} = useDisclosure();
	const supabase = createClientComponentClient<Database>();

	const handleInputChange = (e: any) => {
		setIsUpdatingDescription(true);
		setCardDescription(e.target.value);
	};

	useEffect(() => {
		setIsEdittingMode(false);
	}, [isOpen]);

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
							{cover_url && (
								<div>
									<Image
										src={cover_url}
										alt='Cover Image'
										width={180}
										height={120}
										className='w-full h-[120px] rounded-lg aspect-video object-cover'
									/>
								</div>
							)}

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

										<div className='my-2'>
											{assigned_users.length === 0 && (
												<AddCardMembersButton
													members={members}
													card={card}
													variant='tertiary'
												/>
											)}

											<AddCardLabelsButton card={card} />

											<Button
												className='bg-secondary-lts text-secondary dark:bg-neutral-950/50 font-medium justify-start w-[160px] my-2'
												startContent={<HiPhotograph />}>
												Cover
											</Button>
										</div>
									</section>

									{assigned_users.length > 0 && (
										<section className='mt-4 w-full'>
											<div className='flex items-center gap-2 '>
												<HiUsers className='text-secondary-lt font-semibold' />
												<p className='text-sm text-secondary-lt font-semibold'>
													Members
												</p>
											</div>
											<ul className='my-4'>
												{assigned_users.map(member => (
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
																	onPress={() => {
																		setSelectedMember(member.id);
																		onDeleteMenuOpen();
																	}}
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
															memberId={selectedMember}
															cardId={card.id}
														/>
													</li>
												))}
											</ul>
											<AddCardMembersButton
												members={members}
												card={card}
												variant='secondary'
											/>
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
