import { Database } from './database';
import { User } from './users';

type CommentEntity = Database['public']['Tables']['comments']['Row'];

export type Comment = CommentEntity & {
	user: User;
};
