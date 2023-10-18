'use client';

import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'sonner';
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	UseDisclosureProps,
} from '@nextui-org/react';
import { Attachment, Database } from '@/types';

interface Props {
	attachment: Attachment;
}

export const ConfirmDeleteAttachment = ({
	isOpen,
	onChange,
	onClose,
	attachment,
}: UseDisclosureProps & Props) => {
	const router = useRouter();
	const supabase = createClientComponentClient<Database>();

	const handleDeleteFile = async () => {
		const { error } = await supabase
			.from('attachments')
			.delete()
			.eq('id', attachment.id);
		if (error) {
			console.log(error);
			toast.error(error.message);
			return;
		}

		const { error: errorStorage } = await supabase.storage
			.from('thrullo')
			.remove([`attachments/${attachment.card_id}/${attachment.file_name}`]);

		if (errorStorage) {
			console.log(errorStorage);
			toast.error(errorStorage.message);
			return;
		}

		toast.success('Attachment removed successfully');
		router.refresh();
		onClose!();
	};

	return (
		<Modal isOpen={isOpen} onOpenChange={onChange}>
			<ModalContent>
				{onClose => (
					<>
						<ModalHeader className='text-tertiary dark:text-secondary-lt'>
							Delete Attachment
						</ModalHeader>
						<form>
							<ModalBody>
								<p className='text-sm text-neutral-500'>
									Are you sure you want to delete this attachment?
								</p>
							</ModalBody>
							<ModalFooter>
								<Button color='danger' variant='light' onPress={onClose}>
									Cancel
								</Button>
								<Button color='primary' onPress={handleDeleteFile}>
									Confirm
								</Button>
							</ModalFooter>
						</form>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};
