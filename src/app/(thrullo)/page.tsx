import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { AddBoardButton, BoardCardItem } from '@/components';
import { Board, Database } from '@/types';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

const getBoards = async (): Promise<Board[]> => {
	const supabase = createServerComponentClient<Database>({ cookies });
	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session) redirect('/auth/login');

	const { data: ownerData, error: ownerError } = await supabase
		.from('boards')
		.select('*, owner(*), members(user_id(*))')
		.or(`owner.eq.${session.user.id},is_public.eq.true`);

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

	const sortedData = mappedData.sort((a, b) => {
		if (a.updated_at > b.updated_at) return -1;
		if (a.updated_at < b.updated_at) return 1;
		return 0;
	});

	return sortedData;
};

export default async function HomePage() {
	const boards = await getBoards();

	return (
		<>
			<header className='flex justify-between my-4'>
				<h2 className='text-lg font-medium'>All Boards</h2>
				<AddBoardButton />
			</header>
			<section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
				{boards.map(board => (
					<BoardCardItem key={board.id} board={board} />
				))}
			</section>
		</>
	);
}
