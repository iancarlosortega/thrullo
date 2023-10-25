'use client';

import { useRef, useState } from 'react';
import { Button, Input } from '@nextui-org/react';
import { AnimatePresence, motion } from 'framer-motion';
import { AiOutlinePlus, AiOutlineSearch } from 'react-icons/ai';
import { ProfilePhoto } from '../UI/ProfilePhoto';
import { useOutsideAlerter } from '@/hooks';
import { classNames } from '@/utils';
import { User } from '@/types';

interface Props {
	users: User[];
	isOpen: boolean;
	toggleMenu: (isOpen: boolean) => void;
	handleAction: (id: string) => void;
}

export const MembersMenu: React.FC<Props> = ({
	users,
	isOpen,
	toggleMenu,
	handleAction,
}) => {
	const [filteredMembers, setFilteredMembers] = useState<User[]>(users);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		const members = users.filter(member =>
			member.full_name.toLowerCase().includes(value.toLowerCase())
		);
		setFilteredMembers(members);
	};

	const handleClose = () => {
		toggleMenu(false);
	};

	const wrapperRef = useRef<HTMLDivElement>(null);
	useOutsideAlerter(wrapperRef, handleClose);

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					ref={wrapperRef}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className={classNames(
						'absolute top-[65px] left-0 z-20 w-[300px]',
						'bg-white rounded-lg border border-[#E0E0E0] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.05)] p-2',
						'dark:bg-neutral-900 dark:border-[#4F4F4F] dark:shadow-[0px_2px_4px_0px_rgba(0,0,0,0.2)]'
					)}>
					<h6 className='font-semibold text-[#4F4F4F] dark:text-secondary-lts'>
						Members
					</h6>
					<p className='text-sm text-secondary dark:text-secondary-lt mb-2'>
						Assign members to this card
					</p>
					<form autoComplete='off'>
						<Input
							type='text'
							placeholder='User...'
							onChange={handleInputChange}
							variant='bordered'
							endContent={
								<Button
									className='translate-x-2'
									size='sm'
									isIconOnly
									color='primary'>
									<AiOutlineSearch />
								</Button>
							}
						/>

						<div
							className={classNames(
								'my-4 p-2 rounded-lg border border-[#E0E0E0] dark:border- bg-white drop-shadow-[0px_4px_12px_rgba(0,0,0,0.10)]',
								'dark:bg-neutral-800 dark:border-[#4F4F4F] dark:drop-shadow-[0px_4px_12px_rgba(0,0,0,0.2)]',
								'overflow-y-auto max-h-[200px]'
							)}>
							{filteredMembers.length === 0 ? (
								<p className='text-sm text-secondary dark:text-secondary-lt'>
									No members found
								</p>
							) : (
								<ul>
									{filteredMembers.map(member => (
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
														onPress={() => handleAction(member.id)}
														isIconOnly
														radius='full'
														color='success'
														variant='flat'
														size='sm'>
														<AiOutlinePlus />
													</Button>
												</div>
											</div>
										</li>
									))}
								</ul>
							)}
						</div>
					</form>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
