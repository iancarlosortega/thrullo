'use client';

import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button, Input } from '@nextui-org/react';
import { MdEmail } from 'react-icons/md';
import { LoadingSpinner } from '@/components/UI/LoadingSpinner';

interface IFormValues {
	email: string;
}

export const ForgotPasswordForm = () => {
	const router = useRouter();
	const supabase = createClientComponentClient();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<IFormValues>();

	const onSubmit = async ({ email }: IFormValues) => {
		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${location.origin}/auth/update-password`,
		});
		if (error) {
			console.error(error);
			toast.error(error.message);
			return;
		}
		toast.success('Email sent');
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

			<Button
				isDisabled={isSubmitting}
				type='submit'
				fullWidth
				className='bg-gradient-to-r from-sky-700 to-sky-600 text-white font-bold my-4'>
				{isSubmitting ? <LoadingSpinner /> : 'Send email'}
			</Button>
		</form>
	);
};
