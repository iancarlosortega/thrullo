'use client';

import { useRef, useState } from 'react';
import { Button, Input } from '@nextui-org/react';
import { AnimatePresence, motion } from 'framer-motion';
import { AiOutlineSearch } from 'react-icons/ai';
import { useOutsideAlerter } from '@/hooks';
import { classNames } from '@/utils';
import { User } from '@/types';

interface Props {
	isOpen: boolean;
	toggleMenu: (isOpen: boolean) => void;
}

export const CoverMenu: React.FC<Props> = ({ isOpen, toggleMenu }) => {
	const [filteredMembers, setFilteredMembers] = useState<User[]>([]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		// const members = users.filter(member =>
		// 	member.full_name.toLowerCase().includes(value.toLowerCase())
		// );
		// setFilteredMembers(members);
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
						'absolute top-[65px] left-0 z-10 w-[300px]',
						'bg-white rounded-lg border border-[#E0E0E0] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.05)] p-2',
						'dark:bg-neutral-900 dark:border-[#4F4F4F] dark:shadow-[0px_2px_4px_0px_rgba(0,0,0,0.2)]'
					)}>
					<h6 className='font-semibold text-[#4F4F4F] dark:text-secondary-lts'>
						Photo Search
					</h6>
					<p className='text-sm text-secondary dark:text-secondary-lt mb-2'>
						Search Unsplash for photos
					</p>
					<form autoComplete='off'>
						<Input
							type='text'
							placeholder='Keywords...'
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
					</form>
					{/* TODO: Photo List */}
				</motion.div>
			)}
		</AnimatePresence>
	);
};
