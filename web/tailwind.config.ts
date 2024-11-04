import type { Config } from "tailwindcss";
import daisyui from "daisyui";

export default {
	content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				danger: "#f56565",
			},
			fontSize: {
				h1: "2rem",
				h2: "1.5rem",
			},
		},
	},
	plugins: [daisyui],
} satisfies Config;
