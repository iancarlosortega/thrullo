'use client';

import { useLayoutEffect, useState } from 'react';
import Image from 'next/image';
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from '@nextui-org/react';
import { BsFillCaretDownFill } from 'react-icons/bs';
import { MdOutlineLogout } from 'react-icons/md';
import { ThemeToggle } from './ThemeToggle';

export const UserDropdown = () => {
	const [size, setSize] = useState([0, 0]);

	useLayoutEffect(() => {
		function updateSize() {
			setSize([window.innerWidth, window.innerHeight]);
		}
		window.addEventListener('resize', updateSize);
		updateSize();
		return () => window.removeEventListener('resize', updateSize);
	}, []);

	const handleSignOut = () => {
		// signOut();
	};

	return (
		<Dropdown
			placement='bottom'
			backdrop={size[0] > 992 ? 'blur' : undefined}
			showArrow
			classNames={{
				base: 'py-1 px-1 border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black',
				arrow: 'bg-default-200',
			}}>
			<DropdownTrigger>
				<div className='flex items-center gap-4 px-4 py-2 rounded-md cursor-pointer hover:bg-secondary-lts dark:hover:bg-neutral-900 transition-colors'>
					<div>
						<Image
							src='/images/profile.jpeg'
							alt='Profile Picture'
							width={40}
							height={40}
							className='rounded-lg'
						/>
					</div>
					<p className='font-bold text-dark dark:text-white'>Xanthe Neal</p>
					<BsFillCaretDownFill className='text-dark dark:text-gray-200' />
				</div>
			</DropdownTrigger>
			<DropdownMenu aria-label='Profile Actions' variant='flat'>
				<DropdownItem key='profile' className='h-14 gap-2'>
					<p className='font-semibold'>Signed in as</p>
					{/* <p className='font-semibold'>{user?.email}</p> */}
				</DropdownItem>
				<DropdownItem isReadOnly key='toggle-theme'>
					<ThemeToggle />
				</DropdownItem>
				<DropdownItem
					onClick={handleSignOut}
					key='logout'
					color='danger'
					startContent={<MdOutlineLogout />}>
					Log Out
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	);
};
