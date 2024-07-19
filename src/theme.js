// src/theme.js
import { extendTheme } from "@chakra-ui/react";

const colors = {
  gray: {
    50: "#f7fafc",
    100: "#edf2f7",
    200: "#e2e8f0",
    300: "#cbd5e0",
    400: "#a0aec0",
    500: "#718096",
    600: "#4a5568",
    700: "#2d3748",
    800: "#1a202c",
    900: "#171923",
  },
  teal: {
    50: "#e6fffa",
    100: "#b2f5ea",
    200: "#81e6d9",
    300: "#4fd1c5",
    400: "#38b2ac",
    500: "#319795",
    600: "#2c7a7b",
    700: "#285e61",
    800: "#234e52",
    900: "#1d4044",
  },
  blue: {
    50: "#ebf8ff",
    100: "#bee3f8",
    200: "#90cdf4",
    300: "#63b3ed",
    400: "#4299e1",
    500: "#3182ce",
    600: "#2b6cb0",
    700: "#2c5282",
    800: "#2a4365",
    900: "#1a365d",
  },
  primary: {
    100: "#E3F2F9",
    200: "#C5E4F3",
    300: "#A2D4EC",
    400: "#7AC1E4",
    500: "#47A9DA",
    600: "#0088CC",
    700: "#007AB8",
    800: "#006BA1",
    900: "#005885",
  },
};

const theme = extendTheme({
  colors,
  fonts: {
    heading: "Poppins, sans-serif",
    body: "Poppins, sans-serif",
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "bold",
        borderRadius: "lg",
      },
      variants: {
        solid: (props) => ({
          bg: props.colorMode === "dark" ? "blue.500" : "blue.500",
          color: "white",
          _hover: {
            bg: props.colorMode === "dark" ? "blue.600" : "blue.600",
          },
        }),
        ghost: {
          color: "inherit",
          _hover: {
            bg: "whiteAlpha.200",
          },
        },
      },
    },
    Table: {
      variants: {
        simple: {
          th: {
            borderBottom: "1px",
            borderColor: "gray.200",
            padding: "1rem",
            textTransform: "capitalize",
            fontWeight: "bold",
            letterSpacing: "wider",
          },
          td: {
            borderBottom: "1px",
            borderColor: "gray.200",
            padding: "1rem",
          },
        },
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: "bold",
      },
      sizes: {
        h1: {
          fontSize: ["2xl", "3xl", "4xl"],
          lineHeight: 1.2,
        },
        h2: {
          fontSize: ["xl", "2xl", "3xl"],
          lineHeight: 1.2,
        },
        h3: {
          fontSize: ["lg", "xl", "2xl"],
          lineHeight: 1.3,
        },
        h4: {
          fontSize: ["md", "lg", "xl"],
          lineHeight: 1.4,
        },
        h5: {
          fontSize: ["sm", "md", "lg"],
          lineHeight: 1.5,
        },
        h6: {
          fontSize: ["xs", "sm", "md"],
          lineHeight: 1.6,
        },
      },
    },
    Text: {
      variants: {
        body1: {
          fontSize: ["md", "lg"],
          lineHeight: 1.5,
        },
        body2: {
          fontSize: ["sm", "md"],
          lineHeight: 1.5,
        },
        caption: {
          fontSize: "sm",
          lineHeight: 1.5,
        },
      },
    },
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === "dark" ? "gray.800" : "gray.100",
        color: props.colorMode === "dark" ? "white" : "gray.800",
      },
    }),
  },
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
});


console.log('Theme Heading sizes:', theme.components?.Heading?.sizes);

export default theme;