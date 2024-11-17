// https://heroicons.com/
// chevron-left

type Props = {
	alt: string;
	className?: string;
};

export const Previous = ({ alt, className }: Props) => (
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
			d="M15.75 19.5 8.25 12l7.5-7.5"
		/>
	</svg>
);
