"use client";
import { Loader, LogOut } from "lucide-react";
import { useSession } from "next-auth/react";
import { BsCreditCard } from "react-icons/bs";
import { IoLogOut } from "react-icons/io5";
import { signOut } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export const UserButton = () => {
	const session = useSession();
	if (session.status === "loading") {
		return <Loader className="size-4 animate-spin text-muted-foreground" />;
	}
	if (session.status === "unauthenticated" || !session.data) {
		return null;
	}
	const name = session.data.user.name!;
	const imageUrl = session.data.user.image!;
	return (
		<div>
			{/*		// TODO: add crown if uer is premium */}
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger>
					<Avatar className="size-10 hover:opacity-75 transition">
						<AvatarImage alt="name" src={imageUrl || ""} />
						<AvatarFallback
							className="bg-blue-500 font-medium text-white
						"
						>
							{name.charAt(0).toUpperCase()}
						</AvatarFallback>
					</Avatar>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-60">
					<DropdownMenuItem
						className="h-10"
						onClick={() => {}}
						disabled={false}
					>
						<BsCreditCard className="size-4 mr-2" />
						Billing
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="h-10"
						onClick={() => {
							signOut();
						}}
					>
						<LogOut className="size-4 mr-2"></LogOut>
						Log out
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};
