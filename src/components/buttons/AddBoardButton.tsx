'use client';

import { Button, useDisclosure } from '@nextui-org/react';
import { AiOutlinePlus } from 'react-icons/ai';
import { AddNewBoard } from '../modals/AddNewBoard';

export const AddBoardButton = () => {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

	return (
		<>
			<Button
				className='bg-primary text-white'
				startContent={<AiOutlinePlus className='text-[18px]' />}
				onPress={onOpen}>
				Add
			</Button>
			<AddNewBoard isOpen={isOpen} onChange={onOpenChange} onClose={onClose} />
		</>
	);
};
