import { User } from '@/types';
import { ProfilePhoto } from './ProfilePhoto';

interface Props {
	members: User[];
	count?: number;
	showAll?: boolean;
	showCount?: boolean;
}

export const MembersList: React.FC<Props> = ({
	members,
	count = 3,
	showAll = true,
	showCount = true,
}) => {
	if (members.length == 0) return null;
	let filteredMembers = [];

	if (!showAll) {
		filteredMembers = members.slice(0, count);
	} else {
		filteredMembers = members;
	}

	return (
		<ul className='flex items-center gap-4'>
			{filteredMembers.map(member => (
				<li key={member.id}>
					<ProfilePhoto user={member} />
				</li>
			))}
			{!showAll && showCount && members.length > count && (
				<li>
					<p className='text-secondary-lt text-sm'>
						+
						<span className='ml-2'>
							{members.length - 3 === 1
								? '1 other'
								: `${members.length - 3} others`}
						</span>
					</p>
				</li>
			)}
		</ul>
	);
};
