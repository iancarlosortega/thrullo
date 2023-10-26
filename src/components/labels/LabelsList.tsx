import { Label } from '@/types';

interface Props {
	labels: Label[];
}

export const LabelsList: React.FC<Props> = ({ labels }) => {
	if (!labels || labels.length === 0) return null;

	return (
		<ul className='flex flex-wrap gap-2 my-2'>
			{labels.map(label => (
				<li
					key={label.id}
					style={{
						backgroundColor: label.background_color,
						color: label.color,
					}}
					className='px-4 py-1 text-sm rounded-3xl'>
					{label.name}
				</li>
			))}
		</ul>
	);
};
