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
		updateLoginUser({
			id: session.user!.id,
			email: session.user!.email!,
			full_name: session.user!.user_metadata!.full_name!,
			avatar_url: session.user!.user_metadata!.avatar_url!,
			created_at: session.user!.created_at!,
		});
		setIsMounted(true);
	}, [session, updateLoginUser]);

	if (!isMounted) return null;

	return <>{children}</>;
};
