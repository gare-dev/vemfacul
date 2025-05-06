import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './pages/*/*.{html,ts,tsx,js,jsx}',
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};

export default config;