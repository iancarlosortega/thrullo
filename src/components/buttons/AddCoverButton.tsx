'use client';

import { Button } from '@nextui-org/react';
import { useState } from 'react';
import { HiPhotograph } from 'react-icons/hi';
import { CoverMenu } from '../menus/CoverMenu';

interface Props {
	variant?: 'primary' | 'secondary';
	coverUrl: string;
	updateCardCover: (coverUrl: string) => void;
}

export const AddCoverButton: React.FC<Props> = ({
	variant = 'primary',
	coverUrl,
	updateCardCover,
}) => {
	const [isCoverMenuOpen, setIsCoverMenuOpen] = useState(false);

	const styles = {
		primary: 'justify-center w-[150px]',
		secondary: 'justify-start w-[160px]',
	};

	return (
		<div className='relative'>
			<Button
				size={variant === 'primary' ? 'lg' : 'md'}
				onPress={() => setIsCoverMenuOpen(!isCoverMenuOpen)}
				className={`bg-secondary-lts text-secondary dark:bg-neutral-950/50 font-medium ${styles[variant]}`}
				startContent={<HiPhotograph />}>
				Cover
			</Button>
			<CoverMenu
				coverUrl={coverUrl}
				isOpen={isCoverMenuOpen}
				toggleMenu={setIsCoverMenuOpen}
				updateCardCover={updateCardCover}
			/>
		</div>
	);
};
