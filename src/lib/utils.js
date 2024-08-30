import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import animationData from "@/assets/animation-file.json"; // Ensure the correct path and file

// Utility function to merge class names
export function cn(...inputs) {
  return twMerge(clsx(...inputs)); // Spread the inputs to handle multiple arguments correctly
}

// Define color options with Tailwind CSS classes and custom styles
export const colors = [
  "bg-[#712c4a57] text-[#ff006e] border-[#ff006faa] border-[1px]", 
  "bg-[#ffd60a2a] text-[#ffd60a] border-[#ffd60abb] border-[1px]", 
  "bg-[#06d6a02a] text-[#06d6a0] border-[#06d6a0bb] border-[1px]", 
  "bg-[#4cc9f02a] text-[#4cc9f0] border-[#4cc9f0bb] border-[1px]",
  "bg-[#ffafcc2a] text-[#ffafcc] border-[#ffafccbb] border-[1px]", 
  "bg-[#84b6f42a] text-[#84b6f4] border-[#84b6f4bb] border-[1px]",
  "bg-[#ffffff3a] text-[#ffffff] border-[#ffffffff] border-[1px]"
];

// Function to get the color based on the provided index
export const getColor = (colorIndex) => {
  if (colorIndex >= 0 && colorIndex < colors.length) return colors[colorIndex];
  return colors[1]; // Default to second color if out of bounds
};

// Default options for Lottie animations
export const animationDefaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
};
