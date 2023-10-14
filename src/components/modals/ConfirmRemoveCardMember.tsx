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
	memberId: string;
	cardId: string;
}

export const ConfirmRemoveCardMember = ({
	isOpen,
	onChange,
	onClose,
	memberId,
	cardId,
}: UseDisclosureProps & Props) => {
	const router = useRouter();
	const supabase = createClientComponentClient<Database>();

	const handleRemoveMember = async () => {
		const { error } = await supabase
			.from('assigned_users')
			.delete()
			.eq('user_id', memberId)
			.eq('card_id', cardId);
		if (error) {
			console.log(error);
			toast.error(error.message);
			return;
		}

		toast.success('Member removed successfully');
		router.refresh();
		onClose!();
	};

	return (
		<Modal isOpen={isOpen} onOpenChange={onChange}>
			<ModalContent>
				{onClose => (
					<>
						<ModalHeader className='text-tertiary dark:text-secondary-lt'>
							Remove Member
						</ModalHeader>
						<form>
							<ModalBody>
								<p className='text-sm text-neutral-500'>
									Are you sure you want to remove this member?
								</p>
							</ModalBody>
							<ModalFooter>
								<Button color='danger' variant='light' onPress={onClose}>
									Cancel
								</Button>
								<Button color='primary' onPress={handleRemoveMember}>
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
