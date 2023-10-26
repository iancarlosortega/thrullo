import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { redirect } from 'next/navigation';
import { AuthProvider } from '@/providers';
import { Header } from '@/components/UI/Header';
import { classNames } from '@/utils';

const getSession = async () => {
	const supabase = createServerComponentClient({
		cookies,
	});
	const {
		data: { session },
	} = await supabase.auth.getSession();

	return session;
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getSession();
	if (!session) redirect('/auth/login');

	return (
		<>
			<AuthProvider session={session}>
				<Header />
				<main
					className={classNames(
						'container mx-auto p-4 min-h-[calc(100vh-100px)]',
						'flex flex-col gap-6'
					)}>
					{children}
				</main>
			</AuthProvider>
		</>
	);
}
