'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button, Input } from '@nextui-org/react';
import { LuLayoutDashboard } from 'react-icons/lu';
import { UserDropdown } from '@/components/UI/UserDropdown';
import { Logo } from './Logo';
import { classNames } from '@/utils';

export const Header = () => {
	const [isPathHome, setIsPathHome] = useState(false);
	const [boardName, setBoardName] = useState('');
	const pathName = usePathname();
	const supabase = createClientComponentClient();

	useEffect(() => {
		const fetchBoardName = async () => {
			if (pathName === '/') {
				setIsPathHome(true);
			} else {
				const boardId = pathName.split('/')[2];
				const { data, error } = await supabase
					.from('boards')
					.select('title')
					.eq('id', boardId);

				if (error) {
					console.log(error);
					return;
				}
				setBoardName(data[0].title);
				setIsPathHome(false);
			}
		};
		fetchBoardName();
	}, [pathName, supabase]);

	return (
		<header
			className={classNames(
				'py-2 px-4 lg:px-6 flex justify-between items-center h-[80px] bg-white dark:bg-neutral-950',
				'shadow-[0px_2px_2px_0px_rgba(0,0,0,0.05)] dark:shadow-[0px_2px_2px_0px_#1A202C]'
			)}>
			<div className='flex items-center'>
				<Logo />
				{!isPathHome && (
					<div className='hidden xl:flex ml-36 items-center'>
						<h4 className='font-medium text-lg text-tertiary dark:text-gray-400 px-6 border-r border-[#E0E0E0] dark:border-gray-400'>
							{boardName}
						</h4>
						<Link
							href='/'
							className='bg-secondary-lts text-secondary dark:bg-neutral-900/50 rounded-lg font-medium h-12 ml-6 px-6 flex justify-center items-center gap-4'>
							<LuLayoutDashboard />
							All Boards
						</Link>
					</div>
				)}
			</div>

			<div className='flex items-center gap-6 lg:gap-12'>
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
