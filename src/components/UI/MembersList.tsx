import { User } from '@/types';
import { ProfilePhoto } from '.';

interface Props {
	members: User[];
}

export const MembersList: React.FC<Props> = ({ members }) => {
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
