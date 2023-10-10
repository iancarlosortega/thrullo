'use client';

import { useEffect, useRef, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'sonner';
import {
	Avatar,
	Button,
	Spinner,
	Textarea,
	useDisclosure,
} from '@nextui-org/react';
import { AiOutlineClose, AiOutlineTeam } from 'react-icons/ai';
import { FaUserCircle } from 'react-icons/fa';
import { IoDocumentTextSharp } from 'react-icons/io5';
import { HiPencil } from 'react-icons/hi';
import { useDebounce, useOutsideAlerter } from '@/hooks';
import useUIStore from '@/store/uiStore';
import { ConfirmRemoveMember } from '@/components/modals/ConfirmRemoveMember';
import { classNames, formatDate } from '@/utils';
import { Board, User } from '@/types';

interface Props {
	board: Board;
	members: User[];
}

export const BoardInformation: React.FC<Props> = ({ board, members }) => {
	const [boardDescription, setBoardDescription] = useState(
		board.description || ''
	);
	const debouncedInputValue = useDebounce(boardDescription, 2000);
	const [isUpdatingDescription, setIsUpdatingDescription] = useState(false);
	const [isEdittingMode, setIsEdittingMode] = useState(false);
	const [memberToRemove, setMemberToRemove] = useState('');
	const { isBoardInformationOpen, setIsBoardInformationOpen } = useUIStore();
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
	const supabase = createClientComponentClient();

	const closeBoardInformation = () => {
		if (!isBoardInformationOpen) return;
		setIsBoardInformationOpen(false);
	};

	const wrapperRef = useRef(null);
	useOutsideAlerter(wrapperRef, closeBoardInformation);

	const handleRemoveMember = async (memberId: string) => {
		setMemberToRemove(memberId);
		onOpen();
	};

	const handleInputChange = (e: any) => {
		setIsUpdatingDescription(true);
		setBoardDescription(e.target.value);
	};

	useEffect(() => {
		if (debouncedInputValue === board.description) return;
		updateBoardDescription();
	}, [debouncedInputValue, board.description]);

	const updateBoardDescription = async () => {
		const { error } = await supabase
			.from('boards')
			.update({
				description: debouncedInputValue,
				updated_at: new Date(),
			})
			.eq('id', board.id);

		if (error) {
			console.log(error);
			toast.error(error.message);
			return;
		}

		setIsUpdatingDescription(false);
	};

	return (
		<aside
			ref={wrapperRef}
			className={classNames(
				`
      ${isBoardInformationOpen ? 'translate-x-0' : 'translate-x-[400px]'}`,
				'w-[400px] max-w-[80%] h-[calc(100vh-5rem)] flex flex-col fixed top-20 right-0',
				'transition-transform duration-300 ease-in p-4 z-10',
				'bg-white px-8 py-4 dark:bg-neutral-900 overflow-y-scroll'
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
			<section>
				<div className='flex items-center gap-2 '>
					<FaUserCircle className='text-secondary-lt font-semibold' />
					<p className='text-sm text-secondary-lt font-semibold'>Made by</p>
				</div>
				<div className='flex gap-2 items-center my-4'>
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
							placeholder='Enter a board description'
							value={boardDescription}
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
									Last update {new Date(board.updated_at).toLocaleString()}
								</span>
							)}
						</div>
					</div>
				) : (
					<p className='mt-4 mb-8'>{boardDescription}</p>
				)}
			</section>

			<section>
				<div className='flex items-center gap-2'>
					<AiOutlineTeam className='text-secondary-lt font-semibold' />
					<p className='text-sm text-secondary-lt font-semibold'>Team</p>
				</div>
				<ul>
					<li className='flex items-center justify-between my-4'>
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
		</aside>
	);
};
