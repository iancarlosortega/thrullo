import Image from 'next/image';

export const Logo = () => {
	return (
		<div className='flex items-center gap-2'>
			<Image src='/images/logo-small.svg' alt='Logo' width={40} height={40} />
			<h1 className='font-bold text-2xl text-dark dark:text-white'>Thrullo</h1>
		</div>
	);
};
