import BackgroundMeteors from "@/components/backgroundmeteors";

interface AuthLayoutProps {
	children: React.ReactNode;
}
export default function AuthLayout({ children }: AuthLayoutProps) {
	return (
		<BackgroundMeteors>
			<div className="h-full w-full md:h-auto md:w-[420px] flex items-center justify-center">
				{children}
			</div>
		</BackgroundMeteors>
	);
}
