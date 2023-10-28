'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button, Input } from '@nextui-org/react';
import { LuLayoutDashboard } from 'react-icons/lu';
import useAuthStore from '@/store/authStore';
import { UserDropdown } from '@/components/UI/UserDropdown';
import { UpdateTitleInput } from '../inputs/UpdateTitleInput';
import { Logo } from './Logo';
import { classNames } from '@/utils';
import { toast } from 'sonner';
import { Board } from '@/types';

export const Header = () => {
	const [isPathHome, setIsPathHome] = useState(false);
	const [board, setBoard] = useState<Board | null>(null);
	const user = useAuthStore(state => state.user);
	const pathName = usePathname();
	const supabase = createClientComponentClient();
	const router = useRouter();

	useEffect(() => {
		const fetchBoardName = async () => {
			if (pathName === '/') {
				setIsPathHome(true);
			} else {
				const boardId = pathName.split('/')[2];
				const { data, error } = await supabase
					.from('boards')
					.select('*')
					.eq('id', boardId);

				if (error) {
					console.log(error);
					return;
				}
				setBoard(data[0]);
				setIsPathHome(false);
			}
		};
		fetchBoardName();
	}, [pathName, supabase]);

	const handleUpdateBoardTitle = async (title: string) => {
		if (title === board?.title) return;

		const { error } = await supabase
			.from('boards')
			.update({
				title,
			})
			.eq('id', board!.id);

		if (error) {
			console.error(error);
			toast.error(error.message);
			return;
		}

		router.refresh();
	};

	return (
		<header
			className={classNames(
				'py-2 px-4 lg:px-6 flex justify-between items-center h-[80px] bg-white dark:bg-neutral-950',
				'shadow-[0px_2px_2px_0px_rgba(0,0,0,0.05)] dark:shadow-[0px_2px_2px_0px_#1A202C]'
			)}>
			<div className='flex items-center'>
				<Logo />
				{!isPathHome && board?.title && (
					<div className='hidden xl:flex ml-16 2xl:ml-36 gap-6 items-center'>
						<UpdateTitleInput
							title={board.title}
							canEdit={user?.id === board.owner}
							onSubmit={handleUpdateBoardTitle}
						/>
						<div className='h-10 w-1 border-l border-gray-600/50'></div>
						<Link
							href='/'
							className={classNames(
								'bg-secondary-lts text-secondary dark:bg-neutral-900/50 rounded-lg font-medium',
								'h-12 px-6 flex justify-center items-center gap-4'
							)}>
							<LuLayoutDashboard />
							All Boards
						</Link>
					</div>
				)}
			</div>

			<div className='flex items-center gap-2 lg:gap-12'>
				<form autoComplete='off' className='relative hidden md:flex	'>
					<Input
						size='lg'
						type='text'
						placeholder='Keyword...'
						classNames={{
							inputWrapper: [
								'md:w-[300px] shadow-lg caret-sky-500',
								'focus-within:!ring-0 focus-within:!ring-transparent pr-24',
							],
						}}
					/>
					<Button
						type='submit'
						className={classNames(
							'bg-primary text-white absolute top-1 right-1 z-10'
						)}>
						Search
					</Button>
				</form>

				<UserDropdown />
			</div>
		</header>
	);
};
