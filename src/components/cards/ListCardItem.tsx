'use client';

import Image from 'next/image';
import { Noto_Sans } from 'next/font/google';
import { useDisclosure } from '@nextui-org/react';
import { Card } from '@/types';
import { classNames } from '@/utils';
import { CardInformation } from '../modals/CardInformation';

const notoSans = Noto_Sans({
	subsets: ['latin', 'latin-ext'],
	weight: ['400', '500'],
});

interface Props {
	card: Card;
	listTitle: string;
}

export const ListCardItem: React.FC<Props> = ({ card, listTitle }) => {
	const { title, cover_url } = card;
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

	return (
		<>
			<li
				onClick={onOpen}
				className={classNames(
					'bg-white rounded-xl shadow-[0px_4px_12px_0px_rgba(0,0,0,0.05)]',
					'p-4 my-4 cursor-pointer font-medium',
					`${notoSans.className}`
				)}>
				{cover_url && (
					<div>
						<Image
							src={cover_url}
							alt={title}
							width={300}
							height={200}
							className='rounded-xl aspect-video object-cover'
						/>
					</div>
				)}

				<h5>{card.title}</h5>
				{/* Labels */}
				<div>
					{/* Members */}
					{/* Comments & Attachments */}
				</div>
			</li>
			<CardInformation
				isOpen={isOpen}
				onChange={onOpenChange}
				onClose={onClose}
				listTitle={listTitle}
				card={card}
			/>
		</>
	);
};
