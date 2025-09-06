import { HexagonBackground } from "@/components/ui/shadcn-io/hexagon-background";

interface AuthLayoutProps {
	children: React.ReactNode;
}
export default function AuthLayout({ children }: AuthLayoutProps) {
	return (
		<div className="relative flex h-screen w-full items-center justify-center">
			<HexagonBackground className="absolute inset-0 -z-10" />
			<div className="z-10 h-full w-full p-4 md:h-auto md:w-[420px] md:p-0">
				{children}
			</div>
		</div>
	);
}
