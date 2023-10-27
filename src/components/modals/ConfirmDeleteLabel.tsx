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
import { Database } from '@/types';

interface Props {
	labelId: string;
}

export const ConfirmDeleteLabel = ({
	isOpen,
	onChange,
	onClose,
	labelId,
}: UseDisclosureProps & Props) => {
	const router = useRouter();
	const supabase = createClientComponentClient<Database>();

	const handleDeleteLabel = async () => {
		const { error } = await supabase.from('labels').delete().eq('id', labelId);
		if (error) {
			console.log(error);
			toast.error(error.message);
			return;
		}

		toast.success('Label removed successfully');
		router.refresh();
		onClose!();
	};

	return (
		<Modal isOpen={isOpen} onOpenChange={onChange}>
			<ModalContent>
				{onClose => (
					<>
						<ModalHeader className='text-tertiary dark:text-secondary-lt'>
							Delete Label
						</ModalHeader>
						<form>
							<ModalBody>
								<p className='text-sm text-neutral-500'>
									Are you sure you want to delete this label?
								</p>
							</ModalBody>
							<ModalFooter>
								<Button color='danger' variant='light' onPress={onClose}>
									Cancel
								</Button>
								<Button color='primary' onPress={handleDeleteLabel}>
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
