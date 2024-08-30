/* eslint-disable no-unused-vars */
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getColor } from "@/lib/utils";
import { useStore } from "@/store/store";
import { HOST, USER_LOG_OUT } from "@/utills/const";
import React, { useEffect, useState } from "react";
import { IoSettingsSharp } from "react-icons/io5";
import { FiLogOut  } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/apiClient";
import { toast } from "sonner";

const ProfileInfo = () => {
  const { userInfo, setUserInfo } = useStore();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  const logOut = async() =>{
    try {
      const response = await apiClient.post(USER_LOG_OUT, {}, {withCredentials:true});
      if(response.status === 200){
        navigate("/auth");
        setUserInfo(null);
        toast.success("Logged out successfully.");
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const userInitial = userInfo.firstName
    ? userInfo.firstName.charAt(0).toUpperCase()
    : userInfo.email.charAt(0).toUpperCase();

  useEffect(() => {
    setUsername(userInfo.username);
    if(!userInfo.profileSetup) {
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  return (
    <div
      className="absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#1c1d25] border-t-[1px] border-gray-600 cursor-pointer hover:bg-[#25262f] transition-colors duration-300"
    >
      <div className="flex gap-3 items-center justify-center">
        <div className="w-12 h-12 relative">
          <Avatar className="h-12 w-12 rounded-full overflow-hidden">
            {userInfo.image ? (
              <AvatarImage
                src={`${HOST}/${userInfo.image}`}
                alt="User profile image"
                className="object-cover w-full h-full bg-black"
              />
            ) : (
              <div
                className={`uppercase h-12 w-12 text-lg flex items-center justify-center rounded-full border-[1px] ${getColor(
                  userInfo.color
                )}`}
                aria-label={`User initial ${userInitial}`}
              >
                {userInitial}
              </div>
            )}
          </Avatar>
        </div>
        <div className="ml-2 text-sm font-medium text-white">
          {userInfo.firstName && userInfo.lastName
            ? `${userInfo.firstName} ${userInfo.lastName}`
            : ""}
          {/* {userInfo.firstName} {userInfo.lastName} */}
          {/* {username} */}
        </div>
      </div>
      <div className="flex gap-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <IoSettingsSharp className="text-white text-lg"  onClick={() => navigate("/profile")} />
            </TooltipTrigger>
            <TooltipContent className="bg-[#0a0b0d] border-none">
              <p className="font-semibold text-sky-400">Edit your profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FiLogOut className="text-white text-lg" onClick={logOut} />
            </TooltipTrigger>
            <TooltipContent className="bg-[#0a0b0d] border-none">
              <p className="font-semibold text-sky-400">Log out</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ProfileInfo;
