import type { Config } from 'tailwindcss';
import { nextui } from '@nextui-org/react';

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
		'./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
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
				tertiary: '#333333',
			},
		},
	},
	darkMode: 'class',
	plugins: [nextui()],
};
export default config;
