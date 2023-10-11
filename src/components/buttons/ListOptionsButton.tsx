'use client';

import {
	Dropdown,
	DropdownTrigger,
	Button,
	DropdownMenu,
	DropdownItem,
	DropdownSection,
	useDisclosure,
} from '@nextui-org/react';
import { BsThreeDots } from 'react-icons/bs';
import { AiFillDelete } from 'react-icons/ai';
import { BiRename } from 'react-icons/bi';
import { ConfirmDeleteList } from '../modals/ConfirmDeleteList';
import { List } from '@/types';

interface Props {
	list: List;
	toggleEditListTitle: () => void;
}

export const ListOptionsButton: React.FC<Props> = ({
	list,
	toggleEditListTitle,
}) => {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

	return (
		<>
			<Dropdown placement='bottom-end'>
				<DropdownTrigger>
					<Button variant='light' isIconOnly>
						<BsThreeDots />
					</Button>
				</DropdownTrigger>
				<DropdownMenu aria-label='List Actions' variant='flat'>
					<DropdownSection showDivider>
						<DropdownItem
							key='rename'
							color='primary'
							onPress={toggleEditListTitle}
							startContent={<BiRename />}>
							Rename
						</DropdownItem>
					</DropdownSection>
					<DropdownSection>
						<DropdownItem
							key='delete'
							color='danger'
							onPress={onOpen}
							startContent={<AiFillDelete />}>
							Delete this list
						</DropdownItem>
					</DropdownSection>
				</DropdownMenu>
			</Dropdown>
			<ConfirmDeleteList
				isOpen={isOpen}
				onChange={onOpenChange}
				onClose={onClose}
				listId={list.id}
			/>
		</>
	);
};
