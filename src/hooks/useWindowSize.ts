import { useEffect, useState } from "react";

interface Dimensions {
	width: number;
	height: number;
}

interface UseWindowSizeProps {
	onChange?: (dimensions: Dimensions) => void;
}

const isBrowser = typeof window !== "undefined";

export function useWindowSize({ onChange }: UseWindowSizeProps = {}) {
	const [dimensions, setDimensions] = useState<Dimensions>(() => {
		if (isBrowser) {
			return { width: window.innerWidth, height: window.innerHeight };
		}

		return { width: 0, height: 0 };
	});

	useEffect(() => {
		if (isBrowser) {
			function handleResize() {
				const dim = { width: window.innerWidth, height: window.innerHeight };
				setDimensions(dim);

				if (onChange) {
					onChange(dim);
				}
			}

			window.addEventListener("resize", handleResize);

			return () => {
				window.removeEventListener("resize", handleResize);
			};
		}
	}, [onChange]);

	return dimensions;
}
