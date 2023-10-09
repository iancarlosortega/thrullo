import { ToggleBoardVisibility } from './ToggleBoardVisibility';
import { Board } from '@/types';

interface Props {
	board: Board;
}

export const BoardHeader: React.FC<Props> = ({ board }) => {
	return (
		<header>
			<div>
				<ToggleBoardVisibility board={board} />
			</div>
		</header>
	);
};
