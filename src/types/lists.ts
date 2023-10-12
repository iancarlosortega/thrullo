import { Board } from './boards';
import { Card } from './cards';
import { Database } from './database';

type ListEntity = Database['public']['Tables']['lists']['Row'];

export type List = ListEntity & {
	board: Board;
	cards: Card[];
};
