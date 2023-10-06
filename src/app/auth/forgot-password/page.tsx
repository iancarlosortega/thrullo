import { Metadata } from 'next';
import Link from 'next/link';
import { HiArrowLongLeft } from 'react-icons/hi2';
import { ForgotPasswordForm } from './ForgotPasswordForm';

export const metadata: Metadata = {
	title: 'Forgot Password | Thrullo',
	description: 'Recover your password.',
};

export default function ForgotPasswordPage() {
	return (
		<>
			<header className='flex justify-center items-center relative mb-2'>
				<Link
					href='/auth/login'
					className='text-primary text-sm absolute left-0 top-1 w-auto bg-transparent flex items-center justify-start gap-2 font-bold'>
					<HiArrowLongLeft className='stroke-primary stroke-2' />
					back
				</Link>
				<h1 className='text-center text-xl font-bold text-primary'>
					Forgot Password
				</h1>
			</header>
			<p className='text-center text-xs text-gray-500 dark:text-gray-300'>
				Enter your email address to reset your password.
			</p>

			<ForgotPasswordForm />
		</>
	);
}
