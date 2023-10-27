import { create } from 'zustand';

type State = {
	theme: string;
	isBoardInformationOpen: boolean;
	isDragging: boolean;
	currentCardHeight: number;
};

type Actions = {
	setTheme: (theme: string) => void;
	setIsBoardInformationOpen: (isBoardInformationOpen: boolean) => void;
	setIsDragging: (isDragging: boolean) => void;
	setCurrentCardHeight: (currentCardHeight: number) => void;
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
	isDragging: false,
	currentCardHeight: 0,
	setTheme: theme => set({ theme }),
	setIsBoardInformationOpen: isBoardInformationOpen =>
		set({ isBoardInformationOpen }),
	setIsDragging: isDragging => set({ isDragging }),
	setCurrentCardHeight: currentCardHeight => set({ currentCardHeight }),
}));

export default useUIStore;
