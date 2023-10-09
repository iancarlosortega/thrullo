interface Props {
	fullName: string;
}

export const NoProfilePhoto: React.FC<Props> = ({ fullName }) => {
	const split = fullName.split(' ');
	const firstLetter = split[0].charAt(0);
	const secondLetter = split[1]?.charAt(0);

	return (
		<div className='flex justify-center items-center h-10 w-10 rounded-lg bg-secondary-lt text-white font-medium'>
			<span>{firstLetter}</span>
			<span>{secondLetter}</span>
		</div>
	);
};
