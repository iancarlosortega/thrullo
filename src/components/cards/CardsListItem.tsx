'use client';

import Image from 'next/image';
import { Noto_Sans } from 'next/font/google';
import { useDisclosure } from '@nextui-org/react';
import { MembersList } from '../UI/MembersList';
import { CardInformation } from '../modals/CardInformation';
import { LabelsList } from '../labels/LabelsList';
import { classNames } from '@/utils';
import { Card, User } from '@/types';
import { AddCardMembersButton } from '../buttons/AddCardMembersButton';

const notoSans = Noto_Sans({
	subsets: ['latin', 'latin-ext'],
	weight: ['400', '500'],
});

interface Props {
	card: Card;
	listTitle: string;
	members: User[];
}

export const CardsListItem: React.FC<Props> = ({
	card,
	listTitle,
	members,
}) => {
	card = {
		...card,
		assigned_users: card.assigned_users.map((user: any) => user.user_id),
	};
	const { title, cover_url } = card;
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

	return (
		<>
			<li
				onClick={onOpen}
				className={classNames(
					'bg-white rounded-xl shadow-[0px_4px_12px_0px_rgba(0,0,0,0.05)]',
					'p-4 my-4 cursor-pointer font-medium dark:bg-neutral-800',
					`${notoSans.className}`
				)}>
				{cover_url && (
					<div>
						<Image
							src={cover_url}
							alt={title}
							width={270}
							height={150}
							className='rounded-xl aspect-video object-cover'
						/>
					</div>
				)}

				<h5 className='text-xl mt-4'>{card.title}</h5>
				<div className='my-6'>
					<LabelsList labels={card.labels} />
				</div>
				<div className='my-4'>
					<div className='flex items-center gap-4'>
						<MembersList
							members={card.assigned_users}
							count={2}
							showAll={false}
							showCount={false}
						/>
						<AddCardMembersButton card={card} members={members} />
					</div>
					{/* Comments & Attachments */}
				</div>
			</li>
			<CardInformation
				isOpen={isOpen}
				onChange={onOpenChange}
				onClose={onClose}
				listTitle={listTitle}
				card={card}
				members={members}
			/>
		</>
	);
};
