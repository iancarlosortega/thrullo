import { ListItem } from '.';
import { List, User } from '@/types';

interface Props {
	lists: List[];
	members: User[];
}

export const Lists: React.FC<Props> = ({ lists, members }) => {
	return (
		<ul className='flex gap-6'>
			{lists.map(list => (
				<ListItem list={list} key={list.id} members={members} />
			))}
		</ul>
	);
};
