import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { redirect } from 'next/navigation';
import { AuthProvider } from '@/providers';
import { Header } from '@/components';

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
		<main className='bg-light-gray dark:bg-neutral-800 min-h-screen h-full'>
			<AuthProvider session={session}>
				<Header />
				<section className='container mx-auto py-4 px-4 md:px-0'>
					{children}
				</section>
			</AuthProvider>
		</main>
	);
}
