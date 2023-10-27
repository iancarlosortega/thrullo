'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'sonner';
import { Button } from '@nextui-org/react';
import useAuthStore from '@/store/authStore';
import { AiOutlinePlus } from 'react-icons/ai';
import { MembersMenu } from '../menus/MembersMenu';
import { User } from '@/types';

interface Props {
	ownerId: string;
	boardId: string;
	members: User[];
}

export const AddMembersButton: React.FC<Props> = ({
	ownerId,
	boardId,
	members,
}) => {
	const [isMembersMenuOpen, setIsMembersMenuOpen] = useState(false);
	const [users, setUsers] = useState<User[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const user = useAuthStore(state => state.user);
	const router = useRouter();
	const supabase = createClientComponentClient();

	useEffect(() => {
		setIsLoading(true);
		const fetchUsers = async () => {
			const { data, error } = await supabase
				.from('users')
				.select('*')
				.neq('id', user!.id);
			if (error) {
				console.log(error);
				return;
			}
			const filteredUsers = data.filter((user: User) => {
				return !members.find((member: User) => member.id === user.id);
			});
			setUsers(filteredUsers);
			setIsLoading(false);
		};
		fetchUsers();
	}, [members, supabase, user]);

	const handleAddMember = async (userId: string) => {
		const { error } = await supabase.from('members').insert({
			board_id: boardId,
			user_id: userId,
		});

		if (error) {
			console.error(error);
			toast.error(error.message);
			return;
		}

		toast.success('Member added successfully');
		router.refresh();
		setIsMembersMenuOpen(false);
	};

	if (ownerId !== user?.id) return null;
	return (
		<div className='relative'>
			<Button
				className='bg-primary text-white border-none'
				isIconOnly
				aria-label='Add members'
				onPress={() => setIsMembersMenuOpen(true)}>
				<AiOutlinePlus className='text-2xl' />
			</Button>
			{!isLoading && (
				<MembersMenu
					users={users}
					isOpen={isMembersMenuOpen}
					toggleMenu={setIsMembersMenuOpen}
					handleAction={handleAddMember}
				/>
			)}
		</div>
	);
};
