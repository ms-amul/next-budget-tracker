"use client";
import { Spin } from "antd";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="flex flex-col h-screen w-full fixed items-center justify-center gap-3">
        <Spin size="large" />
        <p className="text-lg font-semibold text-gray-600">
          Loading your data!
        </p>
      </div>
    );
  }

  if (status === "authenticated") {
    router.push("/dashboard");
    return null;
  }

  return (
    <section className="flex items-center flex-col p-3 select-none pointer-events-none">
      <div className="flex flex-col text-left home">
        <h1 className="text-4xl font-semibold">
          <span className="gradient-text-red font-bold">
            Servify: Manage your Money with AI-Driven Personal
          </span>
          <br />
          <span className="text-6xl md:text-8xl text-blue-800 font-extrabold mt-1 leading-none">
            Finance Manager
          </span>
        </h1>
        <Image
          src="/website.png"
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full mt-10 mix-blend-multiply"
        />
      </div>
    </section>
  );
}
