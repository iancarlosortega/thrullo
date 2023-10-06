'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button, Input } from '@nextui-org/react';
import { MdEmail } from 'react-icons/md';
import { AiFillEye, AiFillEyeInvisible, AiTwotoneLock } from 'react-icons/ai';
import { LoadingSpinner } from '@/components/UI/LoadingSpinner';

interface IFormValues {
	email: string;
	password: string;
}

export const UpdatePasswordForm = () => {
	const [showPassword, setShowPassword] = useState(false);
	const router = useRouter();
	const supabase = createClientComponentClient();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<IFormValues>();

	const onSubmit = async ({ email, password }: IFormValues) => {
		console.log(email, password);
		const { error } = await supabase.auth.updateUser({
			email,
			password,
		});
		if (error) {
			console.error(error);
			toast.error(error.message);
			return;
		}
		toast.success('Password updated successfully');
		router.push('/auth/login');
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
				label='New Password'
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

			<Button
				isDisabled={isSubmitting}
				type='submit'
				fullWidth
				className='bg-gradient-to-r from-sky-700 to-sky-600 text-white font-bold my-6'>
				{isSubmitting ? <LoadingSpinner /> : 'Update'}
			</Button>
		</form>
	);
};
