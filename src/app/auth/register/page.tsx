import { Metadata } from 'next';
import Link from 'next/link';
import { RegisterForm } from './RegisterForm';

export const metadata: Metadata = {
	title: 'Register | Thrullo',
	description: 'Create a new account to access your dashboard',
};

export default function RegisterPage() {
	return (
		<>
			<header>
				<h1 className='text-center text-xl font-bold text-primary'>
					Create an account
				</h1>
				<p className='text-center text-xs text-gray-500 dark:text-gray-300'>
					Setup a new account in a minute.
				</p>
			</header>

			<RegisterForm />

			<footer>
				<p className='mt-4 text-center text-sm text-gray-500 dark:text-gray-300'>
					Already have an account?{' '}
					<Link href='/auth/login' className='text-gray-400 underline'>
						Sign in
					</Link>
				</p>
			</footer>
		</>
	);
}
