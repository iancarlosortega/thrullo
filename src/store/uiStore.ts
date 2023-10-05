import { create } from 'zustand';

type State = {
	theme: string;
};

type Actions = {
	setTheme: (theme: string) => void;
};

const getInitialTheme = (): string => {
	if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
		return localStorage.getItem('theme')!;
	}
	if (
		typeof window != 'undefined' &&
		window.matchMedia('(prefers-color-scheme: dark)').matches
	) {
		return 'dark';
	}
	return 'light';
};

const useUIStore = create<State & Actions>()(set => ({
	theme: getInitialTheme(),
	setTheme: theme => set({ theme }),
}));

export default useUIStore;
