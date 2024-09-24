"use client";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { useSession } from "next-auth/react";
export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "authenticated") {
    router.push("/dashboard");
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <h1 className="text-4xl font-bold mb-4">Welcome to Budget Tracker</h1>
    </div>
  );
}
