import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import QRCode from "react-qr-code";
import {
  ArrowLeft,
  RotateCcw,
  SquarePlus,
  Trash2,
  ScanQrCode,
} from "lucide-react";
import "./style.css";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ItemBill from "./components/item-bill";
import { refreshToken } from "@/utils/refreshToken";
import { baseUrl } from "@/constants/constant";
import { webHddtUrl } from "@/constants/constant";

interface Product {
  name: string;
  sku: string;
  unitPrice: number;
  amount: number;
  discount: number;
  total: number;
}

interface Retailer {
  retailerId: number;
  name: string;
}

interface Store {
  storeId: number;
  name: string;
}
function CreateMultiBill() {
  const [qrCodes, setQrCodes] = useState<{ [key: number]: string }>({});
  const [products, setProducts] = useState<{ [key: number]: Product[] }>({});
  const [errorBranch, setErrorBranch] = useState<string>("");
  const [errorProduct, setErrorProduct] = useState<string>("");
  const [animationback, setAnimationback] = useState(false);
  const [qrCode, setQrCode] = useState<string>("");
  const [bill, setBill] = useState<number[]>([1]);
  const [billIdActive, setBillIdActive] = useState<number>(1);
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const activeProducts = products[billIdActive] || [
    { name: "", sku: "", unitPrice: 0, amount: 1, discount: 0, total: 0 },
  ];
  const [billDetails, setBillDetails] = useState<{
    [key: number]: { retailerId: string; storeId: string; stores: Store[] };
  }>({});
  const activeBillDetails = billDetails[billIdActive] || {
    retailerId: "",
    storeId: "",
    stores: [],
  };

  const handleResetField = () => {
    setProducts({
      [billIdActive]: [
        { name: "", sku: "", unitPrice: 0, amount: 1, discount: 0, total: 0 },
      ],
    });
  };

  const handleProductChange = (
    billId: number,
    index: number,
    field: keyof Product,
    value: string
  ) => {
    const updatedProducts = { ...products };
    if (!updatedProducts[billId]) updatedProducts[billId] = [];

    updatedProducts[billId][index] = {
      ...updatedProducts[billId][index],
      [field]:
        field === "unitPrice" || field === "amount" || field === "discount"
          ? parseFloat(value)
          : value,
    };

    updatedProducts[billId][index].total =
      (updatedProducts[billId][index].unitPrice -
        updatedProducts[billId][index].discount) *
      updatedProducts[billId][index].amount;

    setProducts(updatedProducts);
  };

  const addProduct = () => {
    const updatedProducts = { ...products };
    if (!updatedProducts[billIdActive]) updatedProducts[billIdActive] = [];

    updatedProducts[billIdActive] = [
      ...updatedProducts[billIdActive],
      { name: "", sku: "", unitPrice: 0, amount: 1, discount: 0, total: 0 },
    ];

    setProducts(updatedProducts);
  };

  const removeProduct = (index: number) => {
    const updatedProducts = { ...products };
    updatedProducts[billIdActive] = updatedProducts[billIdActive].filter(
      (_, i) => i !== index
    );
    setProducts(updatedProducts);
  };

  const handleViewQrCode = async (billNumber: number) => {
    // Thay thế billIdActive bằng billNumber
    const activeProducts = products[billNumber] || [
      { name: "", sku: "", unitPrice: 0, amount: 1, discount: 0, total: 0 },
    ];

    const activeBillDetails = billDetails[billNumber] || {
      retailerId: "",
      storeId: "",
      stores: [],
    };
    const { retailerId, storeId } = activeBillDetails;

    if (qrCodes[billNumber]) {
      setQrCode(qrCodes[billNumber]);
      return;
    }

    if (!retailerId) {
      setErrorBranch("Vui lòng chọn nhà bán lẻ khi tạo đơn hàng.");
      return;
    }

    if (!storeId) {
      setErrorBranch("Vui lòng chọn cửa hàng khi tạo đơn hàng.");
      return;
    }

    if (
      activeProducts.length === 0 ||
      activeProducts.some(
        (product) =>
          !product.name || product.unitPrice <= 0 || product.amount <= 0
      )
    ) {
      setErrorProduct("Vui lòng điền đầy đủ thông tin sản phẩm trước khi lưu.");
      return;
    }

    setErrorProduct("");
    setErrorBranch("");

    const billData = {
      storeId,
      products: activeProducts,
      totalDiscount: activeProducts.reduce(
        (acc, product) => acc + product.discount * product.amount,
        0
      ),
      total: activeProducts.reduce((acc, product) => acc + product.total, 0),
    };

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${baseUrl}/api/bill/create`,
        billData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newQrCode = `${webHddtUrl}/${response.data.billId}`;
      setQrCodes((prevQrCodes) => ({
        ...prevQrCodes,
        [billNumber]: newQrCode,
      }));
      setQrCode(newQrCode);
      setLoading(false);
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response?.data?.error === "Unauthorized"
      ) {
        // Thực hiện refresh token nếu lỗi Unauthorized
        await refreshToken();
        const token = localStorage.getItem("token");

        // Gọi lại API sau khi refresh token thành công
        const response = await axios.post(
          `${baseUrl}/api/bill/create`,
          billData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const newQrCode = `${webHddtUrl}/${response.data.billId}`;
        setQrCodes((prevQrCodes) => ({
          ...prevQrCodes,
          [billNumber]: newQrCode,
        }));
        setQrCode(newQrCode);
      } else {
        console.error("Error:", error);
      }
    }
  };

  const handleAddBill = () => {
    setBill((prevBill) => {
      const newBillNumber =
        prevBill.length === 0 ? 1 : prevBill[prevBill.length - 1] + 1;

      // Initialize the retailer and store for the new bill with all required fields
      setBillDetails((prevDetails) => ({
        ...prevDetails,
        [newBillNumber]: {
          retailerId: "",
          storeId: "",
          stores: [],
          products: [],
        }, // Đảm bảo có tất cả các thuộc tính
      }));

      return [...prevBill, newBillNumber];
    });
  };

  const handleDeleteBill = (billNumber: number) => {
    setBill((prevBill) => {
      const newBill = prevBill.filter((item) => item !== billNumber);
      return newBill.map((_, index) => index + 1);
    });
  };

  const handleDuplicateBill = (billNumber: number) => {
    setBill((prevBills) => {
      const newBillNumber = Math.max(...prevBills) + 1;

      setProducts((prevProducts) => ({
        ...prevProducts,
        [newBillNumber]: [...(products[billNumber] || [])],
      }));

      setBillDetails((prevDetails) => ({
        ...prevDetails,
        [newBillNumber]: { ...prevDetails[billNumber] }, // Sao chép retailerId và storeId từ bill gốc
      }));

      return [...prevBills, newBillNumber];
    });
  };

  const handleSelectRetailer = async (value: string) => {
    const newStores = await fetchStoresByRetailerId(value);

    setBillDetails((prevDetails) => ({
      ...prevDetails,
      [billIdActive]: {
        ...prevDetails[billIdActive], // Giữ lại thông tin retailerId và storeId hiện tại
        retailerId: value, // Cập nhật retailerId mới
        stores: newStores, // Cập nhật stores với danh sách mới
        storeId: "", // Reset storeId khi đổi retailer
      },
    }));
  };

  const handleSelectStore = (value: string) => {
    setBillDetails((prevDetails) => ({
      ...prevDetails,
      [billIdActive]: {
        ...prevDetails[billIdActive],
        storeId: value, // Cập nhật storeId
      },
    }));
  };

  const fetchRetailers = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `${baseUrl}/api/retailer/get-list-retailers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRetailers(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchRetailers();
  }, []);

  const fetchStoresByRetailerId = async (
    retailerId: string
  ): Promise<Store[]> => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${baseUrl}/api/store/get-stores-by-retailerId/${retailerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
        }
      );

      // Giả định dữ liệu trả về là mảng các cửa hàng
      return response.data as Store[]; // Trả về mảng các cửa hàng
    } catch (error) {
      console.error("Error fetching stores:", error);
      setErrorBranch("Không thể lấy danh sách cửa hàng.");
      return []; // Trả về mảng rỗng nếu có lỗi
    }
  };

  useEffect(() => {
    if (qrCodes[billIdActive]) {
      setQrCode(qrCodes[billIdActive]);
    } else {
      setQrCode("");
    }
  }, [billIdActive, qrCodes]);

  const handleViewQrCodeWrapper = () => {
    handleViewQrCode(billIdActive); // billNumber phải được xác định trong ngữ cảnh
  };

  return (
    <div className="bg-[#f9f0ff] h-screen px-4 py-4 xl:max-w-[1920px] w-full mx-auto xl:px-20">
      <div className="flex justify-between items-center mb-5">
        <div
          className={`text-white flex cursor-pointer items-center gap-x-2 p-2 rounded-lg border w-fit bg-gradient-custom`}
          onClick={() => navigate("/")}
          onMouseLeave={() => setAnimationback(false)}
          onMouseMove={() => setAnimationback(true)}
        >
          <ArrowLeft
            className={`${animationback ? "animation-icon" : ""} relative`}
          />
          <p>Quay lại danh sách</p>
        </div>
      </div>
      <div className="flex items-center justify-center mb-5">
        <h2 className="flex-grow text-center bg-gradient-to-r from-[#F21472] to-[#6C24F6] bg-clip-text text-transparent font-bold">
          Tạo Hóa Đơn
        </h2>
      </div>
      <div className="flex justify-between">
        <div className="w-2/12 flex flex-col rounded-lg">
          {bill.map((item) => (
            <ItemBill
              key={item}
              billNumber={item}
              onClick={() => setBillIdActive(item)}
              handleDelete={() => handleDeleteBill(item)}
              handleDuplicate={() => handleDuplicateBill(item)}
              active={item === billIdActive}
            />
          ))}
          <Button className="mt-6 w-fit self-center" onClick={handleAddBill}>
            <SquarePlus strokeWidth={1.5} /> Thêm Bill
          </Button>
        </div>
        <div className="w-10/12 flex">
          {billIdActive && (
            <div className="w-4/5 pt-4 pb-4 px-6 bg-white rounded-r-lg">
              <div className="flex justify-between items-center">
                <div className="flex justify-between items-center gap-[4.5rem]">
                  <Select
                    value={activeBillDetails.retailerId}
                    onValueChange={(value) => handleSelectRetailer(value)}
                  >
                    <SelectTrigger className="w-[190px] mt-4">
                      <SelectValue placeholder="Lựa chọn nhà bán lẻ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {retailers.map((retailer) => (
                          <SelectItem
                            key={retailer.retailerId}
                            value={retailer.retailerId.toString()}
                          >
                            {retailer.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <Select
                    disabled={!activeBillDetails.retailerId}
                    value={activeBillDetails.storeId}
                    onValueChange={(value) => handleSelectStore(value)}
                  >
                    <SelectTrigger className="w-[190px] mt-4">
                      <SelectValue placeholder="Lựa chọn cửa hàng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {activeBillDetails.stores.map((store) => (
                          <SelectItem
                            key={store.storeId}
                            value={store.storeId.toString()} // Sử dụng storeId
                          >
                            {store.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errorBranch && (
                    <p className="text-red-500 pt-5 text-xs">*{errorBranch}</p>
                  )}
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="bg-gradient-to-r from-[#F21472] to-[#6C24F6] rounded-full w-fit h-fit p-3 ml-auto cursor-pointer"
                        onClick={handleResetField}
                      >
                        <RotateCcw className="text-white" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Reset</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Button className="mt-4" onClick={addProduct}>
                Thêm sản phẩm
              </Button>
              <Table className="my-4 shadow-lg">
                {/* Đầu bảng sản phẩm */}
                <TableHeader className="bg-gradient-custom">
                  <TableRow>
                    <TableHead className="w-2/12 text-white rounded-tl-lg">
                      Tên sản phẩm
                    </TableHead>
                    <TableHead className="w-2/12 text-white">Sku</TableHead>
                    <TableHead className="w-2/12 text-white">Đơn giá</TableHead>
                    <TableHead className="w-2/12 text-white">
                      Số lượng
                    </TableHead>
                    <TableHead className="w-2/12 text-white">
                      Giảm giá
                    </TableHead>
                    <TableHead className="w-2/12 text-white">
                      Thành tiền
                    </TableHead>
                    <TableHead className=" text-white rounded-tr-lg"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(products[billIdActive] || []).map((product, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Input
                          value={product.name}
                          onChange={(e) =>
                            handleProductChange(
                              billIdActive,
                              index,
                              "name",
                              e.target.value
                            )
                          }
                          placeholder="Tên sản phẩm"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={product.sku}
                          onChange={(e) =>
                            handleProductChange(
                              billIdActive,
                              index,
                              "sku",
                              e.target.value
                            )
                          }
                          placeholder="Mã Sku"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={product.unitPrice}
                          onChange={(e) =>
                            handleProductChange(
                              billIdActive,
                              index,
                              "unitPrice",
                              e.target.value
                            )
                          }
                          placeholder="Đơn giá"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={product.amount}
                          onChange={(e) =>
                            handleProductChange(
                              billIdActive,
                              index,
                              "amount",
                              e.target.value
                            )
                          }
                          placeholder="Số lượng"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={product.discount}
                          onChange={(e) =>
                            handleProductChange(
                              billIdActive,
                              index,
                              "discount",
                              e.target.value
                            )
                          }
                          placeholder="Giảm giá"
                        />
                      </TableCell>
                      <TableCell className="text-lg">
                        {product.total}{"  "}
                        <span className="font-semibold text-xs">VNĐ</span>
                      </TableCell>
                      <TableCell>
                        <Trash2
                          onClick={() => removeProduct(index)}
                          className=" cursor-pointer text-gray-500 hover:text-red-500"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={5}>Tổng giảm giá</TableCell>
                    <TableCell className="text-right">
                      {activeProducts.reduce(
                        (acc, product) =>
                          acc + product.discount * product.amount,
                        0
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={5}>Thành tiền</TableCell>
                    <TableCell className="text-right">
                      {activeProducts.reduce(
                        (acc, product) => acc + product.total,
                        0
                      )}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
              {errorProduct && (
                <p className="text-red-500 pt-5 text-xs">*{errorProduct}</p>
              )}
              <Button className="float-end" onClick={handleViewQrCodeWrapper}>
                Tạo hóa đơn
              </Button>
            </div>
          )}
          <div className="w-1/5 bg-white">
            <div className="flex flex-col justify-center pt-4 pr-4">
              {qrCode ? (
                <div className="flex flex-col mt-3">
                  <QRCode
                    className="mt-3"
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={qrCode}
                    viewBox={`0 0 256 256`}
                  />
                  <div className="flex mt-3">
                    <div className="border border-blue-400 px-2 py-2 w-[80%] rounded-tl-xl rounded-bl-xl">
                      <p className="block w-full whitespace-nowrap overflow-hidden text-ellipsis">
                        {qrCode}
                      </p>
                    </div>
                    <Link
                      to={qrCode}
                      target="_blank"
                      className="bg-gradient-custom text-sm text-white w-[20%] flex justify-center items-center rounded-tr-xl rounded-br-xl cursor-pointer"
                    >
                      Go to
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center mt-3">
                  <ScanQrCode
                    className={`w-[100%] h-[100%] mt-3 ${
                      loading ? "animate-colorChange" : "text-black"
                    }`}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateMultiBill;
