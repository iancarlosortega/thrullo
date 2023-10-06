import { Session } from '@supabase/supabase-js';
import { create } from 'zustand';

type State = {
	user: Session['user'] | null;
};

type Actions = {
	updateLoginUser: (user: Session['user']) => void;
};

const useAuthStore = create<State & Actions>()(set => ({
	user: null,
	updateLoginUser: payload =>
		set({
			user: payload,
		}),
}));

export default useAuthStore;
