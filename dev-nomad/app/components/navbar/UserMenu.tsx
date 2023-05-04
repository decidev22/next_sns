"use client";
import { AiOutlineMenu } from "react-icons/ai";
import Avatar from "../Avatar";
import { useCallback, useState } from "react";
import MenuItem from "./MenuItem";

import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";
import { SafeUser } from "@/app/types";
import { signOut } from "next-auth/react";
import useHostModal from "@/app/hooks/useHostModal";
import { useRouter } from "next/navigation";
import useShareModal from "@/app/hooks/useShareModal";

interface UserMenuProps {
  currentUser?: SafeUser | null;
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const hostModal = useHostModal();
  const shareModal = useShareModal();
  const loggedIn = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }
    // hostModal.onOpen();
  }, [currentUser, loginModal]);

  const router = useRouter();

  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        <div
          onClick={loggedIn}
          className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:neutral-100 transition cursor-pointer"
        >
          {currentUser
            ? "Welcome back " + currentUser.name
            : "Your new workplace"}
        </div>
        <div
          onClick={toggleOpen}
          className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
        >
          <AiOutlineMenu />
          <div className="hidden md:block">
            <Avatar src={currentUser?.image} />
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm">
          <div className="flex flex-col cursor-pointer">
            {currentUser ? (
              <>
                <MenuItem
                  onClick={() => router.push("/journey")}
                  label="My Journey"
                />
                <MenuItem
                  onClick={() => router.push("/favorites")}
                  label="My Favorites"
                />
                <MenuItem
                  onClick={() => router.push("/reservations")}
                  label="Hosted Reservations"
                />
                <MenuItem
                  onClick={() => router.push("/properties")}
                  label="My Properties"
                />

                <MenuItem
                  onClick={hostModal.onOpen}
                  label="Host Nomad"
                />

                {/* <MenuItem
                  onClick={() => router.push("/shares")}
                  label="Places You Shared"
                /> */}
                <MenuItem
                  onClick={shareModal.onOpen}
                  label="Share Nomad"
                />
                <MenuItem
                  onClick={() => router.push("/")}
                  label="Home"
                />
                <hr />
                <MenuItem onClick={() => signOut()} label="Logout" />
              </>
            ) : (
              <>
                <MenuItem onClick={loginModal.onOpen} label="Login" />
                <MenuItem
                  onClick={registerModal.onOpen}
                  label="SignUp"
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
