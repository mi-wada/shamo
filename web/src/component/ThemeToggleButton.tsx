import { useTheme } from "../ThemeProvider";
import { Moon } from "./icon/Moon";
import { Sun } from "./icon/Sun";

export const ThemeToggleButton = () => {
	const { theme, toggleTheme } = useTheme();
	const isDark = theme === "dark";

	return (
		<button
			type="button"
			className="btn btn-ghost btn-circle"
			onClick={toggleTheme}
			aria-label="Toggle color theme"
			aria-pressed={isDark}
		>
			<span className="sr-only">Toggle color theme</span>
			{isDark ? (
				<Moon alt="Dark mode" className="size-5" />
			) : (
				<Sun alt="Light mode" className="size-5" />
			)}
		</button>
	);
};
