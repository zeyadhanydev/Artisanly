import { Logo } from "./logo";
import { SidebarRoutes } from "./sidebar-routes";

export const Sidebar = () => {
	return (
		<aside className="hidden fixed lg:flex flex-col w-[300px] left-0 shrink-0 h-full">
			<Logo />
			<SidebarRoutes />
		</aside>
	);
};
