'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button, Input } from '@nextui-org/react';
import { MdLabel } from 'react-icons/md';
import useUIStore from '@/store/uiStore';
import { Color, ListOfColors } from '../labels/ListOfColors';
import { LabelsList } from '../labels/LabelsList';
import { useOutsideAlerter } from '@/hooks';
import { classNames } from '@/utils';
import { labelsColors } from '@/constants';
import { Card } from '@/types';

interface Props {
	card: Card;
}

interface IFormValues {
	name: string;
	color?: string;
}

const getRandomColor = () => {
	const randomIndex = Math.floor(Math.random() * labelsColors.length);
	return labelsColors[randomIndex];
};

export const LabelsMenu: React.FC<Props> = ({ card }) => {
	const [selectedColor, setSelectedColor] = useState<Color>(getRandomColor());
	const { isLabelMenuOpen, setIsLabelMenuOpen } = useUIStore();
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<IFormValues>();
	const router = useRouter();
	const supabase = createClientComponentClient();

	const handleClose = () => {
		setIsLabelMenuOpen(false);
	};

	const wrapperRef = useRef<HTMLDivElement>(null);
	useOutsideAlerter(wrapperRef, handleClose);

	const onSubmit = async ({ name }: IFormValues) => {
		const { error } = await supabase.from('labels').insert({
			name,
			color: selectedColor.color,
			background_color: selectedColor.backgroundColor,
			card_id: card.id,
		});

		if (error) {
			console.error(error);
			toast.error(error.message);
			return;
		}
		reset();
		toast.success('Label added successfully');
		router.refresh();
	};

	return (
		<div
			ref={wrapperRef}
			className={classNames(
				'bg-white rounded-lg border border-[#E0E0E0] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.05)] p-2',
				'absolute top-[65px] left-0 z-[9999] w-[300px] min-h-[300px] transition-all !duration-300',
				'dark:bg-neutral-900 dark:border-[#4F4F4F] dark:shadow-[0px_2px_4px_0px_rgba(0,0,0,0.2)]',
				`${isLabelMenuOpen ? 'opacity-1 visible' : 'opacity-0 h-0 invisible'}`
			)}>
			<h6 className='font-semibold text-[#4F4F4F] dark:text-secondary-lts'>
				Label
			</h6>
			<p className='text-sm text-secondary dark:text-secondary-lt mb-2'>
				Select name and color
			</p>
			<form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
				<Input
					isClearable
					type='text'
					placeholder='Label...'
					variant='bordered'
					color={errors.name ? 'danger' : undefined}
					errorMessage={errors.name?.message}
					{...register('name', {
						required: 'This field is required',
						minLength: { value: 3, message: 'Minimum length is 3' },
						maxLength: { value: 20, message: 'Maximum length is 20' },
					})}
				/>

				<ListOfColors
					selectedColor={selectedColor}
					setSelectedColor={setSelectedColor}
				/>

				{/* List of labels */}
				{card.labels.length > 0 && (
					<>
						<div className='flex items-center gap-2 text-secondary text-sm'>
							<MdLabel />
							<p>Available</p>
						</div>
						<LabelsList labels={card.labels} />
					</>
				)}

				<div className='flex justify-center my-6'>
					<Button isDisabled={isSubmitting} color='primary' type='submit'>
						Add
					</Button>
				</div>
			</form>
		</div>
	);
};
