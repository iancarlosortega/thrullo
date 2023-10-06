'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Provider } from '@supabase/supabase-js';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button, Checkbox, Input } from '@nextui-org/react';
import { MdEmail } from 'react-icons/md';
import { AiFillEye, AiFillEyeInvisible, AiTwotoneLock } from 'react-icons/ai';
import {
	FacebookIcon,
	GithubIcon,
	GmailIcon,
	LoadingSpinner,
} from '@/components';

interface IFormValues {
	email: string;
	password: string;
}

export const LoginForm = () => {
	const [isRememberSelected, setIsRememberSelected] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const router = useRouter();
	const supabase = createClientComponentClient();

	const {
		register,
		handleSubmit,
		setValue,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<IFormValues>({
		defaultValues: {
			email:
				(typeof window !== 'undefined' && localStorage.getItem('email')) || '',
			password: '',
		},
	});

	useEffect(() => {
		if (
			typeof window !== 'undefined' &&
			localStorage.getItem('remember') === 'true'
		) {
			setIsRememberSelected(true);
		}
	}, []);

	const onSubmit = async (formValues: IFormValues) => {
		const { error } = await supabase.auth.signInWithPassword({
			email: formValues.email,
			password: formValues.password,
		});

		if (error) {
			toast.error(error.message);
			setValue('password', '');
			setError('email', {
				type: 'manual',
				message: 'Check if your email is correct',
			});
			setError('password', {
				type: 'manual',
				message: 'Check if your password is correct',
			});
			return;
		}

		if (isRememberSelected) {
			localStorage.setItem('email', formValues.email);
			localStorage.setItem('remember', 'true');
		} else {
			localStorage.removeItem('email');
			localStorage.removeItem('remember');
		}

		router.push('/');
	};

	const loginWithOAuth = async (provider: Provider) => {
		await supabase.auth.signInWithOAuth({
			provider,
			options: {
				redirectTo: `${location.origin}/auth/callback`,
			},
		});
		router.push('/');
	};

	return (
		<form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
			<Input
				classNames={{
					inputWrapper: 'mt-8',
				}}
				placeholder='example@test.com'
				type='email'
				label='Email'
				color={errors.email ? 'danger' : undefined}
				errorMessage={errors.email?.message}
				startContent={<MdEmail />}
				{...register('email', {
					required: 'This field is required',
					pattern: {
						value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
						message: 'Please enter a valid email address',
					},
				})}
			/>

			<Input
				classNames={{
					inputWrapper: 'mt-4',
				}}
				placeholder='Password'
				type={showPassword ? 'text' : 'password'}
				color={errors.password ? 'danger' : undefined}
				errorMessage={errors.password?.message}
				startContent={<AiTwotoneLock />}
				endContent={
					<button type='button' onClick={() => setShowPassword(!showPassword)}>
						{showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
					</button>
				}
				{...register('password', {
					required: 'This field is required',
				})}
			/>

			<div className='flex justify-between my-4'>
				<Checkbox
					size='sm'
					isSelected={isRememberSelected}
					onValueChange={setIsRememberSelected}
					classNames={{
						label: 'text-sm text-gray-600 translate-x-[-2px]',
						wrapper: 'flex items-center',
					}}>
					Remember me
				</Checkbox>

				<Link
					href='/auth/forgot-password'
					className='text-sm underline text-gray-600'>
					Forgot password?
				</Link>
			</div>

			<Button
				isDisabled={isSubmitting}
				type='submit'
				fullWidth
				className='bg-gradient-to-r from-sky-700 to-sky-600 text-white font-bold'>
				{isSubmitting ? <LoadingSpinner /> : 'Login'}
			</Button>

			{/* Divider */}
			<div className='flex items-center gap-2 my-4'>
				<hr className='my-4 w-full' />
				<p className='flex-1 text-center text-sm text-gray-500 dark:text-gray-300'>
					or
				</p>
				<hr className='my-4 w-full' />
			</div>

			{/* Social Media Logins */}
			<div className='flex justify-center gap-4'>
				{/* Facebook */}
				<button
					type='button'
					onClick={() => loginWithOAuth('facebook')}
					data-te-ripple-init
					data-te-ripple-color='light'
					className='bg-[#1877f2] mb-2 inline-block rounded-full p-3 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg'>
					<FacebookIcon />
				</button>

				{/* Gmail */}
				<button
					type='button'
					onClick={() => loginWithOAuth('google')}
					data-te-ripple-init
					data-te-ripple-color='light'
					className='bg-[#ea4335] mb-2 inline-block rounded-full p-3 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg'>
					<GmailIcon />
				</button>

				{/* GitHub */}
				<button
					type='button'
					onClick={() => loginWithOAuth('github')}
					data-te-ripple-init
					data-te-ripple-color='light'
					className='bg-[#333] mb-2 inline-block rounded-full p-3 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg'>
					<GithubIcon />
				</button>
			</div>
		</form>
	);
};
