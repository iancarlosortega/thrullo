import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { UserDropdown } from '.';
import { Logo } from './Logo';
import { classNames } from '@/utils';

export const Header = () => {
	return (
		<header
			className={classNames(
				'py-2 px-4 lg:px-6 flex justify-between items-center h-[80px] bg-white dark:bg-neutral-950',
				'shadow-[0px_2px_2px_0px_rgba(0,0,0,0.05)] dark:shadow-[0px_2px_2px_0px_#1A202C]'
			)}>
			<Logo />

			<div className='flex items-center gap-6 lg:gap-12'>
				<form autoComplete='off' className='relative hidden md:flex	'>
					<Input
						size='lg'
						type='text'
						placeholder='Keyword...'
						classNames={{
							inputWrapper: [
								'md:w-[300px] shadow-lg caret-sky-500',
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
