import Container from "@/components/container";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { ChevronDown, ChevronRight, ScanQrCode, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import { baseUrl } from "@/constants/constant";
import { webHddtUrl } from "@/constants/constant";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface productsType {
  productId: number;
  name: string;
  unitPrice: number;
  amount: number;
  discount: number;
  total: number;
}
interface dataBillType {
  billId: number;
  storeName: string;
  total: number;
  maEinvoice: string;
  products: Array<productsType>;
}
function ListBills() {
  const [data, setData] = useState<dataBillType[]>([]);
  const [expandedBillIds, setExpandedBillIds] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [billIdToDelete, setBillIdToDelete] = useState<number | null>(null);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [typeUser, setTypeUser] = useState(1);
  const navigate = useNavigate();

  const handleOpenModal = () => {
    setIsCreateUserModalOpen(true);
    setUsername("");
    setPassword("");
    setTypeUser(1);
  };
  const handleCloseModal = () => {
    setIsCreateUserModalOpen(false);
    setUsername("");
    setPassword("");
    setTypeUser(1);
  };

  const handleCreateUser = () => {
    createUser(username, password, typeUser);
    handleCloseModal();
  };

  const openDeleteModal = (billId: number) => {
    setBillIdToDelete(billId);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${baseUrl}/api/bill/get-all-bill`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const toggleExpand = (billId: number) => {
    if (expandedBillIds.includes(billId)) {
      // Nếu billId đã có trong mảng thì xóa nó đi (đóng bảng)
      setExpandedBillIds(expandedBillIds.filter((id) => id !== billId));
    } else {
      // Nếu billId chưa có trong mảng thì thêm vào (mở bảng)
      setExpandedBillIds([...expandedBillIds, billId]);
    }
  };

  const deleteBill = async (billId: number | null) => {
    if (!billId) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://vpos.giftzone.vn/api/bill/delete/${billId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(data.filter((bill) => bill.billId !== billId)); // Update the UI
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const createUser = async (username: string, password: string, typeUser: number) => {
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

  return (
    <Container>
      <div className="flex justify-end gap-5">
        {localStorage.getItem("typeUser") === "0" && (
          <Button className="w-fit" onClick={handleOpenModal}>
            Tạo Người Dùng
          </Button>
        )}
        <Button
          className="w-fit"
          onClick={() => navigate("/create-multi-bill")}
        >
          Tạo Hóa Đơn
        </Button>
      </div>
      <div className="flex items-center justify-center my-5">
        <h2 className="flex-grow text-center bg-gradient-to-r from-[#F21472] to-[#6C24F6] bg-clip-text text-transparent font-bold">
          Danh Sách Hóa Đơn
        </h2>
      </div>
      <div className="rounded-lg shadow-xl rounded-r-lg">
        <Table className="relative">
          <TableHeader className="bg-gradient-custom text-white ">
            <TableRow className=" rounded-lg">
              <TableHead className="w-[3%] text-white text-center font-bold rounded-tl-lg"></TableHead>
              <TableHead className="w-2/12 text-white text-left font-bold">
                Bill Id
              </TableHead>
              <TableHead className="w-3/12 text-white text-center font-bold">
                Tên cửa hàng
              </TableHead>
              <TableHead className="w-3/12 text-white text-center font-bold">
                Tổng tiền
              </TableHead>
              <TableHead className="w-3/12 text-white text-center font-bold rounded-tr-lg">
                Qr Code
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((invoice) => (
              <React.Fragment key={invoice.billId}>
                <TableRow>
                  <TableCell className="font-medium text-center">
                    {expandedBillIds.includes(invoice.billId) ? (
                      <ChevronDown
                        onClick={() => toggleExpand(invoice.billId)}
                        className="cursor-pointer"
                      />
                    ) : (
                      <ChevronRight
                        onClick={() => toggleExpand(invoice.billId)}
                        className="cursor-pointer"
                      />
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-left">
                    {invoice.billId}
                  </TableCell>
                  <TableCell className="text-center">
                    {invoice.storeName}
                  </TableCell>
                  <TableCell className="text-center">{invoice.total}</TableCell>
                  <TableCell className="flex justify-center relative">
                    <Popover>
                      <div className="flex justify-between items-center">
                        <PopoverTrigger asChild>
                          <Button variant="outline">
                            <ScanQrCode />
                            <p className="text-sm">QR Code</p>
                          </Button>
                        </PopoverTrigger>
                        <Trash2
                          onClick={() => openDeleteModal(invoice.billId)}
                          className="cursor-pointer text-black hover:text-red-700 ml-7"
                        />
                      </div>
                      <PopoverContent className="w-60">
                        <QRCode
                          size={150}
                          style={{
                            height: "auto",
                            maxWidth: "100%",
                            width: "100%",
                            padding: "10px",
                          }}
                          value={`${webHddtUrl}/${invoice.billId}`}
                          viewBox={`0 0 256 256`}
                        />
                        <div className="flex mt-3">
                          <div className="border border-blue-400 px-2 flex items-center w-[75%] rounded-tl-xl rounded-bl-xl">
                            <p className="block w-full whitespace-nowrap overflow-hidden text-ellipsis">
                              {`${webHddtUrl}/${invoice.billId}`}
                            </p>
                          </div>
                          <Link
                            to={`${webHddtUrl}/${invoice.billId}`}
                            target="_blank"
                            className="bg-gradient-custom text-white w-[25%] flex h-10 justify-center items-center rounded-tr-xl rounded-br-xl cursor-pointer"
                          >
                            Go to
                          </Link>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>

                {/* Bảng con chi tiết sản phẩm */}
                {expandedBillIds.includes(invoice.billId) && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Table className="w-[95%] ml-auto shadow-lg">
                        <TableHeader className="bg-gradient-custom">
                          <TableRow>
                            <TableHead className="text-left font-bold text-white rounded-tl-lg">
                              Tên sản phẩm
                            </TableHead>
                            <TableHead className="text-center font-bold text-white">
                              Đơn giá
                            </TableHead>
                            <TableHead className="text-center font-bold text-white">
                              Số lượng
                            </TableHead>
                            <TableHead className="text-center font-bold text-white">
                              Giảm giá
                            </TableHead>
                            <TableHead className="text-right font-bold text-white rounded-tr-lg">
                              Tổng tiền
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {invoice.products?.map((product) => (
                            <TableRow key={product.productId}>
                              <TableCell className="text-left">
                                {product.name}
                              </TableCell>
                              <TableCell className="text-center">
                                {product.unitPrice}
                              </TableCell>
                              <TableCell className="text-center">
                                {product.amount}
                              </TableCell>
                              <TableCell className="text-center">
                                {product.discount}
                              </TableCell>
                              <TableCell className="text-right">
                                {product.total}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-sm font-semibold">Are you sure want to delete this bill?</p>
            <div className="flex justify-end mt-6 space-x-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  deleteBill(billIdToDelete); // Call the delete function
                  setIsModalOpen(false);
                }}
              >
                Confirm Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {isCreateUserModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
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
              <Button onClick={handleCloseModal}>Hủy</Button>
              <Button onClick={handleCreateUser}>Xác Nhận</Button>
            </div>
          </div>
        </div>
      )}
      <Toaster />
    </Container>
  );
}

export default ListBills;
