import {
	createContext,
	type ReactNode,
	useContext,
	useMemo,
	useState,
} from "react";

const THEME_STORAGE_KEY = "shamo-theme";

export type Theme = "light" | "dark";

interface ThemeContextValue {
	theme: Theme;
	toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const readInitialTheme = (): Theme => {
	if (typeof window === "undefined") {
		return "light";
	}

	const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
	if (stored === "light" || stored === "dark") {
		return stored;
	}

	if (typeof window.matchMedia === "function") {
		return window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";
	}

	return "light";
};

const applyTheme = (nextTheme: Theme) => {
	if (typeof document === "undefined") {
		return;
	}

	document.documentElement.setAttribute("data-theme", nextTheme);
	document.documentElement.classList.toggle("dark", nextTheme === "dark");
};

const persistTheme = (nextTheme: Theme) => {
	if (typeof window === "undefined") {
		return;
	}

	window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const [theme, setTheme] = useState<Theme>(() => {
		const initialTheme = readInitialTheme();
		applyTheme(initialTheme);
		return initialTheme;
	});

	const value = useMemo<ThemeContextValue>(
		() => ({
			theme,
			toggleTheme: () => {
				setTheme((current) => {
					const nextTheme: Theme = current === "light" ? "dark" : "light";
					applyTheme(nextTheme);
					persistTheme(nextTheme);
					return nextTheme;
				});
			},
		}),
		[theme],
	);

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
};

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within ThemeProvider");
	}

	return context;
};
