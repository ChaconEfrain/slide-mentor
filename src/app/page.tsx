import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, SignOutButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-outfit">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <SignedOut>
          <Button asChild>
            <SignInButton>
              Iniciar sesión
            </SignInButton>
          </Button>
        </SignedOut>
        <SignedIn>
          <Button asChild>
            <SignOutButton>
              Cerrar sesión
            </SignOutButton>
          </Button>
        </SignedIn>
      </main>
    </div>
  );
}
