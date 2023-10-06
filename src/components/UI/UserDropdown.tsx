'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'sonner';
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from '@nextui-org/react';
import { BsFillCaretDownFill } from 'react-icons/bs';
import { MdOutlineLogout } from 'react-icons/md';
import useAuthStore from '@/store/authStore';
import { ThemeToggle } from './ThemeToggle';
import { NoProfilePhoto } from './NoProfilePhoto';

export const UserDropdown = () => {
	const { user } = useAuthStore();

	const router = useRouter();
	const supabase = createClientComponentClient();

	const handleSignOut = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error(error);
			toast.error(error.message);
			return;
		}
		router.refresh();
	};

	return (
		<Dropdown
			placement='bottom'
			classNames={{
				base: 'py-1 px-1 border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black',
				arrow: 'bg-default-200',
			}}>
			<DropdownTrigger>
				<div className='flex items-center gap-4 px-4 py-2 rounded-md cursor-pointer hover:bg-secondary-lts dark:hover:bg-neutral-900 transition-colors'>
					<div>
						{user?.user_metadata.avatar_url ? (
							<Image
								src={user?.user_metadata.avatar_url}
								alt='Profile Picture'
								width={40}
								height={40}
								className='rounded-lg'
							/>
						) : (
							<NoProfilePhoto fullName={user?.user_metadata.full_name} />
						)}
					</div>
					<p className='font-bold text-dark dark:text-white'>
						{user?.user_metadata.full_name}
					</p>
					<BsFillCaretDownFill className='text-dark dark:text-gray-200' />
				</div>
			</DropdownTrigger>
			<DropdownMenu aria-label='Profile Actions' variant='flat'>
				<DropdownItem key='profile' className='h-14 gap-2'>
					<p className='font-semibold'>Signed in as</p>
					<p className='font-semibold'>{user?.email}</p>
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
