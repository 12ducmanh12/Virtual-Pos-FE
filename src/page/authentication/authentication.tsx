import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/hooks/authStore";
import { baseUrl } from "@/constants/constant";
import { LoaderCircle } from "lucide-react";
import "./style.css";

function Authentication() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const toggleForm = () => {
    setIsSignIn(!isSignIn);
    setError("");
  };

  const handleSignUpSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        variant: "error",
        title: "Error",
        description: "Passwords do not match",
      });
    }
  };

  const handleSignInSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const { token, expiration, typeUser } = await response.json();

      localStorage.setItem("token", token);
      localStorage.setItem("expiration", expiration);
      localStorage.setItem("typeUser", typeUser);

      setIsAuthenticated(true);
      navigate("/");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast({
        variant: "error",
        title: "Login Failed",
        description: "Username or Password incorrect",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-custom flex justify-center items-center min-h-screen">
      <div
        className={`p-8 space-y-6 xl:w-4/12 lg:w-8/12 sm:w-[95%] w-[95%] bg-white rounded-lg shadow-md items-baseline transition-height
                    ${isSignIn ? "signin-height" : "signup-height"}`}
      >
        <h2
          className={`text-3xl leading-[3.25rem] font-bold text-center bg-gradient-to-r from-[#F21472] to-[#6C24F6] bg-clip-text text-transparent
                     transition-all duration-500`}
        >
          {isSignIn ? "Sign In" : "Sign Up"}
        </h2>

        {/* Form Sign In */}
        <div
          className={`${isSignIn ? "slide-in-right" : "slide-out-left"} ${
            !isSignIn && "hidden"
          } transition-all duration-900`}
        >
          <form className="space-y-4" onSubmit={handleSignInSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full button-gradient">
              {loading ? (
                <LoaderCircle className="animate-spin h-5 w-5 text-white" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </div>

        {/* Form Sign Up */}
        <div
          className={`${!isSignIn ? "slide-in-left" : "slide-out-right"} ${
            isSignIn && "hidden"
          } transition-all duration-900`}
        >
          <form className="space-y-4" onSubmit={handleSignUpSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                required
                className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                required
                className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full button-gradient">
              Sign Up
            </Button>
          </form>
        </div>

        {/* Toggle Button */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={toggleForm}
              className="font-medium bg-white bg-gradient-to-r from-[#F21472] to-[#6C24F6] bg-clip-text hover:text-violet-400"
            >
              {isSignIn ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default Authentication;
