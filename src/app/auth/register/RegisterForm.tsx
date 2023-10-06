'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { Button, Input } from '@nextui-org/react';
import { MdEmail } from 'react-icons/md';
import { AiFillEye, AiFillEyeInvisible, AiTwotoneLock } from 'react-icons/ai';
import { BsFillPersonFill } from 'react-icons/bs';
import { LoadingSpinner } from '@/components/UI/LoadingSpinner';

interface IFormValues {
	fullName: string;
	email: string;
	password: string;
	confirmPassword: string;
}

export const RegisterForm = () => {
	const [showPassword, setShowPassword] = useState(false);
	const router = useRouter();
	const supabase = createClientComponentClient();

	const {
		register,
		handleSubmit,
		getValues,
		formState: { errors, isSubmitting },
	} = useForm<IFormValues>();

	const onSubmit = async (formValues: IFormValues) => {
		const { error } = await supabase.auth.signUp({
			email: formValues.email,
			password: formValues.password,
			options: {
				emailRedirectTo: `${location.origin}/auth/callback`,
				data: {
					full_name: formValues.fullName,
				},
			},
		});

		if (error) {
			toast.error(error.message);
			return;
		}

		router.push('/');
	};

	return (
		<form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
			<Input
				classNames={{
					inputWrapper: 'mt-8',
				}}
				placeholder='Full name'
				type='text'
				label='Name'
				color={errors.fullName ? 'danger' : undefined}
				errorMessage={errors.fullName?.message}
				startContent={<BsFillPersonFill />}
				{...register('fullName', {
					required: 'This field is required',
					minLength: {
						value: 3,
						message: 'At least 3 characters are required',
					},
				})}
			/>

			<Input
				classNames={{
					inputWrapper: 'mt-4',
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
				label='Password'
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
					minLength: {
						value: 8,
						message: 'Must have at least 8 characters',
					},
					pattern: {
						value:
							/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
						message:
							'Password must have at least one uppercase letter, one lowercase letter, one number and one special character',
					},
				})}
			/>

			<Input
				classNames={{
					inputWrapper: 'mt-4',
				}}
				label='Confirm Password'
				placeholder='Confirm Password'
				type={showPassword ? 'text' : 'password'}
				color={errors.confirmPassword ? 'danger' : undefined}
				errorMessage={errors.confirmPassword?.message}
				startContent={<AiTwotoneLock />}
				endContent={
					<button type='button' onClick={() => setShowPassword(!showPassword)}>
						{showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
					</button>
				}
				{...register('confirmPassword', {
					required: 'This field is required',
					validate: value =>
						value === getValues('password') ? true : "Passwords don't match",
				})}
			/>

			<Button
				isDisabled={isSubmitting}
				type='submit'
				fullWidth
				className='bg-gradient-to-r from-sky-700 to-sky-600 text-white font-bold mt-6 mb-4'>
				{isSubmitting ? <LoadingSpinner /> : 'Register'}
			</Button>
		</form>
	);
};
