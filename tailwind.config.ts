import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				'light-gray': '#F8F9FD',
				dark: '#333333',
				primary: '#2F80ED',
				'primary-lt': '#DAE4FD',
				secondary: '#828282',
				'secondary-lt': '#BDBDBD',
				'secondary-lts': '#F2F2F2',
			},
		},
	},
	plugins: [],
};
export default config;
