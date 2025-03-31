import { Button, Popconfirm } from "antd";
import { signIn, signOut, useSession } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { MdLockPerson } from "react-icons/md";

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <div className="md:px-16 rounded-3xl header">
      <div className="flex justify-between items-center p-2">
        <div className="flex items-center text-xl font-bold gradient-text-header select-none pointer-events-none">
          <img src="/logo.png" className="w-12 h-12" />
          Servify<span className="hidden md:block"> - Finance manager</span>
        </div>
        {status === "authenticated" ? (
          <div className="flex items-center">
            <img
              src={session?.user?.image}
              alt={session?.user?.name}
              className="w-12 h-12 rounded-xl shadow-lg"
            />
            <Popconfirm
              title="Are you sure you want to sign out?"
              onConfirm={() => signOut()}
              okText="Yes"
              cancelText="No"
            >
              <Button
                color="danger"
                size="large"
                variant="fill"
                className="ml-4 border flex items-center font-semibold"
              >
                <MdLockPerson /> Logout
              </Button>
            </Popconfirm>
          </div>
        ) : (
          <>
            <Button
              color="primary"
              variant="fill"
              size="large"
              onClick={() => signIn("google")}
              className="flex items-center font-bold text-cyan-200"
            >
              <FcGoogle />
              Log In
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
