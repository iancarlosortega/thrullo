'use client';

import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import useAuthStore from '@/store/authStore';

interface Props {
	children: React.ReactNode;
	session: Session;
}

export const AuthProvider: React.FC<Props> = ({ children, session }) => {
	const [isMounted, setIsMounted] = useState(false);
	const { updateLoginUser } = useAuthStore();

	useEffect(() => {
		updateLoginUser(session.user);
		setIsMounted(true);
	}, [session, updateLoginUser]);

	if (!isMounted) return null;

	return <>{children}</>;
};
