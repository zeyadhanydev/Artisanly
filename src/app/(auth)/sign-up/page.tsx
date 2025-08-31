import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SignUpCard } from "@/features/auth/components/sign-up-card";
import AuthLayout from "../layout";

const SignUpPage = async () => {
	const session = await auth();
	if (session) {
		redirect("/");
	}
	return (
		<AuthLayout>
			<SignUpCard />
		</AuthLayout>
	);
};

export default SignUpPage;
