import { Database } from './database';
import { Label } from './labels';
import { List } from './lists';
import { User } from './users';

type CardEntity = Database['public']['Tables']['cards']['Row'];

export type Card = CardEntity & {
	list: List;
	labels: Label[];
	assigned_users: User[];
};
