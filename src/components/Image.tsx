interface ImageProps {
	src: string;
	width: string | number;
	alt: string;
	className: string;
}

const WIDTHS = [400, 800, 1200, 1600, 2000];

const Image = ({ src, width, alt, className }: ImageProps) => {
	const optimizedPath = (w: number) =>
		`/api/image?src=${encodeURIComponent(src.slice(1))}&w=${w}`;

	const requestedWidth = Number(width);
	const sizes = [
		...WIDTHS.filter((w) => w < requestedWidth).map(
			(w) => `(max-width: ${w}px) ${w}px`,
		),
		`${requestedWidth}px`,
	].join(", ");

	return (
		<img
			decoding="async"
			fetchPriority="high"
			alt={alt}
			className={className}
			sizes={sizes}
			src={`${optimizedPath(requestedWidth)}`}
			srcSet={WIDTHS.map((w) => `${optimizedPath(w)} ${w}w`).join(", ")}
		/>
	);
};

export default Image;
