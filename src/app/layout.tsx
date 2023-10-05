import './globals.css';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';

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
			<body className={poppins.className}>{children}</body>
		</html>
	);
}
