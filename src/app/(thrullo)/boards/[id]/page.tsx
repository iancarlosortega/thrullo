import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { BoardHeader } from '@/components';
import { Board, User } from '@/types';

const getBoard = async (id: string): Promise<Board | null> => {
	const supabase = createServerComponentClient({ cookies });
	const { data, error } = await supabase
		.from('boards')
		// TODO: Check this .select('*, owner(*), members(*), lists(*), lists.cards(*)')
		.select('*, owner(*)')
		.eq('id', id);

	if (error) {
		console.log(error);
		return null;
	}

	return data[0];
};

const getMembers = async (id: string): Promise<User[]> => {
	const supabase = createServerComponentClient({ cookies });
	const { data, error } = await supabase
		.from('members')
		.select('user:user_id(*)')
		.eq('board_id', id);

	if (error) {
		console.log(error);
		return [];
	}

	return data.map(({ user }: any) => user as User);
};

export default async function BoardPage({
	params: { id },
}: {
	params: { id: string };
}) {
	const board = await getBoard(id);

	if (!board) redirect('/');

	const members = await getMembers(id);

	return (
		<>
			<BoardHeader board={board!} members={members} />
		</>
	);
}
