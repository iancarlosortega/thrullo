import { Attachment } from '@/types';
import { AttachmentsListItem } from './AttachmentsListItem';

interface Props {
	attachments: Attachment[];
	cardId: string;
}

export const AttachmentsList: React.FC<Props> = ({ attachments, cardId }) => {
	return (
		<ul className='mb-8'>
			{attachments.map(attachment => (
				<AttachmentsListItem
					key={attachment.id}
					attachment={attachment}
					cardId={cardId}
				/>
			))}
		</ul>
	);
};
