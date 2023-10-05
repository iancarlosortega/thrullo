'use client';

import useUIStore from '@/store/uiStore';
import { Switch } from '@nextui-org/react';
import { BsFillMoonFill, BsFillSunFill } from 'react-icons/bs';

export const ThemeToggle = () => {
	const { theme, setTheme } = useUIStore();

	const onToggleTheme = () => {
		const themeSelected = theme === 'light' ? 'dark' : 'light';
		localStorage.setItem('theme', themeSelected);
		setTheme(themeSelected);
	};

	return (
		<Switch
			onChange={onToggleTheme}
			defaultSelected={theme === 'light'}
			size='sm'
			startContent={<BsFillSunFill />}
			endContent={<BsFillMoonFill />}
			classNames={{
				base: 'flex-row-reverse gap-4',
			}}>
			Toggle Theme
		</Switch>
	);
};
