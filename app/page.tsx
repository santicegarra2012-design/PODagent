import { auth } from "@clerk/nextjs/server";
import { UserButton, SignInButton } from "@clerk/nextjs";

export default async function Home() {
  const { userId } = await auth();

  return (
    <main className="p-10">
      {!userId ? (
        <SignInButton />
      ) : (
        <div className="flex items-center gap-4">
          <UserButton />

          <h1 className="text-3xl font-bold">
            POD Agent Dashboard
          </h1>
        </div>
      )}
    </main>
  );
}