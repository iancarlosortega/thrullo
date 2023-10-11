import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { AddListButton, BoardHeader, Lists } from '@/components';
import { Board } from '@/types';
import { classNames } from '@/utils';

const getBoard = async (id: string): Promise<Board | null> => {
	const supabase = createServerComponentClient({ cookies });
	const { data, error } = await supabase
		.from('boards')
		// TODO: Check this .select('*, owner(*), members(*), lists(*), lists.cards(*)')
		.select('*, owner(*), lists(*), members(user_id(*))')
		.eq('id', id);
	// .order('lists.created_at', { ascending: true });

	if (error) {
		console.log(error);
		return null;
	}

	// Give me sorted lists

	return {
		...data[0],
		lists: data[0].lists.sort((a: any, b: any) =>
			a.created_at > b.created_at ? 1 : -1
		),
		members: data[0].members.map((member: any) => member.user_id),
	};
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
			<BoardHeader board={board!} members={board.members} />
			<main
				className={classNames(
					'bg-gray-200/50 rounded-2xl py-4 px-8 my-6 h-full min-h-[calc(100vh-13rem)]',
					'flex items-start overflow-x-auto'
				)}>
				<Lists lists={board.lists} />
				<AddListButton boardId={board.id} />
			</main>
		</>
	);
}
