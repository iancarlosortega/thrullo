import { create } from 'zustand';

type State = {
	theme: string;
	isBoardInformationOpen: boolean;
	isLabelMenuOpen: boolean;
};

type Actions = {
	setTheme: (theme: string) => void;
	setIsBoardInformationOpen: (isBoardInformationOpen: boolean) => void;
	setIsLabelMenuOpen: (isLabelMenuOpen: boolean) => void;
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
	isBoardInformationOpen: false,
	isLabelMenuOpen: false,
	setTheme: theme => set({ theme }),
	setIsBoardInformationOpen: isBoardInformationOpen =>
		set({ isBoardInformationOpen }),
	setIsLabelMenuOpen: isLabelMenuOpen => set({ isLabelMenuOpen }),
}));

export default useUIStore;
