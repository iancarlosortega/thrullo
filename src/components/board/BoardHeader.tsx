import { AddMembersButton } from '@/components/buttons/AddMembersButton';
import { ToggleBoardVisibility } from '@/components/board/ToggleBoardVisibility';
import { MembersList } from '@/components/UI/MembersList';
import { Board, User } from '@/types';

interface Props {
	board: Board;
	members: User[];
}

export const BoardHeader: React.FC<Props> = ({ board, members }) => {
	return (
		<header>
			<div className='flex items-center gap-4'>
				<ToggleBoardVisibility board={board} />
				<MembersList members={members} />
				<AddMembersButton boardId={board.id} />
			</div>
		</header>
	);
};
