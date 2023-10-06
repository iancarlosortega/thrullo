export default async function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<main className='min-h-screen h-full flex justify-center items-center bg-secondary-50'>
			<div className='bg-white dark:bg-neutral-900 p-6 shadow-lg rounded-md w-[400px] max-w-[90%]'>
				{children}
			</div>
		</main>
	);
}
