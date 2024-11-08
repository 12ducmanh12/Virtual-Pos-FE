import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface CreateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (username: string, password: string, typeUser: number) => void;
    username: string;
    setUsername: (username: string) => void;
    password: string;
    setPassword: (password: string) => void;
    typeUser: number;
    setTypeUser: (type: number) => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    username,
    setUsername,
    password,
    setPassword,
    typeUser,
    setTypeUser,
}) => {
    useEffect(() => {
        if (isOpen) {
            setUsername("");
            setPassword("");
            setTypeUser(1);
        }
    }, [isOpen, setUsername, setPassword, setTypeUser]);

    if (!isOpen) return null;

    const handleConfirmCreateUser = () => {
        if (!username || !password) {
            toast({
                variant: "error",
                description: "Please enter full Username and Password information",
            });
            return;
        }
        onSubmit(username, password, typeUser);
    };

    return (
        <div className="fixed z-10 inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-80">
                <h2 className="text-lg font-semibold mb-4">Tạo Người Dùng</h2>
                <div className="mb-2">
                    <Input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="mb-2">
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="mb-2">
                    <Select
                        value={typeUser.toString()}
                        onValueChange={(value) => setTypeUser(Number(value))}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn loại người dùng" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="0">Admin</SelectItem>
                                <SelectItem value="1">User</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex justify-around gap-2 mt-4">
                    <Button onClick={onClose}>Hủy</Button>
                    <Button onClick={handleConfirmCreateUser}>Xác Nhận</Button>
                </div>
            </div>
        </div>
    );
};

export default CreateUserModal;
