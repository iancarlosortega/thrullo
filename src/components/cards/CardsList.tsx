import { Card, User } from '@/types';
import { CardsListItem } from './CardsListItem';

interface Props {
	cards: Card[];
	listTitle: string;
	members: User[];
}

export const CardsList: React.FC<Props> = ({ cards, listTitle, members }) => {
	return (
		<ul>
			{cards.map(card => (
				<CardsListItem
					card={card}
					listTitle={listTitle}
					members={members}
					key={card.id}
				/>
			))}
		</ul>
	);
};
