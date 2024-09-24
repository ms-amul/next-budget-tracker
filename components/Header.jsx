import { Button } from "antd";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { LiaSignOutAltSolid } from "react-icons/lia";

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <div className="bg-slate-900 bg-opacity-10 backdrop-blur-md fixed w-full top-0 left-0 z-[999]">
      <div className="flex justify-between items-center p-2">
        <div className="flex items-center text-2xl font-bold gradient-text-red">
          <Image src="/logo.png" width={45} height={45} />
          Servify <span className="hidden md:block ml-1 gradient-text-green">Your personal finance manager</span>
        </div>
        {status === "authenticated" ? (
          <div className="flex items-center">
            <img
              width={45}
              height={45}
              src={session?.user?.image}
              alt={session?.user?.name}
              className="rounded-full border-2 p-[1px] hover:p-0 transition-all duration-200 border-red-400"
            />
            <Button
              size="large"
              color="danger"
              variant="fill"
              onClick={() => signOut()}
              className="ml-4 border flex items-center font-semibold"
            >
              <LiaSignOutAltSolid />
              Sign out
            </Button>
          </div>
        ) : (
          <>
            <Button
              color="primary"
              variant="fill"
              size="large"
              onClick={() => signIn("google")}
              className="flex items-center font-semibold"
            >
              <FcGoogle />
              Sign in with Google
            </Button>
          </>
        )}
      </div>
      <hr className="border-gray-400 mt-1" />
    </div>
  );
}
