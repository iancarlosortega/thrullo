import './globals.css';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { Providers } from '@/providers';
import { classNames } from '@/utils';

const poppins = Poppins({
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
	title: 'Home | Thrullo',
	description:
		'Thrullo is a new way to organize and share your ideas with teamates for future projects.',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='es'>
			<body
				className={classNames(
					'bg-light-gray dark:bg-neutral-800 min-h-screen h-full',
					poppins.className
				)}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
