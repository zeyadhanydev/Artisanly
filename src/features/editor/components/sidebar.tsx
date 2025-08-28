"use client";
import {
	Image,
	LayoutTemplate,
	Pencil,
	Settings,
	Shapes,
	Sparkles,
	Type,
} from "lucide-react";
import React from "react";
import { SidebarItem } from "@/features/editor/components/sidebar-item";
import type { ActiveTool } from "@/features/editor/types";

interface SidebarProps {
	activeTool: ActiveTool;
	onChangeActiveTool: (tool: ActiveTool) => void;
}

export const Sidebar = ({ activeTool, onChangeActiveTool }: SidebarProps) => {
	return (
		<aside className="bg-white flex flex-col h-full w-[100px] border-r overflow-y-auto">
			<ul className="flex flex-col ">
				<SidebarItem
					icon={LayoutTemplate}
					label="Design"
					isActive={activeTool === "templates"}
					onClick={() => onChangeActiveTool("templates")}
				/>
				<SidebarItem
					icon={Image}
					label="Image"
					isActive={activeTool === "images"}
					onClick={() => onChangeActiveTool("images")}
				/>
				<SidebarItem
					icon={Type}
					label="Type"
					isActive={activeTool === "text"}
					onClick={() => onChangeActiveTool("text")}
				/>
				<SidebarItem
					icon={Shapes}
					label="Shapes"
					isActive={activeTool === "shapes"}
					onClick={() => onChangeActiveTool("shapes")}
				/>
				<SidebarItem
					icon={Pencil}
					label="Draw"
					isActive={activeTool === "draw"}
					onClick={() => onChangeActiveTool("draw")}
				/>
				<SidebarItem
					icon={Sparkles}
					label="Sparkles"
					isActive={activeTool === "ai"}
					onClick={() => onChangeActiveTool("ai")}
				/>
				<SidebarItem
					icon={Settings}
					label="Settings"
					isActive={activeTool === "settings"}
					onClick={() => onChangeActiveTool("settings")}
				/>

			</ul>
		</aside>
	);
};
