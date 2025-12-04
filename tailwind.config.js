import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import flowbiteReact from "flowbite-react/plugin/tailwindcss";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
        ".flowbite-react/class-list.json"
    ],

    theme: {
        extend: {
            colors: {
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',

                card: 'hsl(var(--card))',
                'card-foreground': 'hsl(var(--card-foreground))',

                popover: 'hsl(var(--popover))',
                'popover-foreground': 'hsl(var(--popover-foreground))',

                primary: 'hsl(var(--primary))',
                'primary-foreground': 'hsl(var(--primary-foreground))',

                secondary: 'hsl(var(--secondary))',
                'secondary-foreground': 'hsl(var(--secondary-foreground))',

                muted: 'hsl(var(--muted))',
                'muted-foreground': 'hsl(var(--muted-foreground))',

                accent: 'hsl(var(--accent))',
                'accent-foreground': 'hsl(var(--accent-foreground))',

                destructive: 'hsl(var(--destructive))',
                'destructive-foreground': 'hsl(var(--destructive-foreground))',

                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',

                gold: 'hsl(var(--gold))',
                silver: 'hsl(var(--silver))',
                bronze: 'hsl(var(--bronze))',
                'cyan-glow': 'hsl(var(--cyan-glow))',

                'sidebar-background': 'hsl(var(--sidebar-background))',
                'sidebar-foreground': 'hsl(var(--sidebar-foreground))',
                'sidebar-primary': 'hsl(var(--sidebar-primary))',
                'sidebar-primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
                'sidebar-accent': 'hsl(var(--sidebar-accent))',
                'sidebar-accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
                'sidebar-border': 'hsl(var(--sidebar-border))',
                'sidebar-ring': 'hsl(var(--sidebar-ring))',
            },
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
        },
        screens: {
            'hd': '1366px', // >= 1366px
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
        }
    },

    plugins: [forms, flowbiteReact],
};