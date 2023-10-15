'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'sonner';
import { Button } from '@nextui-org/react';
import { HiUsers } from 'react-icons/hi';
import { AiOutlinePlus } from 'react-icons/ai';
import { MembersMenu } from '../menus/MembersMenu';
import { Card, User } from '@/types';
import { classNames } from '@/utils';

interface Props {
	members: User[];
	card: Card;
	variant?: 'default' | 'secondary' | 'tertiary';
}

export const AddCardMembersButton: React.FC<Props> = ({
	members,
	card,
	variant = 'default',
}) => {
	const filteredMembers = members.filter(
		member =>
			!card.assigned_users.find(
				(assignedUser: User) => assignedUser.id === member.id
			)
	);
	const [isMembersMenuOpen, setIsMembersMenuOpen] = useState(false);

	const router = useRouter();
	const supabase = createClientComponentClient();

	const handleAddMember = async (userId: string) => {
		const { error } = await supabase.from('assigned_users').insert({
			card_id: card.id,
			user_id: userId,
		});

		if (error) {
			console.error(error);
			toast.error(error.message);
			return;
		}
		toast.success('Member added successfully');
		router.refresh();
	};

	return (
		<div className='relative'>
			{variant === 'default' && (
				<Button
					className='bg-primary text-white border-none'
					isIconOnly
					aria-label='Add members'
					onPress={() => setIsMembersMenuOpen(true)}>
					<AiOutlinePlus className='text-2xl' />
				</Button>
			)}
			{variant === 'secondary' && (
				<button
					onClick={() => setIsMembersMenuOpen(true)}
					className={classNames(
						'bg-[#DAE4FD] px-4 py-3 flex justify-between items-center',
						'rounded-2xl text-primary text-sm w-full font-medium',
						'dark:bg-sky-500/10 dark:border-sky-500/20',
						'hover:bg-[#E1E7FD] transition-all duration-200'
					)}>
					Add another list
					<AiOutlinePlus className='text-2xl' />
				</button>
			)}
			{variant === 'tertiary' && (
				<Button
					onPress={() => setIsMembersMenuOpen(true)}
					className='bg-secondary-lts text-secondary dark:bg-neutral-950/50 font-medium justify-start w-[160px] my-2'
					startContent={<HiUsers />}>
					Members
				</Button>
			)}

			<MembersMenu
				users={filteredMembers}
				isOpen={isMembersMenuOpen}
				toggleMenu={setIsMembersMenuOpen}
				handleAction={handleAddMember}
			/>
		</div>
	);
};
