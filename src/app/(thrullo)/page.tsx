import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { AddBoardButton, BoardList } from '@/components';
import { Board, Database } from '@/types';
import { redirect } from 'next/navigation';

const getBoards = async (): Promise<Board[]> => {
	const supabase = createServerComponentClient<Database>({ cookies });
	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session) redirect('/auth/login');

	const { data: ownerData, error: ownerError } = await supabase
		.from('boards')
		.select('*, owner(*), members(user_id(*))')
		.eq('owner', session.user.id);

	if (ownerError) {
		console.log(ownerError);
		return [];
	}

	const { data: membersData, error: membersError } = await supabase
		.from('members')
		.select('board_id(*, owner(*), members(user_id(*)))')
		.eq('user_id', session.user.id);

	if (membersError) {
		console.log(membersError);
		return [];
	}

	const membersBoards = membersData.map((member: any) => member.board_id);

	const allBoards = [...ownerData, ...membersBoards];

	const mappedData = allBoards.map((board: any) => ({
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
