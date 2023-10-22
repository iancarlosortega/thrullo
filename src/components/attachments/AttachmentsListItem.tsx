import Image from 'next/image';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'sonner';
import { Button, useDisclosure } from '@nextui-org/react';
import { ConfirmDeleteAttachment } from '../modals/ConfirmDeleteAttachment';
import { Attachment } from '@/types';
import { formatDate } from '@/utils';

interface Props {
	attachment: Attachment;
	cardId: string;
}

export const AttachmentsListItem: React.FC<Props> = ({
	attachment,
	cardId,
}) => {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
	const supabase = createClientComponentClient();

	const handleDownload = async () => {
		const { data, error } = await supabase.storage
			.from('thrullo')
			.download(`/attachments/${cardId}/${attachment.file_name}`);

		if (error) {
			console.log(error);
			toast.error(error.message);
			return;
		}

		const url = window.URL.createObjectURL(data);
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', attachment.file_name);
		document.body.appendChild(link);
		link.click();
	};

	return (
		<>
			<li className='my-6'>
				<div className='flex items-start gap-4'>
					<div>
						{attachment.file_type.includes('image') ? (
							<Image
								src={attachment.file_url}
								alt={attachment.file_name}
								width={80}
								height={60}
								className='w-[80px] h-[60px] rounded-lg aspect-video object-contain'
							/>
						) : (
							<div className='flex justify-center items-center w-[80px] h-[60px] rounded-lg bg-secondary-lt dark:bg-neutral-700'>
								<p className='text-white font-medium uppercase'>
									{attachment.file_name.charAt(0)}
									{attachment.file_name.charAt(1)}
								</p>
							</div>
						)}
					</div>
					<div>
						<span className='text-xs text-gray-600 dark:text-gray-400'>
							Added {formatDate(attachment.created_at)}
						</span>
						<p className='font-semibold text-sm'>{attachment.file_name}</p>
						<div className='flex items-center gap-2 mt-2'>
							<Button
								onPress={handleDownload}
								radius='md'
								size='sm'
								variant='bordered'>
								Download
							</Button>
							<Button onPress={onOpen} radius='md' size='sm' variant='bordered'>
								Delete
							</Button>
						</div>
					</div>
				</div>
			</li>
			<ConfirmDeleteAttachment
				isOpen={isOpen}
				onChange={onOpenChange}
				onClose={onClose}
				attachment={attachment}
			/>
		</>
	);
};
