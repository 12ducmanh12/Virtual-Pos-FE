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
import { ChevronDown, ChevronRight, ScanQrCode, Copy, Trash2 } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import DeleteModal from "./components/delete-modal";
import DuplicateModal from "./components/duplicate-modal";
import CreateUserModal from "./components/create-user-modal";

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
  const [billIdToDelete, setBillIdToDelete] = useState<number | null>(null);
  const [billIdToDuplicate, setBillIdToDuplicate] = useState<number | null>(null);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [typeUser, setTypeUser] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleOpenCreateUserModal = () => {
    setIsCreateUserModalOpen(true);
    setUsername("");
    setPassword("");
    setTypeUser(1);
  };
  const handleCloseCreateUserModal = () => {
    setIsCreateUserModalOpen(false);
    setUsername("");
    setPassword("");
    setTypeUser(1);
  };

  const openDuplicateModal = (billId: number) => {
    setBillIdToDuplicate(billId);
    setIsDuplicateModalOpen(true);
  };

  const openDeleteModal = (billId: number) => {
    setBillIdToDelete(billId);
    setIsDeleteModalOpen(true);
  };

  const fetchBills = () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    axios
      .get(`${baseUrl}/api/bill/get-all-bill`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const toggleExpand = (billId: number) => {
    if (expandedBillIds.includes(billId)) {
      setExpandedBillIds(expandedBillIds.filter((id) => id !== billId));
    } else {
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

  const duplicateBill = async (billId: number | null) => {
    if (!billId) return;
    try {
      const token = localStorage.getItem("token");
      console.log(token);
      await axios.get(`http://localhost:5281/api/bill/duplicate/${billId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Gọi lại fetchBills để cập nhật danh sách sau khi duplicate thành công
      fetchBills();
    } catch (error) {
      console.error("Duplicate error:", error);
    }
  };

  const handleCreateUser = async (
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
          <Button className="w-fit" onClick={handleOpenCreateUserModal}>
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
            {loading && (
              <TableRow>
                <TableCell></TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[200px] text-left my-4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[200px] my-4 mx-auto" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[200px] my-4 mx-auto" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[200px] my-4 mx-auto" />
                </TableCell>
              </TableRow>
            )}
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
                        <Copy
                          onClick={() => openDuplicateModal(invoice.billId)}
                          className="cursor-pointer text-black hover:text-green-700 ml-7"
                        />
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

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          deleteBill(billIdToDelete);
          setIsDeleteModalOpen(false);
        }}
      />

      <DuplicateModal
        isOpen={isDuplicateModalOpen}
        onClose={() => setIsDuplicateModalOpen(false)}
        onConfirm={() => {
          duplicateBill(billIdToDuplicate);
          setIsDuplicateModalOpen(false);
        }}
      />

      <CreateUserModal
        isOpen={isCreateUserModalOpen}
        onClose={handleCloseCreateUserModal}
        onSubmit={handleCreateUser}
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        typeUser={typeUser}
        setTypeUser={setTypeUser}
      />
      <Toaster />
    </Container>
  );
}

export default ListBills;
