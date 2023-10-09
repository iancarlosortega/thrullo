'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'sonner';
import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from '@nextui-org/react';
import { AiFillLock } from 'react-icons/ai';
import { BiWorld } from 'react-icons/bi';
import { Board, Database } from '@/types';

interface Props {
	board: Board;
}

export const ToggleBoardVisibility: React.FC<Props> = ({ board }) => {
	const [isPublic, setIsPublic] = useState(board.is_public);
	const supabase = createClientComponentClient<Database>();

	const handleToggleVisibility = async (value: boolean) => {
		setIsPublic(value);
		const { error } = await supabase
			.from('boards')
			.update({ is_public: value })
			.eq('id', board.id);

		if (error) {
			console.log(error);
			toast.error(error.message);
			setIsPublic(!value);
			return;
		}
		toast.success(`Board is now ${value ? 'public' : 'private'}`);
	};

	return (
		<Dropdown placement='bottom-start'>
			<DropdownTrigger>
				<Button
					size='lg'
					className='bg-secondary-lts text-secondary font-medium w-[150px]'
					startContent={isPublic ? <BiWorld /> : <AiFillLock />}>
					{isPublic ? 'Public ' : 'Private'}
				</Button>
			</DropdownTrigger>
			<DropdownMenu aria-label='Single selection example' variant='flat'>
				<DropdownItem>
					<span className='font-semibold text-neutral-800 block'>
						Visibility
					</span>
					<span>Choose who can see this board.</span>
				</DropdownItem>
				<DropdownItem
					key='public'
					onClick={() => handleToggleVisibility(true)}
					description='Anyone on the internet can see this.'
					value='public'
					startContent={<BiWorld />}>
					Public
				</DropdownItem>
				<DropdownItem
					key='private'
					onClick={() => handleToggleVisibility(false)}
					description='Only board members can see this.'
					value='private'
					startContent={<AiFillLock />}>
					Private
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	);
};
