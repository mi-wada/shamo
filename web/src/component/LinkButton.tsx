import { Link } from "react-router";

type Props = {
	to: string;
	disabled?: boolean;
	children: React.ReactNode;
	className?: string;
};

export const LinkButton = ({
	to,
	disabled,
	children,
	className = "",
}: Props) => {
	const baseClasses = "btn btn-outline w-full";
	const stateClasses = disabled
		? "btn-disabled pointer-events-none"
		: "btn-primary";
	const combinedClasses = `${baseClasses} ${stateClasses} ${className}`.trim();

	if (disabled) {
		return (
			<button type="button" disabled className={combinedClasses}>
				{children}
			</button>
		);
	}

	return (
		<Link to={to} className={combinedClasses}>
			{children}
		</Link>
	);
};
