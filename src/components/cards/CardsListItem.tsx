'use client';

import Image from 'next/image';
import { Noto_Sans } from 'next/font/google';
import { useDisclosure } from '@nextui-org/react';
import { MdOutlineInsertComment } from 'react-icons/md';
import { CgAttachment } from 'react-icons/cg';
import { MembersList } from '../UI/MembersList';
import { CardInformation } from '../modals/CardInformation';
import { LabelsList } from '../labels/LabelsList';
import { AddCardMembersButton } from '../buttons/AddCardMembersButton';
import { classNames } from '@/utils';
import { Card, User } from '@/types';

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
			<article
				onClick={onOpen}
				className={classNames(
					'bg-white rounded-xl shadow-[0px_4px_12px_0px_rgba(0,0,0,0.05)]',
					'p-4 my-4 cursor-pointer font-medium dark:bg-neutral-800',
					`${notoSans.className}`
				)}>
				<header>
					{cover_url && (
						<div className='mb-4'>
							<Image
								src={cover_url}
								alt={title}
								width={270}
								height={150}
								className='rounded-xl aspect-video object-cover'
							/>
						</div>
					)}
					<h3 className='text-xl'>{card.title}</h3>
				</header>
				<LabelsList labels={card.labels} />
				<div className='my-4 flex items-center justify-between'>
					<div className='flex items-center gap-4'>
						<MembersList
							members={card.assigned_users}
							count={2}
							showAll={false}
							showCount={false}
						/>
						<AddCardMembersButton card={card} members={members} />
					</div>
					<div className='flex items-center gap-2 justify-end'>
						{card.comments.length > 0 && (
							<div className='flex items-center gap-2'>
								<MdOutlineInsertComment className='text-[#BDBDBD]' />
								<span className='text-sm text-[#BDBDBD]'>
									{card.comments.length}
								</span>
							</div>
						)}
						{card.attachments.length > 0 && (
							<div className='flex items-center gap-2'>
								<CgAttachment className='text-[#BDBDBD]' />
								<span className='text-sm text-[#BDBDBD]'>
									{card.attachments.length}
								</span>
							</div>
						)}
					</div>
				</div>
			</article>
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
