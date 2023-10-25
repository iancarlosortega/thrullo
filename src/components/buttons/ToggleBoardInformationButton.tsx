'use client';

import useUIStore from '@/store/uiStore';
import { Button } from '@nextui-org/react';
import { BsThreeDots } from 'react-icons/bs';

export const ToggleBoardInformationButton = () => {
	const setIsBoardInformationOpen = useUIStore(
		state => state.setIsBoardInformationOpen
	);

	return (
		<Button
			fullWidth
			className='bg-secondary-lts text-secondary dark:bg-neutral-900/50 font-medium h-12 px-6'
			onPress={() => setIsBoardInformationOpen(true)}
			startContent={<BsThreeDots />}>
			Show Menu
		</Button>
	);
};
