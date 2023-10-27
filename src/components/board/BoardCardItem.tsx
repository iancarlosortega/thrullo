import { Noto_Sans } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { MembersList } from '..';
import { Board } from '@/types';

const notoSans = Noto_Sans({
	subsets: ['latin', 'devanagari'],
	style: 'normal',
	weight: '500',
});

interface Props {
	board: Board;
}

export const BoardCardItem: React.FC<Props> = ({ board }) => {
	return (
		<article className='rounded-lg bg-white dark:bg-stone-900 shadow-lg text-lg p-4'>
			<Link href={`/boards/${board.id}`}>
				<div className='mb-2'>
					<Image
						src={board.cover_url || '/images/no-banner-image.png'}
						alt='board cover'
						width={720}
						height={720}
						className='rounded-lg w-full object-cover aspect-video'
					/>
				</div>
				<h3 className={`${notoSans.className} my-3`}>{board.title}</h3>
				<MembersList members={board.members} showAll={false} />
			</Link>
		</article>
	);
};
