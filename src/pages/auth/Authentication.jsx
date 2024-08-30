/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/apiClient";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utills/const";
import {
  validateEmailFormat,
  validatePasswordFormat,
} from "@/utills/validation";
import { useStore } from "@/store/store";
import { useNavigate } from "react-router-dom";

const Authentication = () => {
  const navigate = useNavigate();
  const { setUserInfo } = useStore();
  const [value, setValue] = useState("login");
  const [state, setState] = useState(true);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validateForm = () => {
    if (!email) {
      toast.error("Email is required.");
      return false;
    }
    if (!password) {
      toast.error("Password is required.");
      return false;
    }
    if (value === "account" && password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }
    if (!validateEmailFormat(email)) {
      toast.error("Invalid email format.");
      return false;
    }
    if (!validatePasswordFormat(password)) {
      toast.error(
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return false;
    }
    return true;
  };

  const handleLogInSubmit = async () => {
    if (validateForm()) {
      try {
        const response = await apiClient.post(
          LOGIN_ROUTE,
          { email, password },
          { withCredentials: true }
        );
        if (response.data.user.id) {
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          setUserInfo(response.data.user);
          navigate(response.data.user.profileSetup ? "/chat" : "/profile");
        }
      } catch (error) {
        toast.error("Login failed. Please check your credentials.");
      }
    }
  };

  const handleSignUpSubmit = async () => {
    if (validateForm()) {
      try {
        const response = await apiClient.post(
          SIGNUP_ROUTE,
          {
            email,
            password,
          },
          { withCredentials: true }
        );
        if (response.status === 201) {
          toast.success("Account created successfully.");
          setValue("login");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          setError("");
          setUserInfo(response.data.user);
          navigate("/profile");
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error("Email already exists. Try with a different email.");
          setValue("login");
        } else if (error.response && error.response.status === 500) {
          toast.error("Internal server error. Please try again later.");
        } else {
          toast.error("An unknown error occurred. Please try again.");
        }
      }
    }
  };

  return (
    <div className="h-[92vh] w-[100vw] flex items-center justify-center">
      <div
        className="h-[85vh] w-[80%] sm:w-[350px] md:w-[50%] bg-white border-2 border-solid border-sky-100 text-black rounded-2xl flex items-center 
        justify-center shadow-xl shadow-slate-400"
      >
        <Tabs value={value} onValueChange={setValue} className="w-3/4">
          <h1 className="text-4xl font-semibold md:text-5xl sm:text-3xl mb-4 text-black-600 font-sans w-full text-center">
            Welcome ✌️
          </h1>
          <TabsList className="shadow-xl shadow-stone-400 flex items-center justify-center w-full">
            <TabsTrigger value="login" className="text-sky-700 font-bold w-1/2">
              Log In
            </TabsTrigger>
            <TabsTrigger
              value="account"
              className="text-sky-700 font-bold w-1/2"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card className="border-solid border-sky-300 rounded-xl p-4">
              <CardHeader>
                <CardTitle className="flex items-center justify-center text-sky-500 font-bold">
                  Sign Up
                </CardTitle>
                <CardDescription className="text-center font-semibold">
                  Create a new account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="border-solid border-sky-300 "
                />
              </CardContent>
              <CardContent>
                <Input
                  type={state ? "password" : "text"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="border-solid border-sky-300"
                />
              </CardContent>
              <CardContent>
                <Input
                  type={state ? "password" : "text"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="border-solid border-sky-300"
                />
              </CardContent>
              {error && <p className="text-red-500">{error}</p>}

              <CardFooter className="flex items-center justify-center">
                <Button
                  className="bg-white border-[1px] hover:bg-sky-100 mr-2 border-sky-300"
                  onClick={() => setState(!state)}
                >
                  {state ? (
                    <i className="fa-solid fa-eye text-sky-300"></i>
                  ) : (
                    <i className="fa-solid fa-eye-slash text-sky-300"></i>
                  )}
                </Button>
                <Button
                  className="bg-white border-[1px] border-solid border-sky-300 text-sky-500 hover:bg-sky-500 hover:text-white"
                  onClick={handleSignUpSubmit}
                >
                  Submit
                </Button>
              </CardFooter>
              <Button
                className="bg-white border-sky-300 mt-4 text-sky-400 hover:bg-white hover:text-sky-600"
                onClick={() => setValue("login")}
              >
                If you already have an account
              </Button>
            </Card>
          </TabsContent>

          {/* end of sign up */}

          <TabsContent value="login">
            <Card className="border-solid border-sky-300 rounded-xl p-4">
              <CardHeader>
                <CardTitle className="flex items-center justify-center text-sky-500 font-bold">
                  Log In
                </CardTitle>
                <CardDescription className="text-center font-semibold">
                  Log in to your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="border-solid border-sky-300 "
                />
              </CardContent>
              <CardContent>
                <Input
                  type={state ? "password" : "text"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="border-solid border-sky-300"
                />
              </CardContent>
              <CardFooter className="flex items-center justify-center">
                <Button
                  className="bg-white border-[1px] hover:bg-sky-100 mr-2 border-sky-300"
                  onClick={() => setState(!state)}
                >
                  {state ? (
                    <i className="fa-solid fa-eye text-sky-300"></i>
                  ) : (
                    <i className="fa-solid fa-eye-slash text-sky-300"></i>
                  )}
                </Button>
                <Button
                  className="bg-white border-[1px] border-solid border-sky-300 text-sky-500 hover:bg-sky-500 hover:text-white"
                  onClick={handleLogInSubmit}
                >
                  Submit
                </Button>
              </CardFooter>
              <Button
                className="bg-white border-sky-500 mt-4 text-sky-400 hover:bg-white hover:text-sky-600"
                onClick={() => setValue("account")}
              >
                Create new account
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Authentication;
