/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'btn-primary': 'linear-gradient(39deg, rgba(254,207,89,1), rgba(255,241,204,1))',
            },
            fontSize: {
                'base': '13px',
            },
            radius: {
                'base': '4px',
            },
        },
    },
    plugins: [],
}