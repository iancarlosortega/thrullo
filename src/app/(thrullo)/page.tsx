'use client';

import { useEffect, useState } from 'react';
import { Button, useDisclosure } from '@nextui-org/react';
import { AiOutlinePlus } from 'react-icons/ai';
import { AddNewBoard, BoardList } from '@/components';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function HomePage() {
	const [isLoading, setIsLoading] = useState(true);
	const [boards, setBoards] = useState([]);
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
	const supabase = createClientComponentClient();

	useEffect(() => {
		const fetchPosts = async () => {
			const { data } = await supabase.from('boards').select();
			setBoards(data as any);
			setIsLoading(false);
		};

		fetchPosts();
	}, []);

	return (
		<>
			<div className='flex justify-between my-4'>
				<h3 className='text-lg font-medium'>All Boards</h3>
				<Button
					className='bg-primary text-white'
					startContent={<AiOutlinePlus />}
					onPress={onOpen}>
					Add
				</Button>
			</div>

			<section>
				<BoardList boards={boards} />
			</section>

			<AddNewBoard isOpen={isOpen} onChange={onOpenChange} onClose={onClose} />
		</>
	);
}
