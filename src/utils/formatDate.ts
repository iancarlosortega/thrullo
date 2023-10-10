export const formatDate = (date: string) => {
	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	};
	const formatter = new Intl.DateTimeFormat('en-US', options);
	const formatted = formatter.formatToParts(new Date(date));
	return `on ${formatted[2].value} ${formatted[0].value}, ${formatted[4].value}`;
};
