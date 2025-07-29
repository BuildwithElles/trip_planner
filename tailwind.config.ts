import type { Config } from "tailwindcss";
import { designTokens } from "./src/styles/design-tokens";

export default {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    // Set base font size to 14px as per TripTogether design system
    fontSize: designTokens.typography.fontSize,
    fontFamily: designTokens.typography.fontFamily,
    fontWeight: designTokens.typography.fontWeight,
    
    container: {
      center: true,
      padding: "2rem", 
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // TripTogether Brand Colors
      colors: {
        // Primary brand colors
        primary: designTokens.colors.primary,
        secondary: designTokens.colors.secondary,
        accent: designTokens.colors.accent,
        
        // Semantic colors
        success: designTokens.colors.semantic.success,
        info: designTokens.colors.semantic.info,
        warning: designTokens.colors.semantic.warning,
        
        // Neutral colors with proper naming
        neutral: designTokens.colors.neutral,
        
        // Custom colors for TripTogether
        'input-background': designTokens.colors.neutral[100], // bg-gray-100 for borderless inputs
        
        // Existing border and background colors maintained for compatibility
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      
      // TripTogether Spacing System
      spacing: {
        'trip-xs': designTokens.spacing.xs,
        'trip-sm': designTokens.spacing.sm,
        'trip-md': designTokens.spacing.md,
        'trip-lg': designTokens.spacing.lg,
        'trip-xl': designTokens.spacing.xl,
      },
      
      // TripTogether Height System
      height: {
        'button': designTokens.height.button,      // h-button (48px)
        'button-lg': designTokens.height['button-lg'], // h-button-lg (56px)
        'input': designTokens.height.input,        // h-input (48px)
      },
      
      // TripTogether Border Radius System
      borderRadius: {
        ...designTokens.borderRadius,
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      
      // TripTogether Shadow System
      boxShadow: {
        'trip-lg': designTokens.shadows.lg,
      },
      
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config; 