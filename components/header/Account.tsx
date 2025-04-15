import { currentUser } from "@clerk/nextjs/server";
import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Account = async () => {
  const user = await currentUser();

  return (
    <div className="flex">
      <Link href={"/account/account"}>
        <div className="flex items-center gap-2.5 justify-end group cursor-pointer">
          {user ? (
            <Image
              src={user?.imageUrl}
              alt="userImage"
              width={24}
              height={24}
              className="w-6 h-6 rounded-full object-cover lg:hidden"
            />
          ) : (
            <User className="lg:hidden lg:text-tech_orange w-6 h-6 group-hover:text-tech_orange lg:group-hover:text-tech_white hoverEffect" />
          )}
          <User className="hidden lg:inline-flex lg:text-tech_orange w-6 h-6 group-hover:text-tech_orange lg:group-hover:text-tech_white hoverEffect" />
          <div className="hidden lg:flex flex-col">
            <h4 className="text-base font-bold text-tech_white">Account</h4>
            <p className="text-xs whitespace-nowrap">
              {user?.id ? "View profile" : "Login/Register"}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Account;
