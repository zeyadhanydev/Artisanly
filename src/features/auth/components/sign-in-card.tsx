"use client";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export const SignInCard = () => {
	const onProviderSignIn = (provider: "github" | "google") => {
		signIn(provider, { callbackUrl: "/" });
	};
	return (
		<Card className="w-full p-8">
			<CardHeader className="px-0 pt-0 ">
				<CardTitle>Login to continue</CardTitle>
				<CardDescription>
					Use your email or another service to continue
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-5 px-0 pb-0">
				<div className="gap-y-2.5 flex flex-col">
					<Button
						onClick={() => onProviderSignIn("google")}
						variant={"outline"}
						size={"lg"}
						className="w-full relative cursor-pointer"
					>
						<FcGoogle className="mr-2 size-5 top-2.5 left-2.5 absolute"></FcGoogle>
						Continue with Google
					</Button>
					<Button
						onClick={() => onProviderSignIn("github")}
						variant={"outline"}
						size={"lg"}
						className="w-full relative cursor-pointer"
					>
						<FaGithub className="mr-2 size-5 top-2.5 left-2.5 absolute"></FaGithub>
						Continue with Github
					</Button>
				</div>
				<p className="text-xs text-muted-foreground">
					Don&apos;t have an account?{" "}
					<Link href={"/sign-up"}>
						<span className="text-sky-700 hover:underline">Sign up</span>
					</Link>
				</p>
			</CardContent>
		</Card>
	);
};
