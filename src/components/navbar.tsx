import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import CreateUserModal from "./create-user-modal";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/logo.jpeg";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { baseUrl } from "@/constants/constant";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/hooks/authStore";

const Navbar: React.FC = () => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [typeUser, setTypeUser] = useState(1);
  const { setIsAuthenticated } = useAuthStore();

  const navigate = useNavigate();

  const handleScroll = useCallback(() => {
    if (window.scrollY > lastScrollY) {
      setShowNavbar(false); // Ẩn navbar khi cuộn xuống
    } else {
      setShowNavbar(true); // Hiện navbar khi cuộn lên
    }
    setLastScrollY(window.scrollY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const handleOpenCreateUserModal = () => {
    setIsCreateUserModalOpen(true);
  };

  const handleCloseCreateUserModal = () => {
    setIsCreateUserModalOpen(false);
  };

  const handleCreateUserSubmit = async (
    username: string,
    password: string,
    typeUser: number
  ) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${baseUrl}/api/user/create`,
        { username, password, typeUser },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      handleCloseCreateUserModal();

      toast({
        variant: "success",
        description: "User created successfully",
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data || "An error occurred";
        toast({
          variant: "error",
          description: errorMessage,
        });
      } else {
        toast({
          variant: "error",
          description: "An unknown error occurred",
        });
      }
    }
  };

  const handleSignOut = () => {
    // Xóa thông tin đăng nhập trong localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("typeUser");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <>
      <nav
        className={`fixed z-10 top-0 left-0 w-full bg-[#ffffff99] backdrop-blur-md shadow-lg transition-transform duration-300 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <ul className="flex justify-between items-center px-4 py-1">
          <Link to="/">
            <li>
              <img src={logo} alt="Logo" className="h-8" />
            </li>
          </Link>

          <li className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger className="px-3 py-1 bg-transparent">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {localStorage.getItem("typeUser") === "0" && (
                  <DropdownMenuItem onClick={handleOpenCreateUserModal}>
                    Create Account
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleSignOut}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        </ul>
      </nav>

      {/* CreateUserModal Component */}
      <CreateUserModal
        isOpen={isCreateUserModalOpen}
        onClose={handleCloseCreateUserModal}
        onSubmit={handleCreateUserSubmit}
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        typeUser={typeUser}
        setTypeUser={setTypeUser}
      />
      <Outlet />
    </>
  );
};

export default Navbar;
