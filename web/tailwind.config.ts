import daisyui from "daisyui";
import type { Config } from "tailwindcss";

export default {
	content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				danger: "#f56565",
			},
			fontSize: {
				h1: "1.75rem",
				h2: "1.5rem",
			},
		},
	},
	plugins: [daisyui],
} satisfies Config;
