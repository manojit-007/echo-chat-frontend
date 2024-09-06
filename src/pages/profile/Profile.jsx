/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { useStore } from "@/store/store";
import { apiClient } from "@/lib/apiClient";
import { HOST, REMOVE_PROFILE_IMAGE_ROUTE, UPDATE_PROFILE_IMAGE_ROUTE, UPDATE_PROFILE_ROUTE } from "@/utills/const";
import { useNavigate } from "react-router-dom";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";
import { MdOutlineFileUpload } from "react-icons/md";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { colors, getColor } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo, token } = useStore();
  const [hover, setHover] = useState(false);
  const [firstName, setFirstName] = useState(userInfo?.firstName || "");
  const [username, setUsername] = useState(userInfo?.username || "");
  const [lastName, setLastName] = useState(userInfo?.lastName || "");
  const [email, setEmail] = useState(userInfo?.email || "");
  // const [image, setImage] = useState(null);
  const [image, setImage] = useState(userInfo?.image ? `${HOST}/${userInfo.image}` : null);
  // const [image, setImage] = useState(userInfo?.image || null);
  const [color, setColor] = useState(userInfo?.color || 3);
  const fileInputRef = useRef(null);

  useEffect(() => {
    console.log(token);
    if (userInfo.profileSetup) {
      setUsername(userInfo.username);
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setEmail(userInfo.email);
      setColor(userInfo.color);
    }
  
    if (userInfo.image) {
      setImage(`${HOST}/${userInfo.image}`);
    } else {
      setImage(null); 
    }
  }, [token, userInfo]);
  

  const validateProfile = () => {
    if (!firstName || !lastName || !email) {
      toast.error("All fields are required.");
      return false;
    }
    return true;
  };

  const handleProfileUpdate = async () => {
    if (validateProfile()) {
      const Token = localStorage.getItem('token');
        try {
            const response = await apiClient.post(
                UPDATE_PROFILE_ROUTE,
                { firstName, lastName, color },
                {
                  withCredentials: true,
                  headers: { Authorization: `Bearer ${Token}` }, // Correct format for headers
                }
            );
            if (response.status === 200 && response.data) {
                // console.log(response.data);
                setUserInfo({ ...response.data });
                toast.success("Profile updated successfully.");
                navigate("/chat");
            }
        } catch (error) {
            console.log(error.response?.data?.message || error);
        }
    }
};


  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const  file = e.target.files[0]
    console.log(file);
    if(file){
      const formData = new FormData();
      formData.append("profileImage", file);
      const response = await apiClient.post(
        UPDATE_PROFILE_IMAGE_ROUTE,
        formData,
        { withCredentials: true }
      );
      console.log(response);
      if(response.status === 200 && response.data.image){
        setUserInfo({...userInfo, image: response.data.image });
        toast.success("Image updated successfully.");
      }
      setImage(userInfo.image);
      console.log(userInfo);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = async () => {
    try {
      const response = await apiClient.delete(
        REMOVE_PROFILE_IMAGE_ROUTE,
        { withCredentials: true }
      );
      if (response.status === 200) {
        setUserInfo({...userInfo, image: null });
        toast.success("Image deleted successfully.");
        setImage(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-black h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div className="flex justify-between">
          <IoArrowBack
            className="text-white/90 text-4xl lg:text-6xl cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <div className="w-1/2 text-black font-semibold">
            <Input
              className="bg-transparent text-white mb-2 border-gray-600 focus:outline-none focus:ring-0"
              placeholder="email"
              type="email"
              disabled
              value={userInfo.email}
            />
          </div>
          <IoArrowForward
            className="text-white/90 text-4xl lg:text-6xl cursor-pointer"
            onClick={() => navigate("/chat")}
          />
        </div>
        <div className="grid grid-cols-2">
          <div
            className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl flex flex-wrap items-center justify-center  rounded-full border-[1px] ${getColor(
                    color
                  )}`}
                >
                  {firstName
                    ? firstName.split("").shift()
                    : userInfo.email.split("").shift()}
                </div>
              )}
            </Avatar>
            {hover && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full ring-fuchsia-50"
                onClick={image ? handleDeleteImage : handleFileInputClick}
              >
                {image ? (
                  <FaTrash className="text-white text-3xl cursor-pointer" />
                ) : (
                  <MdOutlineFileUpload className="text-white text-3xl cursor-pointer" />
                )}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
              name="profileImage"
              accept=".png, .jpg, .jpeg, .svg, .webp , .gif"
            />
          </div>
          <div className="flex min-w-32 md:min-w-64 gap-5 text-white flex-col items-center justify-center ">
            <div className="w-full text-black font-semibold">
              {/* <Input
                className="bg-transparent text-white mb-2"
                placeholder="User name"
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              /> */}
            </div>
            <div className="w-full text-black font-semibold">
              <Input
                className="bg-transparent text-white mb-2"
                placeholder="First name"
                type="text"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
              />
            </div>

            <div className="w-full text-black font-semibold">
              <Input
                className="bg-transparent text-white mb-2"
                placeholder="Last name"
                type="text"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
              />
            </div>
            <div className="w-full text-black font-semibold flex items-center justify-between">
              {colors.map((colorItem, index) => (
                <button
                  key={index}
                  className={`w-8 h-8  rounded-full transition-all duration-300 ${colorItem}
                  ${color === index ? "outline outline-white/70 outline-2" : ""}
                  `}
                  onClick={() => setColor(index)}
                ></button>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full">
          <Button
            className={`h-16 w-full ${getColor(
              color
            )} hover:bg-black hover:text-white`}
            onClick={handleProfileUpdate}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
