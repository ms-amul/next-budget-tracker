import { Button, Drawer, Popconfirm } from "antd";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import {
  MdClose,
  MdLogout,
  MdOutlineComment,
  MdOutlineDashboardCustomize,
} from "react-icons/md";

import { useRouter } from "next/navigation";
import { VscDashboard } from "react-icons/vsc";

export default function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleLogout = () => {
    signOut();
  };

  const handleRedirectToComments = () => {
    router.push("/comments");
    setDrawerVisible(false);
  };

  const handleRedirectDashboard = () => {
    router.push("/dashboard");
    setDrawerVisible(false);
  };

  const onClose = () => {
    setDrawerVisible(false);
  };

  return (
    <div className="md:px-16 rounded-3xl header">
      <div className="flex justify-between items-center p-2">
        {/* Logo Section */}
        <div className="flex items-center text-xl font-bold gradient-text-header select-none">
          <img src="/logo.png" className="w-12 h-12" />
          Servify<span className="hidden md:block"> - Finance Manager</span>
        </div>

        {status === "authenticated" ? (
          <>
            <div
              className="flex items-center gap-2 bg-slate-900 p-1 pr-2 rounded-full cursor-pointer shadow"
              onClick={() => setDrawerVisible(true)}
            >
              <img
                src={session?.user?.image}
                alt={session?.user?.name}
                className="w-12 h-12 rounded-full"
              />
              <MdOutlineDashboardCustomize className="text-white w-12 text-4xl" />
            </div>

            <Drawer
              placement="right"
              onClose={onClose}
              open={drawerVisible}
              closable={false}
              className="bg-black text-white"
            >
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-white/20 px-4 py-4">
                    <div className="flex items-center gap-3 px-2">
                      <img
                        src={session?.user?.image}
                        alt="user"
                        className="w-12 h-12 rounded-lg"
                      />
                      <div className="font-semibold text-lg truncate max-w-[150px]">
                        {session?.user?.name}
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-1 rounded-full hover:bg-white/10"
                    >
                      <MdClose className="text-2xl" />
                    </button>
                  </div>

                  {/* Center Navigation */}
                  <div className="flex flex-col items-center mt-8 gap-4">
                    <Button
                      type="text"
                      icon={
                        <VscDashboard className="text-green-400 text-2xl" />
                      }
                      className="w-11/12 text-lg font-medium text-white hover:bg-green-500/10 hover:text-green-400 flex justify-start py-7"
                      onClick={handleRedirectDashboard}
                    >
                      Dashboard
                    </Button>

                    <Button
                      type="text"
                      icon={
                        <MdOutlineComment className="text-purple-400 text-2xl" />
                      }
                      className="w-11/12 text-lg font-medium text-white hover:bg-green-500/10 hover:text-green-400 flex justify-start py-7"
                      onClick={handleRedirectToComments}
                    >
                      Talks & Threads
                    </Button>
                  </div>
                </div>

                {/* Bottom - Logout */}
                <div className="border-t border-white/20">
                  <Popconfirm
                    title="Are you sure you want to sign out?"
                    onConfirm={handleLogout}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      type="text"
                      icon={<MdLogout className="text-red-400 text-2xl" />}
                      className="w-full text-lg text-red-300 hover:bg-red-500/10 hover:text-red-400 font-medium flex justify-start py-8"
                    >
                      Logout
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            </Drawer>
          </>
        ) : (
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
        )}
      </div>
    </div>
  );
}
