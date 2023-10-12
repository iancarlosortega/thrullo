import { Database } from './database';
import { Label } from './labels';
import { List } from './lists';

type CardEntity = Database['public']['Tables']['cards']['Row'];

export type Card = CardEntity & {
	list: List;
	labels: Label[];
};
