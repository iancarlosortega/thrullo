import { classNames } from '@/utils';
import { AiOutlinePlus } from 'react-icons/ai';

export const AddCardButton = () => {
	return (
		<button
			className={classNames(
				'bg-[#DAE4FD] px-4 py-3 my-4 flex justify-between items-center',
				'rounded-2xl text-primary text-sm w-[300px] font-medium',
				'hover:bg-[#E1E7FD] transition-all duration-200'
			)}>
			Add another card
			<AiOutlinePlus className='text-2xl' />
		</button>
	);
};
