import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { BoardHeader } from '@/components';
import { Board } from '@/types';

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

export default async function BoardPage({
	params: { id },
}: {
	params: { id: string };
}) {
	const board = await getBoard(id);

	if (!board) redirect('/');

	return (
		<>
			<BoardHeader board={board!} />
			<pre>{JSON.stringify(board, null, 2)}</pre>
		</>
	);
}
