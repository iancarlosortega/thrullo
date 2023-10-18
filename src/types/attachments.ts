import { Card } from './cards';
import { Database } from './database';

type AttachmentEntity = Database['public']['Tables']['attachments']['Row'];

export type Attachment = AttachmentEntity & {
	card: Card;
};
