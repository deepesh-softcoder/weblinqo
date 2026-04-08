module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Make sure it includes your source folder
  ],
  theme: {
    extend: {
      animation: {
        scrollText: 'scrollText 15s linear infinite',
      },
      keyframes: {
        scrollText: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      },
      backgroundImage: {
        'smart-link-gradient': `linear-gradient(
          175deg,
          #d5daf3 0%,
          rgba(245, 243, 240, 0.75) 56%,
          #2848f0 65%,
          rgba(245, 243, 240, 0.75) 98%,
          #d5daf3 100%
        )`,

        'angular-gradient': 'conic-gradient(#9bb6cfff 0%, #a4accdff 25%, #b2bdc9ff 40%, #a4afe1ff 65%, #b2bdc9ff 80%, #9bb6cfff 100%)',
        'dc-template-two-radial-gradient': 'radial-gradient(circle, #F5F3F0 0%, #4ADE71 100%)',
        // 'dc-template-two-conic-gradient': 'conic-gradient(#3CC272, #D9D9D9)',
        'dc-template-two-conic-gradient': 'linear-gradient(135deg, #b6e2c8 0%, #f2f2f2 100%)',
        'dc-template-three-linear-gradient': 'linear-gradient(to bottom, #dbe9f4 0%, #3b80c4 100%)',


        'template-gradient': `linear-gradient(
          160deg,
          #F5F3F0 0%,
          #F5F3F0 15%,
          #7A8BE0 30%,
          #2848f0 60%,
          #F5F3F0 85%,
          #F5F3F0 100%
        )`,
        'template-one-gradient': `linear-gradient(
          180deg,
          #5F7F98 0%,
          #053C58 100%
        )`,
        'dg-template-graient': `linear-gradient(
          160deg,
          rgba(255, 214, 4, 1) 0%,
          rgba(248, 111, 30, 0.95) 15%,
          rgba(248, 111, 30, 1) 30%,
          rgba(252, 42, 113, 1) 60%,
          rgba(151, 66, 255, 1) 85%,
          rgba(52, 181, 213, 0.6) 100%
        )`
      },
      fontFamily: {
        pier: ['"Pier Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#2848F0',
        secondary: '#0D569A',
        logoGolden: '#C7AE6AEA',
        charCoalBlack: '#232323',
        offWhite: '#F5F3F0',
        brown: '#9B6D5B',
        coral: {
          500: '#ff6b6b',
          600: '#ff5252'
        }
      },
      fontSize: {
        'size-10': '0.625rem',
        'size-12': '0.75rem',
        'size-14': '0.875rem',
        'size-16': '1rem',
        'size-18': '1.125rem',
        'size-20': '1.25rem',
        'size-24': '1.5rem',
        'size-28': '1.75rem',
        'size-30': '1.875rem',
        'size-32': '2rem',
        'size-40': '2.5rem',
        'size-48': '3rem',
        'size-56': '3.5rem',
        'size-64': '4rem',
        'size-72': '4.5rem',
        'size-80': '5rem',
      },
    },
  },
  plugins: [],
}
