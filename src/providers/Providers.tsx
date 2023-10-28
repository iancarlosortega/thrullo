'use client';

import { useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import { NextUIProvider } from '@nextui-org/react';
import useUIStore from '@/store/uiStore';

interface Props {
	children: React.ReactNode;
}

export const Providers: React.FC<Props> = ({ children }) => {
	const [isMounted, setIsMounted] = useState(false);
	const theme = useUIStore(state => state.theme);

	useEffect(() => {
		const root = document.documentElement;
		if (theme === 'light') {
			root.classList.remove('dark');
		} else {
			root.classList.add('dark');
		}
		setIsMounted(true);
	}, [theme]);

	if (!isMounted) return null;

	return (
		<NextUIProvider>
			<Toaster richColors expand position='top-right' />
			{children}
		</NextUIProvider>
	);
};
