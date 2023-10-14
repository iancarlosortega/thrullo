'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'sonner';
import { Button, Input } from '@nextui-org/react';
import { AiOutlinePlus, AiOutlineSearch } from 'react-icons/ai';
import { ProfilePhoto } from '../UI/ProfilePhoto';
import useUIStore from '@/store/uiStore';
import { useOutsideAlerter } from '@/hooks';
import { classNames } from '@/utils';
import { Card, User } from '@/types';

interface Props {
	card: Card;
	members: User[];
}

export const MembersMenu: React.FC<Props> = ({ members, card }) => {
	const [cardMembers, setCardMembers] = useState<User[]>([]);
	const isMembersMenuOpen = useUIStore(state => state.isMembersMenuOpen);
	const setIsMembersMenuOpen = useUIStore(state => state.setIsMembersMenuOpen);
	const router = useRouter();
	const supabase = createClientComponentClient();

	useEffect(() => {
		const assignedUsers = card.assigned_users.map((user: any) => user.user_id);
		const filteredMembers = members.filter(
			member =>
				!assignedUsers.find(
					(assignedUser: User) => assignedUser.id === member.id
				)
		);
		setCardMembers(filteredMembers);
	}, [members, card.assigned_users]);

	const handleClose = () => {
		setIsMembersMenuOpen(false);
	};

	const wrapperRef = useRef<HTMLDivElement>(null);
	useOutsideAlerter(wrapperRef, handleClose);

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
		<div
			ref={wrapperRef}
			className={classNames(
				'bg-white rounded-lg border border-[#E0E0E0] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.05)] p-2',
				'absolute top-[65px] left-0 z-10 w-[300px] transition-all !duration-300',
				'dark:bg-neutral-900 dark:border-[#4F4F4F] dark:shadow-[0px_2px_4px_0px_rgba(0,0,0,0.2)]',
				`${isMembersMenuOpen ? 'opacity-1 visible' : 'opacity-0 invisible'}`
			)}>
			<h6 className='font-semibold text-[#4F4F4F] dark:text-secondary-lts'>
				Members
			</h6>
			<p className='text-sm text-secondary dark:text-secondary-lt mb-2'>
				Assign members to this card
			</p>
			<form autoComplete='off'>
				<Input
					type='text'
					placeholder='User...'
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

				<div
					className={classNames(
						'my-4 p-2 rounded-lg border border-[#E0E0E0] dark:border- bg-white drop-shadow-[0px_4px_12px_rgba(0,0,0,0.10)]',
						'dark:bg-neutral-800 dark:border-[#4F4F4F] dark:drop-shadow-[0px_4px_12px_rgba(0,0,0,0.2)]'
					)}>
					<ul>
						{cardMembers.map(member => (
							<li key={member.id}>
								<div className='flex items-center justify-between my-2'>
									<div className='flex items-center gap-2'>
										<ProfilePhoto user={member} />
										<p className='text-sm text-secondary dark:text-secondary-lt'>
											{member.full_name}
										</p>
									</div>
									<div>
										<Button
											onPress={() => handleAddMember(member.id)}
											isIconOnly
											radius='full'
											color='success'
											variant='flat'
											size='sm'>
											<AiOutlinePlus />
										</Button>
									</div>
								</div>
							</li>
						))}
					</ul>
				</div>
			</form>
		</div>
	);
};
