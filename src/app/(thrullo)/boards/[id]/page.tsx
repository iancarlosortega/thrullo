import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { AddListButton, BoardHeader, Lists } from '@/components';
import { classNames } from '@/utils';
import { Board } from '@/types';

const getBoard = async (id: string): Promise<Board | null> => {
	const supabase = createServerComponentClient({ cookies });
	const { data, error } = await supabase
		.from('boards')
		.select(
			'*, owner(*), members(user_id(*)), lists(*, cards(*, labels(*), assigned_users(user_id(*)), comments(*, user:user_id(*)), attachments(*)))'
		)
		.eq('id', id);

	if (error) {
		console.log(error);
		return null;
	}

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
		<div className='flex flex-col gap-6 min-h-[calc(100vh-120px)]'>
			<BoardHeader board={board!} members={board.members} />
			<section
				className={classNames(
					'bg-gray-200/50 rounded-2xl py-4 px-8 flex-1',
					'flex items-start overflow-x-auto dark:bg-neutral-900'
				)}>
				<Lists lists={board.lists} members={board.members} />
				<AddListButton boardId={board.id} />
			</section>
		</div>
	);
}
