type Props = {
	message?: string;
	size?: "sm" | "md" | "lg";
};

export function Loading({ message = "Loading...", size = "md" }: Props) {
	const sizeClass =
		size === "sm" ? "loading-sm" : size === "lg" ? "loading-lg" : "loading-md";

	return (
		<div className="flex items-center justify-center py-8">
			<div className="flex flex-col items-center">
				<div
					className={`btn btn-ghost btn-circle ${sizeClass} loading`}
					aria-hidden
				/>
				<span className="mt-2 text-sm opacity-70">{message}</span>
			</div>
		</div>
	);
}

export default Loading;
