import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { classNames } from '@/utils';
import { UserDropdown } from '.';
import { Logo } from './Logo';

export const Header = () => {
	return (
		<header
			className={classNames(
				'p-2 md:px-4 lg:px-6 flex justify-between items-center h-[80px]',
				'shadow-[0px_2px_2px_0px_rgba(0,0,0,0.05)] dark:shadow-[0px_2px_2px_0px_#1A202C]'
			)}>
			<Logo />

			<div className='flex items-center gap-12'>
				<form autoComplete='off' className='flex relative'>
					<Input
						size='lg'
						type='text'
						placeholder='Keyword...'
						// className='w-full lg:max-w-[400px]'
						classNames={{
							inputWrapper: [
								'min-w-[300px] lg:max-w-[400px] shadow-lg',
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
