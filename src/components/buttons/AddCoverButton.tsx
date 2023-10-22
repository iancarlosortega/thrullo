'use client';

import { Button } from '@nextui-org/react';
import { useState } from 'react';
import { HiPhotograph } from 'react-icons/hi';
import { CoverMenu } from '../menus/CoverMenu';

export const AddCoverButton = () => {
	const [isCoverMenuOpen, setIsCoverMenuOpen] = useState(false);

	return (
		<div className='relative'>
			<Button
				onPress={() => setIsCoverMenuOpen(!isCoverMenuOpen)}
				className='bg-secondary-lts text-secondary dark:bg-neutral-950/50 font-medium justify-start w-[160px] my-2'
				startContent={<HiPhotograph />}>
				Cover
			</Button>
			<CoverMenu isOpen={isCoverMenuOpen} toggleMenu={setIsCoverMenuOpen} />
		</div>
	);
};
