import { Database } from './database';
import { List } from './lists';
import { User } from './users';

type BoardEntity = Database['public']['Tables']['boards']['Row'];

export type Board = BoardEntity & {
	owner: User;
	members: User[];
	lists: List[];
};
