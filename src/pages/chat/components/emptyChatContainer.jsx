/* eslint-disable no-unused-vars */
import { animationDefaultOptions } from "@/lib/utils";
import React from "react";
import Lottie from "react-lottie";

const EmptyChatContainer = () => {
  return (
    <section className="flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center hidden transition-all duration-100">
      <div className="hue-rotate-60">
        <Lottie
          isClickToPauseDisabled={true}
          height={200}
          width={200}
          options={animationDefaultOptions}
        />
      </div>
      <div className="text-opacity-80 text-white text-center flex flex-col gap-5 items-center mt-10 lg:text-4xl text-3xl transition-all duration-300">
        <h3 className="poppins-medium">
          Hi <span className="text-sky-500">!</span> Welcome to
          <span className="text-sky-500 font-medium"> EchoChat</span> community
        </h3>
      </div>
    </section>
  );
};

export default EmptyChatContainer;
