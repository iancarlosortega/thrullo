import { User } from '@/types';
import { create } from 'zustand';

type State = {
	user: User | null;
};

type Actions = {
	updateLoginUser: (user: User) => void;
};

const useAuthStore = create<State & Actions>()(set => ({
	user: null,
	updateLoginUser: payload =>
		set({
			user: payload,
		}),
}));

export default useAuthStore;
