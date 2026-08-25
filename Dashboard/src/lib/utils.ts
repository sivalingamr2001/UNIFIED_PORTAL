import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import Logo from "@/assets/jana.png"
import PESLOGO from "@/assets/PES_LITE.png"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export { PESLOGO }
export default Logo
