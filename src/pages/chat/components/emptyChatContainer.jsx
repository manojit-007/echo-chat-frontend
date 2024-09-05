/* eslint-disable no-unused-vars */
import { animationDefaultOptions } from "@/lib/utils";
import React from "react";
import Lottie from "react-lottie";

const EmptyChatContainer = () => {
  return (
    <section className="flex-1 bg-white md:flex flex-col justify-center items-center hidden transition-all duration-100">
      <div >
        <Lottie
          isClickToPauseDisabled={true}
          height={200}
          width={200}
          options={animationDefaultOptions}
        />
      </div>
      {/* <div className="text-opacity-80 bg-gray-100 text-white text-center flex flex-col gap-5 items-center mt-10 lg:text-4xl text-3xl transition-all duration-300">
        <h3 className="poppins-medium">
          Hi <span className="text-black font-semibold">!</span> Welcome to
          <span className="text-black font-semibold"> EchoChat</span> community
        </h3>
      </div> */}
      {/* <div> */}
      {/* <button className="bg-gray-200 rounded-sm text-black p-4 text-xl font-medium">Welcome to EchoChat</button> */}
      {/* </div> */}
      <div className="flex items-center justify-center bg-gray-100 border p-2 rounded-sm">
        <p className="font-bold text-2xl text-gray-700">
          Welcome to EchoChat
        </p>
      </div>

    </section>
  );
};

export default EmptyChatContainer;
