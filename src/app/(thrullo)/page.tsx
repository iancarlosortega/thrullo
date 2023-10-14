import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { AddBoardButton, BoardList } from '@/components';
import { Board, Database } from '@/types';

const getBoards = async (): Promise<Board[]> => {
	const supabase = createServerComponentClient<Database>({ cookies });
	const { data, error } = await supabase
		.from('boards')
		.select('*, owner(*), members(user_id(*))');

	if (error) {
		console.log(error);
		return [];
	}

	const mappedData = data.map((board: any) => ({
		...board,
		members: [
			board.owner,
			...board.members.map((member: any) => member.user_id),
		],
	}));

	return mappedData as Board[];
};

export default async function HomePage() {
	const boards = await getBoards();

	return (
		<>
			<div className='flex justify-between my-4'>
				<h3 className='text-lg font-medium'>All Boards</h3>
				<AddBoardButton />
			</div>
			<section>
				<BoardList boards={boards} />
			</section>
		</>
	);
}
