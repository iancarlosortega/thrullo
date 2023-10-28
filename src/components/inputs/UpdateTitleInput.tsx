import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useOutsideAlerter } from '@/hooks';
import { classNames } from '@/utils';

interface IFormValues {
	title: string;
}

interface Props {
	title: string;
	onSubmit: (title: string) => void;
	fullWidth?: boolean;
	canEdit?: boolean;
}

export const UpdateTitleInput: React.FC<Props> = ({
	title,
	onSubmit,
	fullWidth = false,
	canEdit = false,
}) => {
	const [isEdittingMode, setIsEdittingMode] = useState(false);

	const {
		register,
		handleSubmit,
		getValues,
		formState: { errors, isValid },
	} = useForm<IFormValues>({
		defaultValues: {
			title,
		},
	});

	const handleValidateForm = (data: IFormValues) => {
		onSubmit(data.title);
		setIsEdittingMode(false);
	};

	const handleClose = () => {
		if (!isValid) return;
		handleSubmit(handleValidateForm)();
	};

	const wrapperRef = useRef<HTMLFormElement>(null);
	useOutsideAlerter(wrapperRef, handleClose);

	return (
		<>
			{isEdittingMode ? (
				<form ref={wrapperRef} onSubmit={handleSubmit(handleValidateForm)}>
					<input
						autoFocus
						type='text'
						placeholder='Enter a title...'
						className={classNames(
							'font-medium text-lg text-tertiary dark:text-gray-200',
							'bg-transparent outline-none caret-primary dark:caret-primary-lt',
							'placeholder:text-secondary dark:placeholder:text-secondary-lt',
							`${fullWidth ? 'w-full' : 'w-[300px]'}`,
							`${
								errors.title &&
								'border-b border-red-500 dark:placeholder:text-red-300 placeholder:!text-red-500 caret-red-500 dark:caret-red-500'
							}`
						)}
						{...register('title', {
							required: 'Cannot be empty',
							maxLength: {
								value: 80,
								message: 'Max 80 characters',
							},
							minLength: {
								value: 3,
								message: '3 characters at least',
							},
						})}
					/>
				</form>
			) : (
				<h2
					title={title}
					onClick={() => {
						if (!canEdit) return;
						setIsEdittingMode(true);
					}}
					className={`${
						fullWidth ? 'w-full' : 'w-[300px]'
					} font-medium text-lg text-tertiary dark:text-gray-200 w-[300px] truncate`}>
					{getValues('title') || title}
				</h2>
			)}
		</>
	);
};
