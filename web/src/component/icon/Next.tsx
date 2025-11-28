// https://heroicons.com/
// chevron-right

type Props = {
	alt: string;
	className?: string;
};

export const Next = ({ alt, className }: Props) => (
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
			d="m8.25 4.5 7.5 7.5-7.5 7.5"
		/>
	</svg>
);
