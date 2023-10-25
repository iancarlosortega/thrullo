'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Input, Pagination } from '@nextui-org/react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import { AiOutlineSearch } from 'react-icons/ai';
import { PhotosList } from '../UI/PhotosList';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import { useOutsideAlerter } from '@/hooks';
import { classNames } from '@/utils';
import { baseUrl } from '@/constants';

interface Props {
	isOpen: boolean;
	coverUrl: string;
	toggleMenu: (isOpen: boolean) => void;
	updateCardCover: (coverUrl: string) => void;
}

export const CoverMenu: React.FC<Props> = ({
	isOpen,
	toggleMenu,
	updateCardCover,
	coverUrl,
}) => {
	const [images, setImages] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isUpdatingPhotos, setIsUpdatingPhotos] = useState(false);
	const [inputValue, setInputValue] = useState('office');
	const [totalImages, setTotalImages] = useState(0);
	const [selectedPhoto, setSelectedPhoto] = useState(coverUrl || '');

	const getUrl = useCallback((query: string, page: number) => {
		const orientation = 'landscape';
		const perPage = 12;

		const url = new URL(baseUrl);
		url.searchParams.append('page', page.toString());
		url.searchParams.append('query', query);
		url.searchParams.append('orientation', orientation);
		url.searchParams.append('per_page', perPage.toString());
		return url.toString();
	}, []);

	const getPhotos = useCallback(
		async (query: string, page: number) => {
			setIsUpdatingPhotos(true);
			const url = getUrl(query, page);
			try {
				const response = await fetch(url.toString(), {
					headers: {
						Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_API_KEY}`,
					},
				});
				const data = await response.json();
				setImages(data.results);
				setTotalImages(data.total);
				setIsLoading(false);
				setIsUpdatingPhotos(false);
			} catch (error) {
				toast.error('Error al obtener fotos');
				console.error('Error al obtener fotos:', error);
			}
		},
		[getUrl, setImages, setIsLoading]
	);

	useEffect(() => {
		getPhotos('office', 1);
	}, [getPhotos]);

	const updatePhotosList = () => {
		setIsLoading(true);
		getPhotos(inputValue, 1);
	};

	const handleClose = () => {
		toggleMenu(false);
	};

	const wrapperRef = useRef<HTMLDivElement>(null);
	useOutsideAlerter(wrapperRef, handleClose);

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					ref={wrapperRef}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className={classNames(
						'absolute top-[65px] left-0 z-10 w-[300px]',
						'bg-white rounded-lg border border-[#E0E0E0] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.05)] p-2',
						'dark:bg-neutral-900 dark:border-[#4F4F4F] dark:shadow-[0px_2px_4px_0px_rgba(0,0,0,0.2)]'
					)}>
					<h6 className='font-semibold text-[#4F4F4F] dark:text-secondary-lts'>
						Photo Search
					</h6>
					<p className='text-sm text-secondary dark:text-secondary-lt mb-2'>
						Search Unsplash for photos
					</p>
					<Input
						autoComplete='off'
						type='text'
						placeholder='Keywords...'
						value={inputValue}
						onChange={e => setInputValue(e.target.value)}
						onKeyDown={e => {
							if (e.key === 'Enter') {
								e.preventDefault();
								updatePhotosList();
							}
						}}
						variant='bordered'
						endContent={
							<Button
								onPress={updatePhotosList}
								className='translate-x-2'
								size='sm'
								isIconOnly
								color='primary'>
								<AiOutlineSearch />
							</Button>
						}
					/>
					{isLoading ? (
						<div className='w-full py-8 flex items-center justify-center'>
							<LoadingSpinner />
						</div>
					) : (
						<>
							<PhotosList
								selectedPhoto={selectedPhoto}
								setSelectedPhoto={setSelectedPhoto}
								images={images}
							/>
							<Pagination
								size='sm'
								isCompact
								showControls
								isDisabled={isUpdatingPhotos}
								total={totalImages}
								initialPage={1}
								onChange={e => {
									getPhotos(inputValue, e);
								}}
							/>
						</>
					)}
					<footer className='w-full my-4 flex justify-center'>
						<Button
							color='primary'
							variant='ghost'
							onPress={() => {
								updateCardCover(selectedPhoto);
								handleClose();
							}}>
							Select Cover
						</Button>
					</footer>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
