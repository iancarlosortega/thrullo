'use client';

import { useEffect, useState } from 'react';
import { Textarea, Spinner, Button } from '@nextui-org/react';
import { HiPencil } from 'react-icons/hi';
import { IoDocumentTextSharp } from 'react-icons/io5';
import { useDebounce } from '@/hooks';

interface Props {
	description: string;
	updated_at: string;
	updateDescription: (description: string) => Promise<void>;
}

export const UpdateDescriptionInput: React.FC<Props> = ({
	description,
	updated_at,
	updateDescription,
}) => {
	const [updatedDescription, setUpdatedDescription] = useState(
		description || ''
	);
	const [updatedAt, setUpdatedAt] = useState(
		new Date(updated_at).toLocaleString()
	);
	const debouncedInputValue = useDebounce(updatedDescription, 1200);
	const [isUpdatingDescription, setIsUpdatingDescription] = useState(false);
	const [isEdittingMode, setIsEdittingMode] = useState(false);

	useEffect(() => {
		if (debouncedInputValue === description) return;

		const updateAction = async (description: string) => {
			await updateDescription(description);
			setIsUpdatingDescription(false);
		};

		updateAction(debouncedInputValue);
	}, [debouncedInputValue, description, updateDescription]);

	const handleInputChange = (e: any) => {
		setIsUpdatingDescription(true);
		setUpdatedDescription(e.target.value);
		setUpdatedAt(new Date().toLocaleString());
	};

	return (
		<>
			<div className='flex items-center gap-6'>
				<div className='flex items-center gap-2'>
					<IoDocumentTextSharp className='text-secondary-lt font-semibold' />
					<p className='text-sm text-secondary-lt font-semibold'>Description</p>
				</div>
				<Button
					variant='bordered'
					className='text-secondary'
					isDisabled={isUpdatingDescription}
					onPress={() => setIsEdittingMode(!isEdittingMode)}
					startContent={<HiPencil />}>
					Edit
				</Button>
			</div>
			{isEdittingMode ? (
				<div className='mb-4'>
					<Textarea
						placeholder='Enter a card description'
						value={updatedDescription}
						onChange={handleInputChange}
					/>
					<div className='w-full flex justify-end pr-2 pt-2'>
						{isUpdatingDescription ? (
							<Spinner
								size='sm'
								classNames={{
									circle1: 'dark:border-b-gray-lts',
									circle2: 'dark:border-b-gray-lts',
								}}
							/>
						) : (
							<span className='text-tiny font-semibold text-secondary-lt'>
								Last update {updatedAt}
							</span>
						)}
					</div>
				</div>
			) : (
				<>
					{updatedDescription ? (
						<p className='mt-4 mb-8'>{updatedDescription}</p>
					) : (
						<p className='text-sm text-gray-400 italic'>No description</p>
					)}
				</>
			)}
		</>
	);
};
