import { createTheme } from "@mui/material";

const customTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#0C831F', // Blinkit Brand Green
        },
        secondary: {
            main: '#F8CB46', // Blinkit Brand Yellow
        },
        text: {
            primary: '#000000',
            secondary: '#666666'
        },
        background: {
            default: '#F8F8F8',
            paper: '#FFFFFF'
        }
    },
    typography: {
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        button: {
            textTransform: "none", // Blinkit buttons are rarely all-caps
            fontWeight: 600
        }
    },
    shape: {
        borderRadius: 8 // Soft rounded corners like Blinkit cards
    }
})

export default customTheme;