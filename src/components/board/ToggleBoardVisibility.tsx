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
import { AiFillLock, AiOutlineCheck } from 'react-icons/ai';
import { BiWorld } from 'react-icons/bi';
import useAuthStore from '@/store/authStore';
import { Board, Database } from '@/types';

interface Props {
	board: Board;
}

export const ToggleBoardVisibility: React.FC<Props> = ({ board }) => {
	const [isPublic, setIsPublic] = useState(board.is_public);
	const user = useAuthStore(state => state.user);
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
		<Dropdown placement='bottom-start' isDisabled>
			<DropdownTrigger disabled={board.owner.id !== user?.id}>
				<Button
					className='bg-secondary-lts text-secondary dark:bg-neutral-900/50 font-medium h-12 px-6'
					startContent={isPublic ? <BiWorld /> : <AiFillLock />}>
					{isPublic ? 'Public ' : 'Private'}
				</Button>
			</DropdownTrigger>
			<DropdownMenu
				aria-label='Toggle board visibility'
				variant='flat'
				disabledKeys={board.owner.id !== user?.id ? ['public', 'private'] : []}>
				<DropdownItem>
					<span className='font-semibold text-neutral-800 block dark:text-white'>
						Visibility
					</span>
					<span>Choose who can see this board.</span>
				</DropdownItem>
				<DropdownItem
					key='public'
					onClick={() => handleToggleVisibility(true)}
					description='Anyone on the internet can see this.'
					value='public'
					startContent={<BiWorld />}
					endContent={isPublic ? <AiOutlineCheck /> : undefined}>
					Public
				</DropdownItem>
				<DropdownItem
					key='private'
					onClick={() => handleToggleVisibility(false)}
					description='Only board members can see this.'
					value='private'
					startContent={<AiFillLock />}
					endContent={!isPublic ? <AiOutlineCheck /> : undefined}>
					Private
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	);
};
