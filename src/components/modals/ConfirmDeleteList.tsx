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
	listId: string;
}

export const ConfirmDeleteList = ({
	isOpen,
	onChange,
	onClose,
	listId,
}: UseDisclosureProps & Props) => {
	const router = useRouter();
	const supabase = createClientComponentClient<Database>();

	const handleDeleteList = async () => {
		const { error } = await supabase.from('lists').delete().eq('id', listId);
		if (error) {
			console.log(error);
			toast.error(error.message);
			return;
		}

		toast.success('List deleted successfully');
		router.refresh();
		onClose!();
	};

	return (
		<Modal isOpen={isOpen} onOpenChange={onChange}>
			<ModalContent>
				{onClose => (
					<>
						<ModalHeader className='text-tertiary'>Delete List</ModalHeader>
						<form>
							<ModalBody>
								<p className='text-sm text-neutral-500'>
									Are you sure you want to delete this list?
								</p>
							</ModalBody>
							<ModalFooter>
								<Button color='danger' variant='light' onPress={onClose}>
									Cancel
								</Button>
								<Button color='primary' onPress={handleDeleteList}>
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
