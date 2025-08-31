import { redirect } from "next/navigation";
import { auth } from "@/auth";

const SignInPage = async () => {
	const session = await auth();
	if (session) {
		redirect("/");
	}
	return <div>Sign In Page</div>;
};

export default SignInPage;
