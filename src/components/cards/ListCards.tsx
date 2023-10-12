import { Card } from '@/types';
import { ListCardItem } from './ListCardItem';

interface Props {
	cards: Card[];
	listTitle: string;
}

export const ListCards: React.FC<Props> = ({ cards, listTitle }) => {
	return (
		<ul>
			{cards.map(card => (
				<ListCardItem card={card} listTitle={listTitle} key={card.id} />
			))}
		</ul>
	);
};
