import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Galadriel",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html lang="en">
			<body>
				<main className="page">{children}</main>
			</body>
		</html>
	);
}
