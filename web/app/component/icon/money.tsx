// https://heroicons.com/
// currency-yen

type Props = {
	alt: string;
	className?: string;
};

export const Money = ({ alt, className }: Props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={1.5}
		stroke="currentColor"
		className={className}
	>
		<title>{alt}</title>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="m9 7.5 3 4.5m0 0 3-4.5M12 12v5.25M15 12H9m6 3H9m12-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
		/>
	</svg>
);
