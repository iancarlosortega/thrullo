import { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = {
	title: 'Login | Thrullo',
	description: 'Login your account to access your dashboard',
};

export default function LoginPage() {
	return (
		<>
			<header>
				<h1 className='text-center text-xl font-bold text-primary'>
					Login your account
				</h1>
				<p className='text-center text-xs text-gray-500 dark:text-gray-300'>
					Use your credentials to access your account.
				</p>
			</header>

			<LoginForm />

			<footer>
				<p className='mt-2 text-center text-sm text-gray-500 dark:text-gray-300'>
					Don&apos;t have an account?{' '}
					<Link href='/auth/register' className='text-gray-400 underline'>
						Sign up
					</Link>
				</p>
			</footer>
		</>
	);
}
