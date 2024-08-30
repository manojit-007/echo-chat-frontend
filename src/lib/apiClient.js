import { HOST } from "@/utills/const";
import axios from "axios";

export const apiClient  = axios.create({
    baseURL: HOST,
    withCredentials: true,
})