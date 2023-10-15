'use client';

import { Button } from '@nextui-org/react';
import { useState } from 'react';
import { MdLabel } from 'react-icons/md';
import { LabelsMenu } from '../menus/LabelsMenu';
import { Card } from '@/types';

interface Props {
	card: Card;
}

export const AddCardLabelsButton: React.FC<Props> = ({ card }) => {
	const [isLabelMenuOpen, setIsLabelMenuOpen] = useState(false);

	return (
		<div className='relative'>
			<Button
				onPress={() => setIsLabelMenuOpen(true)}
				className='bg-secondary-lts text-secondary dark:bg-neutral-950/50 font-medium justify-start w-[160px] my-2'
				startContent={<MdLabel />}>
				Labels
			</Button>
			<LabelsMenu
				card={card}
				isOpen={isLabelMenuOpen}
				toggleMenu={setIsLabelMenuOpen}
			/>
		</div>
	);
};
