'use client';

import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'sonner';
import { Avatar, Button, useDisclosure } from '@nextui-org/react';
import { AiOutlineClose, AiOutlineTeam } from 'react-icons/ai';
import { FaUserCircle } from 'react-icons/fa';
import useUIStore from '@/store/uiStore';
import useAuthStore from '@/store/authStore';
import { ConfirmRemoveMember } from '@/components/modals/ConfirmRemoveMember';
import { UpdateDescriptionInput } from '../inputs/UpdateDescriptionInput';
import { classNames, formatDate } from '@/utils';
import { useOutsideAlerter } from '@/hooks';
import { Board, User } from '@/types';

interface Props {
	board: Board;
	members: User[];
}

export const BoardInformation: React.FC<Props> = ({ board, members }) => {
	const [memberToRemove, setMemberToRemove] = useState('');
	const user = useAuthStore(state => state.user);
	const isBoardInformationOpen = useUIStore(
		state => state.isBoardInformationOpen
	);
	const setIsBoardInformationOpen = useUIStore(
		state => state.setIsBoardInformationOpen
	);
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
	const supabase = createClientComponentClient();

	const closeBoardInformation = () => {
		setIsBoardInformationOpen(false);
	};

	const wrapperRef = useRef(null);
	useOutsideAlerter(wrapperRef, closeBoardInformation);

	const handleRemoveMember = async (memberId: string) => {
		setMemberToRemove(memberId);
		onOpen();
	};

	const updateBoardDescription = async (description: string) => {
		const { error } = await supabase
			.from('boards')
			.update({
				description,
				updated_at: new Date(),
			})
			.eq('id', board.id);

		if (error) {
			console.log(error);
			toast.error(error.message);
			return;
		}
	};

	return (
		<AnimatePresence>
			{isBoardInformationOpen && (
				<motion.aside
					ref={wrapperRef}
					initial={{ x: '100%' }}
					animate={{ x: 0 }}
					exit={{ x: '100%' }}
					transition={{ duration: 0.3 }}
					className={classNames(
						'w-[400px] max-w-[80%] h-[calc(100vh-5rem)] px-8 py-4 flex flex-col ',
						'bg-white dark:bg-neutral-900 fixed top-20 right-0 z-50 overflow-y-auto'
					)}>
					<header className='flex items-center justify-between'>
						<h3 className='font-semibold text-slate-900 dark:text-secondary-lts'>
							{board.title}
						</h3>
						<button onClick={() => setIsBoardInformationOpen(false)}>
							<AiOutlineClose className='text-[#4F4F4F]' />
						</button>
					</header>
					<hr className='my-4' />
					<section className='mb-4'>
						<div className='flex items-center gap-2 '>
							<FaUserCircle className='text-secondary-lt font-semibold' />
							<p className='text-sm text-secondary-lt font-semibold'>Made by</p>
						</div>
						<div className='flex gap-2 items-center mt-2'>
							<Avatar
								radius='sm'
								alt={board.owner.full_name}
								className='flex-shrink-0'
								size='sm'
								src={board.owner.avatar_url || undefined}
							/>
							<div className='flex flex-col'>
								<span className='text-small font-semibold text-tertiary dark:text-secondary-lts'>
									{board.owner.full_name}
								</span>
								<span className='text-tiny font-semibold text-secondary-lt'>
									{formatDate(board.created_at)}
								</span>
							</div>
						</div>
					</section>

					<section className='mb-4'>
						<UpdateDescriptionInput
							canEdit={user?.id === board.owner.id}
							description={board.description ?? ''}
							updated_at={board.updated_at}
							updateDescription={updateBoardDescription}
						/>
					</section>

					<section className='mb-2'>
						<div className='flex items-center gap-2'>
							<AiOutlineTeam className='text-secondary-lt font-semibold' />
							<p className='text-sm text-secondary-lt font-semibold'>Team</p>
						</div>
						<ul className='mt-2'>
							<li className='flex items-center justify-between mt-2'>
								<div className='flex gap-2 items-center'>
									<Avatar
										radius='sm'
										alt={board.owner.full_name}
										className='flex-shrink-0'
										size='sm'
										src={board.owner.avatar_url || undefined}
									/>
									<span className='text-small font-semibold text-tertiary dark:text-secondary-lts'>
										{board.owner.full_name}
									</span>
								</div>
								<Button
									variant='light'
									color='secondary'
									isDisabled
									className='px-6 dark:text-secondary-lts'>
									Admin
								</Button>
							</li>
							{members.map(member => (
								<li
									key={member.id}
									className='flex items-center justify-between my-4'>
									<div className='flex gap-2 items-center'>
										<Avatar
											radius='sm'
											alt={member.full_name}
											className='flex-shrink-0'
											size='sm'
											src={member.avatar_url || undefined}
										/>
										<span className='text-small font-semibold text-tertiary dark:text-secondary-lts'>
											{member.full_name}
										</span>
									</div>
									<Button
										isDisabled={user!.id !== board.owner.id}
										variant='bordered'
										color='danger'
										onPress={() => handleRemoveMember(member.id)}>
										Remove
									</Button>
								</li>
							))}
						</ul>
					</section>
					<ConfirmRemoveMember
						isOpen={isOpen}
						onChange={onOpenChange}
						onClose={onClose}
						memberId={memberToRemove}
						boardId={board.id}
					/>
				</motion.aside>
			)}
		</AnimatePresence>
	);
};
