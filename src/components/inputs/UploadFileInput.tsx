'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button, Spinner } from '@nextui-org/react';
import { AiOutlinePlus } from 'react-icons/ai';
import { IoDocumentTextSharp } from 'react-icons/io5';
import { classNames } from '@/utils';
import { Database } from '@/types';

interface Props {
	cardId: string;
}

export const UploadFileInput: React.FC<Props> = ({ cardId }) => {
	const [isUploadingFiles, setIsUploadingFiles] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const supabase = createClientComponentClient<Database>();
	const router = useRouter();

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		console.log(e.target.files);
		const selectedFiles = e.target.files || [];

		if (!selectedFiles || selectedFiles.length === 0) {
			toast.error('No files selected for upload.');
			return;
		}

		setIsUploadingFiles(true);

		for (let i = 0; i < selectedFiles.length; i++) {
			const file = selectedFiles[i];

			if (file.size > 5 * 1024 * 1024) {
				toast.error(
					`File '${file.name}' exceeds the 5MB limit and won't be uploaded.`
				);
				setIsUploadingFiles(false);
				continue;
			}

			const { data: storageData, error } = await supabase.storage
				.from('thrullo')
				.upload(`attachments/${cardId}/${file.name}`, file, {
					cacheControl: '3600',
				});

			if (error) {
				toast.error(`Error uploading '${file.name}': ${error.message}`);
				setIsUploadingFiles(false);
				continue;
			} else {
				const {
					data: { publicUrl },
				} = supabase.storage.from('thrullo').getPublicUrl(storageData.path);

				const { error } = await supabase.from('attachments').insert({
					file_name: file.name,
					file_type: file.type,
					file_url: publicUrl,
					card_id: cardId,
				});

				if (error) {
					toast.error(`Error uploading '${file.name}': ${error.message}`);
					setIsUploadingFiles(false);
					continue;
				}
				toast.success(`File '${file.name}' uploaded successfully.`);
			}
		}
		setIsUploadingFiles(false);
		router.refresh();
	};

	return (
		<>
			<div className='flex items-center gap-6'>
				<div className='flex items-center gap-2'>
					<IoDocumentTextSharp className='text-secondary-lt font-semibold' />
					<p className='text-sm text-secondary-lt font-semibold'>Attachments</p>
				</div>
				<Button
					variant='bordered'
					className='text-secondary'
					onPress={() => inputRef.current?.click()}
					startContent={<AiOutlinePlus />}>
					Add
				</Button>
				<input
					hidden
					ref={inputRef}
					type='file'
					multiple
					onChange={handleFileChange}
				/>
			</div>
			<AnimatePresence>
				{isUploadingFiles && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className={classNames(
							'bg-secondary-lts text-secondary rounded-lg border border-secondary-lts py-6 my-2',
							'flex items-center justify-center gap-4'
						)}>
						<p>Uploading...</p>
						<Spinner
							size='sm'
							classNames={{
								circle1: 'dark:border-b-gray-lts',
								circle2: 'dark:border-b-gray-lts',
							}}
						/>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
};
