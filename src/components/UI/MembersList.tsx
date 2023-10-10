import { User } from '@/types';
import { ProfilePhoto } from './ProfilePhoto';

interface Props {
	members: User[];
}

export const MembersList: React.FC<Props> = ({ members }) => {
	if (members.length == 0) return null;

	return (
		<ul className='flex gap-4'>
			{members.map(member => (
				<li key={member.id}>
					<ProfilePhoto user={member} />
				</li>
			))}
		</ul>
	);
};
