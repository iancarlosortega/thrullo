'use client';

import { labelsColors } from '@/constants';
import { classNames } from '@/utils';
import { AiOutlineCheck } from 'react-icons/ai';

export interface Color {
	id: number;
	name: string;
	color: string;
	backgroundColor: string;
}

interface Props {
	selectedColor: Color;
	setSelectedColor: (color: Color) => void;
}

export const ListOfColors: React.FC<Props> = ({
	selectedColor,
	setSelectedColor,
}) => {
	const handleChangeColor = (color: Color) => {
		setSelectedColor(color);
	};

	return (
		<ul className='grid grid-cols-4 gap-2 my-4'>
			{labelsColors.map((color, index) => (
				<li
					key={index}
					onClick={() => handleChangeColor(color)}
					style={{
						backgroundColor: color.color,
						color: color.backgroundColor,
					}}
					className={classNames(
						'w-full h-[30px] rounded-lg',
						'flex items-center justify-center'
					)}>
					{selectedColor.color === color.color && <AiOutlineCheck />}
				</li>
			))}
		</ul>
	);
};
