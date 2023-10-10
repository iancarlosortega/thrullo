import { AddMembersButton } from '@/components/buttons/AddMembersButton';
import { ToggleBoardInformationButton } from '@/components/buttons/ToggleBoardInformationButton';
import { ToggleBoardVisibility } from '@/components/board/ToggleBoardVisibility';
import { BoardInformation } from '@/components/board/BoardInformation';
import { MembersList } from '@/components/UI/MembersList';
import { Board, User } from '@/types';

interface Props {
	board: Board;
	members: User[];
}

export const BoardHeader: React.FC<Props> = ({ board, members }) => {
	return (
		<header className='flex items-center justify-between'>
			<div className='flex items-center gap-4'>
				<ToggleBoardVisibility board={board} />
				<MembersList members={members} />
				<AddMembersButton boardId={board.id} members={members} />
			</div>
			<ToggleBoardInformationButton />
			<BoardInformation board={board} members={members} />
		</header>
	);
};
