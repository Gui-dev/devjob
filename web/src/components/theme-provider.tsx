"use client";

import type { ComponentProps } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export const ThemeProvider = ({
	children,
	...props
}: ComponentProps<typeof NextThemesProvider>) => {
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
};
