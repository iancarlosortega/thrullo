import { Card, User } from '@/types';
import { ListCardItem } from './ListCardItem';

interface Props {
	cards: Card[];
	listTitle: string;
	members: User[];
}

export const ListCards: React.FC<Props> = ({ cards, listTitle, members }) => {
	return (
		<ul>
			{cards.map(card => (
				<ListCardItem
					card={card}
					listTitle={listTitle}
					members={members}
					key={card.id}
				/>
			))}
		</ul>
	);
};
