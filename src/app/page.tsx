import { auth } from "@/auth";
import { Button } from "@/components/ui/button";

export default async function Home() {
	const session = await auth();

	return <div>{JSON.stringify(session)}</div>;
}
