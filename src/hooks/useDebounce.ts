import { useState, useEffect } from 'react';

export function useDebounce(value: string, delay: number) {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		// Set a timer to update the debounced value after a specified delay
		const debounceTimer = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		// Clear the timer if the value changes before the delay time
		return () => {
			clearTimeout(debounceTimer);
		};
	}, [value, delay]);

	return debouncedValue;
}
