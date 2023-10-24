'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Photo } from '@/types';
import { AiOutlineCheck } from 'react-icons/ai';

interface Props {
	images: Photo[];
	selectedPhoto: string;
	setSelectedPhoto: (photo: string) => void;
}

export const PhotosList: React.FC<Props> = ({
	images,
	selectedPhoto,
	setSelectedPhoto,
}) => {
	if (images.length === 0)
		return (
			<div className='flex justify-center items-center h-[150px]'>
				<p className='text-gray-500 text-sm'>No images found</p>
			</div>
		);

	return (
		<ul className='grid grid-cols-4 gap-2 my-4'>
			{images.map(image => (
				<motion.li
					className='relative'
					onClick={() => setSelectedPhoto(image.urls.regular)}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					key={image.id}>
					<Image
						className='rounded-md aspect-square object-cover cursor-pointer'
						src={image.urls.regular}
						alt={image.alt_description}
						width={65}
						height={65}
					/>
					{selectedPhoto === image.urls.regular && (
						<div className='rounded-lg absolute top-0 left-0 w-[65px] h-[65px] bg-black/40 flex justify-center items-center'>
							<AiOutlineCheck className='text-white' />
						</div>
					)}
				</motion.li>
			))}
		</ul>
	);
};
