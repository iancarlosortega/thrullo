import { Card } from './cards';
import { Database } from './database';

type LabelEntity = Database['public']['Tables']['labels']['Row'];

export type Label = LabelEntity & {
	card: Card;
};
