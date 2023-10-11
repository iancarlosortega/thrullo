import { ListItem } from '.';
import { List } from '@/types';

interface Props {
	lists: List[];
}

export const Lists: React.FC<Props> = ({ lists }) => {
	return (
		<ul className='flex gap-6'>
			{lists.map(list => (
				<ListItem list={list} key={list.id} />
			))}
		</ul>
	);
};
