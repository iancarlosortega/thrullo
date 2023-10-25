import { CommentsListItem } from './CommentsListItem';
import { Comment, User } from '@/types';

interface Props {
	comments: Comment[];
	user: User;
}

export const CommentsList: React.FC<Props> = ({ comments, user }) => {
	return (
		<ul className='mt-6 md:my-6 [&>*:last-child]:border-none'>
			{comments.map(comment => (
				<CommentsListItem key={comment.id} comment={comment} user={user} />
			))}
		</ul>
	);
};
