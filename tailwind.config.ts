import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './pages/*/*.{html,ts,tsx,js,jsx}',
        './components/*/*.{html,ts,tsx,js,jsx}'
    ],
    theme: {
        extend: {
            fontSize: {
                'xxs': '0.625rem', // 10px
            },
            screens: {
                xs: '400px'
            }
        },
    },
    plugins: [],
};

export default config;