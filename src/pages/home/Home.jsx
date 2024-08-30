/* eslint-disable no-unused-vars */
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const data = [
  {
    "title": "Stable Operation",
    "description": "Uptime 100% - secure communication channels for your business on servers",
  },
  {
    "title": "Tech Support",
    "description": "We offer problem-solving, consulting, and training services for your business",
  },
  {
    "title": "Handy payment from any country",
    "description": "Various payment methods such as credit card, Paypal, invoice, etc.",
  },
  {
    "title": "Great features and multiple channels",
    "description": "Integration of multiple messengers and social media platforms for efficient customer communication",
  }
];

const Home = () => {
  return (
    <div className="flex items-center justify-center w-[100vw] h-[80vh]">
      <Carousel className="w-full max-w-xs flex items-center justify-center ">
        <div><a href="/auth">auth</a></div>
        <CarouselContent>
          {data.map((item, index) => (
            <CarouselItem key={index}>
              <div className="p-1 border-2 border-sky-400 border-solid rounded-2xl ">
                <Card>
                  <CardContent className="flex flex-col items-center justify-center text-center from-rose-900 p-6 h-[250px]">
                    <span className="text-lg text-blue-700 font-bold">{item.title}</span>
                    <p className="text-sm text-center mt-2 font-medium">{item.description}</p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="border-2 border-solid border-sky-400"/>
        <CarouselNext className="border-2 border-solid border-sky-400" />
      </Carousel>
    </div>
  );
};

export default Home;
