'use client';

import { useState } from 'react';
import { Button } from '@nextui-org/react';
import { AiOutlinePlus } from 'react-icons/ai';
import { MembersMenu } from '../menus/MembersMenu';
import { User } from '@/types';

interface Props {
	boardId: string;
	members: User[];
}

export const AddMembersButton: React.FC<Props> = ({ boardId, members }) => {
	const [isMembersMenuOpen, setIsMembersMenuOpen] = useState(false);

	const handleAddMember = async (userId: string) => {
		console.log('handleAddMember', userId);
	};

	return (
		<div className='relative'>
			<Button
				className='bg-primary text-white border-none'
				isIconOnly
				aria-label='Add members'
				onPress={() => setIsMembersMenuOpen(true)}>
				<AiOutlinePlus className='text-2xl' />
			</Button>
			<MembersMenu
				users={members}
				isOpen={isMembersMenuOpen}
				toggleMenu={setIsMembersMenuOpen}
				handleAction={handleAddMember}
			/>
		</div>
	);
};
