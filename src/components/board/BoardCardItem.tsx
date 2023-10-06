import { Noto_Sans } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

const notoSans = Noto_Sans({
	subsets: ['latin', 'devanagari'],
	style: 'normal',
	weight: '500',
});

interface Props {
	board: any;
}

export const BoardCardItem: React.FC<Props> = ({ board }) => {
	return (
		<li className='rounded-lg bg-white shadow-lg text-lg p-4'>
			<Link className='' href={`/boards/${board.id}`}>
				<div className='mb-2'>
					<Image
						src={board.cover_url || '/images/no-banner-image.png'}
						alt='board cover'
						width={200}
						height={200}
						className='rounded-lg w-full object-cover aspect-video'
					/>
				</div>
				<p className={notoSans.className}>{board.title}</p>
				{/* TODO: Add Members */}
				{/* Members */}
			</Link>
		</li>
	);
};
