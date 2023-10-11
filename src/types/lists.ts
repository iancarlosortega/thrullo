import { Board } from './boards';
import { Database } from './database';

type ListEntity = Database['public']['Tables']['lists']['Row'];

export type List = ListEntity & {
	board: Board;
};
