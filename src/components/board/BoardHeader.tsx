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
		<header className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
			<div className='flex flex-col md:flex-row md:items-center gap-4'>
				<div className='grid grid-cols-2 md:grid-cols-1 gap-4'>
					<ToggleBoardVisibility board={board} />
					<div className='md:hidden'>
						<ToggleBoardInformationButton />
					</div>
				</div>
				<div className='flex flex-wrap gap-4'>
					<MembersList members={members} />
					<AddMembersButton
						ownerId={board.owner.id}
						boardId={board.id}
						members={members}
					/>
				</div>
			</div>
			<div className='hidden md:block'>
				<ToggleBoardInformationButton />
			</div>
			<BoardInformation board={board} members={members} />
		</header>
	);
};
