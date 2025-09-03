"use client";
import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useSignUp } from "../hooks/use-sign-up";

export const SignUpCard = () => {
	const mutation = useSignUp();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const onCredentialsSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		mutation.mutate(
			{
				name,
				email,
				password,
			},
			{
				onSuccess: () => {
					signIn("credentials", { email, password, callbackUrl: "/" });
					console.log("registered");
				},
			},
		);
	};

	const onProviderSignUp = (provider: "github" | "google") => {
		signIn(provider, { callbackUrl: "/" });
	};
	return (
		<Card className="w-full p-8 ">
			<CardHeader className="px-0 pt-0 ">
				<CardTitle>Create an account</CardTitle>
				<CardDescription>
					Use your email or another service to continue
				</CardDescription>
			</CardHeader>
			{
				// turn error to boolean
				!!mutation.error && (
					<div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
						<TriangleAlert className="size-4" />
						<p>Invalid email or password</p>
					</div>
				)
			}

			<CardContent className="space-y-5 px-0 pb-0">
				<form onSubmit={onCredentialsSignUp} className="space-y-2.5 ">
					<Input
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Full Name"
						type="text"
						required
						disabled={mutation.isPending}
					></Input>
					<Input
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Email"
						type="email"
						required
						disabled={mutation.isPending}
					></Input>
					<Input
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Password"
						type="password"
						minLength={6}
						required
						disabled={mutation.isPending}
					></Input>
					<Button
						type="submit"
						className="w-full"
						size={"lg"}
						disabled={mutation.isPending}
					>
						Continue
					</Button>
				</form>
				<Separator />
				<div className="gap-y-2.5 flex flex-col">
					<Button
						onClick={() => onProviderSignUp("google")}
						variant={"outline"}
						size={"lg"}
						className="w-full relative"
					>
						<FcGoogle className="mr-2 size-5 top-2.5 left-2.5 absolute"></FcGoogle>
						Continue with Google
					</Button>
					<Button
						onClick={() => onProviderSignUp("github")}
						variant={"outline"}
						size={"lg"}
						className="w-full relative"
					>
						<FaGithub className="mr-2 size-5 top-2.5 left-2.5 absolute"></FaGithub>
						Continue with Github
					</Button>
				</div>
				<p className="text-xs text-muted-foreground">
					Already have an account?{" "}
					<Link href={"/sign-in"}>
						<span className="text-sky-700 hover:underline">Sign in</span>
					</Link>
				</p>
			</CardContent>
		</Card>
	);
};
