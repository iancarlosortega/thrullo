import { BoardCardItem } from '.';

interface Props {
	boards: any[];
}

export const BoardList: React.FC<Props> = ({ boards }) => {
	return (
		<ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
			{boards.map(board => (
				<BoardCardItem key={board.id} board={board} />
			))}
		</ul>
	);
};
