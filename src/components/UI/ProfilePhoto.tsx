import Image from 'next/image';
import { User } from '@/types';
import { NoProfilePhoto } from './NoProfilePhoto';

interface Props {
	user: User;
}

export const ProfilePhoto: React.FC<Props> = ({ user }) => {
	return (
		<>
			{user.avatar_url ? (
				<Image
					src={user.avatar_url}
					alt='Profile Picture'
					width={40}
					height={40}
					className='rounded-lg'
				/>
			) : (
				<NoProfilePhoto fullName={user.full_name} />
			)}
		</>
	);
};
