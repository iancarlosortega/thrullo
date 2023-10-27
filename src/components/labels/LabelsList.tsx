'use client';

import { useState } from 'react';
import { useDisclosure } from '@nextui-org/react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { ConfirmDeleteLabel } from '../modals/ConfirmDeleteLabel';
import { Label } from '@/types';

interface Props {
	labels: Label[];
}

export const LabelsList: React.FC<Props> = ({ labels }) => {
	const [selectedLabel, setSelectedLabel] = useState('');
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

	if (!labels || labels.length === 0) return null;

	return (
		<>
			<ul className='flex flex-wrap gap-2 my-2'>
				{labels.map(label => (
					<li
						key={label.id}
						style={{
							backgroundColor: label.background_color,
							color: label.color,
						}}
						className='px-4 py-1 text-sm rounded-3xl flex items-center gap-2'>
						<p>{label.name}</p>
						<button
							type='button'
							onClick={e => {
								e.stopPropagation();
								setSelectedLabel(label.id);
								onOpen();
							}}>
							<AiOutlineCloseCircle className='text-lg' />
						</button>
					</li>
				))}
			</ul>
			<ConfirmDeleteLabel
				isOpen={isOpen}
				onChange={onOpenChange}
				onClose={onClose}
				labelId={selectedLabel}
			/>
		</>
	);
};
