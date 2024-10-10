"use client";
import { Spin } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaPiggyBank, FaChartLine, FaUserShield } from "react-icons/fa";
import Image from "next/image";

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="flex flex-col h-screen w-full fixed items-center justify-center gap-3 bg-gray-100">
        <Spin size="large" />
        <p className="text-lg font-semibold text-gray-600">Loading your data!</p>
      </div>
    );
  }

  if (status === "authenticated") {
    router.push("/dashboard");
    return null;
  }

  return (
    <section className="flex items-center flex-col mt-28">
      <div className="flex flex-col text-left">
        <h1 className="text-4xl font-semibold">
          <span className="gradient-text-red">Manage your Money with AI-Driven Personal</span>
          <br />
          <span className="text-4xl md:text-6xl text-blue-800 font-bold mt-1 leading-none">
            Finance Manager
          </span>
        </h1>
        <Image
          src="/dashboard.png"
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full mt-10 shadow-lg"
        />
        <div className="flex mt-10 space-x-6">
          <FaPiggyBank className="text-4xl text-blue-800" />
          <FaChartLine className="text-4xl text-blue-800" />
          <FaUserShield className="text-4xl text-blue-800" />
        </div>
      </div>
    </section>
  );
}
