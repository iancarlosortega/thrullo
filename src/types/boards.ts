import { Database } from './database';
import { User } from './users';

type BoardEntity = Database['public']['Tables']['boards']['Row'];

export type Board = BoardEntity & {
	owner: User;
};
