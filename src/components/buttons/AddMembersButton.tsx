'use client';

import { Button, useDisclosure } from '@nextui-org/react';
import { AiOutlinePlus } from 'react-icons/ai';
import { AddNewMembers } from '@/components/modals/AddNewMembers';

interface Props {
	boardId: string;
}

export const AddMembersButton: React.FC<Props> = ({ boardId }) => {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

	return (
		<>
			<Button
				className='bg-primary text-white border-none'
				isIconOnly
				aria-label='Add members'
				onPress={onOpen}>
				<AiOutlinePlus className='text-2xl' />
			</Button>
			<AddNewMembers
				isOpen={isOpen}
				onChange={onOpenChange}
				onClose={onClose}
				boardId={boardId}
			/>
		</>
	);
};
