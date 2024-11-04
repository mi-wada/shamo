type Props = {
	href?: string;
	disabled?: boolean;
	children: React.ReactNode;
};

export const LinkButton = ({ href, disabled, children }: Props) => {
	const commonClasses = `btn btn-outline w-full ${
		disabled ? "btn-disabled pointer-events-none" : "btn-primary"
	}`;

	return (
		<a
			href={disabled ? undefined : href}
			className={commonClasses}
			aria-disabled={disabled}
		>
			{children}
		</a>
	);
};
