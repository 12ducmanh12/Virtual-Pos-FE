import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import QRCode from "react-qr-code";
import { ArrowLeft, RotateCcw, SquarePlus, Trash2 } from "lucide-react";
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

interface Product {
  name: string;
  unitPrice: number;
  amount: number;
  discount: number;
  total: number;
}

interface BillData {
  retailerId: string;
  products: Product[];
  totalDiscount: number;
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
  const [retailerId, setRetailerId] = useState<string>("");
  const [storeId, setStoreId] = useState<string>("");
  const [animationback, setAnimationback] = useState(false);
  const [qrCode, setQrCode] = useState<string>("");
  const [bill, setBill] = useState<number[]>([1]);
  const [billIdActive, setBillIdActive] = useState<number>(1);
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const navigate = useNavigate();
  const activeProducts = products[billIdActive] || [
    { name: "", unitPrice: 0, amount: 1, discount: 0, total: 0 },
  ];

  const handeResetField = () => {
    setRetailerId("");
    setStoreId("");
    setProducts({
      [billIdActive]: [
        { name: "", unitPrice: 0, amount: 1, discount: 0, total: 0 },
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
      { name: "", unitPrice: 0, amount: 1, discount: 0, total: 0 },
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

  const handleSubmit = async () => {
    // Kiểm tra nếu chưa chọn cửa hàng
    if (!retailerId && !storeId) {
      setErrorBranch("Vui lòng chọn cửa hàng trước khi tạo đơn hàng.");
      return;
    }

    // Kiểm tra từng bill và xác thực sản phẩm của mỗi bill
    const allBillsValid = bill.every((billId) => {
      const billProducts = products[billId] || [];
      // Kiểm tra nếu mảng billProducts trống
      if (billProducts.length === 0) {
        setErrorProduct("Vui lòng thêm ít nhất một sản phẩm cho mỗi đơn hàng.");
        return false;
      }
      // Kiểm tra nếu sản phẩm hợp lệ (name không rỗng, unitPrice > 0, amount > 0)
      return billProducts.every(
        (product) => product.name && product.unitPrice > 0 && product.amount > 0
      );
    });

    // Nếu không hợp lệ, không cho phép tiếp tục
    if (!allBillsValid) {
      return;
    }

    // Xóa thông báo lỗi khi tất cả đều hợp lệ
    setErrorProduct("");
    setErrorBranch("");

    // Gửi dữ liệu nếu hợp lệ (mở lại khi cần thiết)
    // try {
    //   const response = await axios.post(
    //     "http://180.93.182.148:5000/api/bill/create-multi",
    //     { bills: billDataList }
    //   );

    //   setQrCode(
    //     `https://main.d1jsvpuea6rgcp.amplifyapp.com/bill/${response.data.billIds.join(",")}`
    //   );
    //   handeResetField();
    // } catch (error) {
    //   console.error("Error:", error);
    // }
  };

  const handleViewQrCode = async () => {
    if (qrCodes[billIdActive]) {
      setQrCode(qrCodes[billIdActive]);
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

    const activeBillProducts = products[billIdActive] || [];
    if (
      activeBillProducts.length === 0 ||
      activeBillProducts.some(
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
      products: activeBillProducts,
      totalDiscount: activeBillProducts.reduce(
        (acc, product) => acc + product.discount * product.amount,
        0
      ),
      total: activeBillProducts.reduce(
        (acc, product) => acc + product.total,
        0
      ),
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://vpos.giftzone.vn/api/bill/import-invoice",
        billData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newQrCode = `https://web-hddt-giftzone-omega.vercel.app/bill/${response.data.billId}`;
      setQrCodes((prevQrCodes) => ({
        ...prevQrCodes,
        [billIdActive]: newQrCode,
      }));
      setQrCode(newQrCode);
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
          "https://vpos.giftzone.vn/api/bill/import-invoice",
          billData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const newQrCode = `https://web-hddt-giftzone-omega.vercel.app/bill/${response.data.billId}`;
        setQrCodes((prevQrCodes) => ({
          ...prevQrCodes,
          [billIdActive]: newQrCode,
        }));
        setQrCode(newQrCode);
      } else {
        console.error("Error:", error);
      }
    }
  };

  const handleAddBill = () => {
    setBill((prevBill) => [...prevBill, prevBill[prevBill.length - 1] + 1]);
  };

  const handleDeleteBill = (billNumber: number) => {
    setBill((prevBill) => {
      const newBill = prevBill.filter((item) => item !== billNumber);
      return newBill.map((_, index) => index + 1);
    });
  };

  useEffect(() => {
    const fetchRetailers = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          "https://vpos.giftzone.vn/api/retailer/get-list-retailers",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Thêm token vào header
            },
          }
        );
        setRetailers(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchRetailers();
  }, []);

  const fetchStoresByRetailerId = async (retailerId: unknown) => {
    try {
      const response = await axios.get(
        `https://vpos.giftzone.vn/api/store/get-stores-by-retailerId/${retailerId}`
      );
      setStores(response.data); // Giả định dữ liệu trả về là mảng các cửa hàng
    } catch (error) {
      console.error("Error fetching stores:", error);
      setErrorBranch("Không thể lấy danh sách cửa hàng.");
    }
  };

  useEffect(() => {
    // Khi chuyển sang bill khác, lấy mã QR đã lưu (nếu có) và đặt vào qrCode
    if (qrCodes[billIdActive]) {
      setQrCode(qrCodes[billIdActive]);
    } else {
      setQrCode(""); // Xóa mã QR nếu chưa được tạo cho bill này
    }
  }, [billIdActive, qrCodes]);

  return (
    <div className="bg-[#f9f0ff] h-screen px-4 py-4 xl:max-w-[1920px] w-full mx-auto xl:px-20">
      <div className="flex justify-between items-center my-10">
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
        <Button onClick={handleSubmit}>Save</Button>
      </div>
      <div className="flex justify-between">
        <div className="w-2/12 flex flex-col rounded-lg">
          {bill.map((item) => (
            <ItemBill
              key={item}
              billNumber={item}
              onClick={() => setBillIdActive(item)}
              handleDelete={() => handleDeleteBill(item)}
              active={item === billIdActive}
            />
          ))}
          <Button className="w-1/2 mt-6" onClick={handleAddBill}>
            <SquarePlus strokeWidth={1.5} /> Thêm Bill
          </Button>
        </div>
        <div className="w-10/12 flex">
          {billIdActive && (
            <div className="w-3/4 pt-4 pb-4 px-6 bg-white rounded-r-lg">
              <div className="flex justify-between items-center">
                <div className="flex justify-between items-center gap-[4.5rem]">
                  <Select
                    value={retailerId}
                    onValueChange={(value) => {
                      setRetailerId(value);
                      // Gọi API để lấy danh sách cửa hàng khi có lựa chọn
                      fetchStoresByRetailerId(value);
                    }}
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
                    disabled={!retailerId}
                    value={storeId}
                    onValueChange={(value) => {
                      setStoreId(value);
                      // Gọi API để lấy danh sách cửa hàng khi có lựa chọn
                      fetchStoresByRetailerId(value);
                    }}
                  >
                    <SelectTrigger className="w-[190px] mt-4">
                      <SelectValue placeholder="Lựa chọn cửa hàng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {stores.map((store) => (
                          <SelectItem
                            key={store.storeId}
                            value={store.storeId.toString()}
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
                        className="bg-sky-500 rounded-full w-fit h-fit p-3 ml-auto cursor-pointer"
                        onClick={handeResetField}
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
                    <TableHead className="w-3/12 text-white rounded-tl-lg">
                      Tên sản phẩm
                    </TableHead>
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
                    <TableHead className="w-1/12 text-white rounded-tr-lg">
                      Actions
                    </TableHead>
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
                      {/* Các ô nhập khác */}
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
                      <TableCell>{product.total.toFixed(2)}</TableCell>
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
                      {activeProducts
                        .reduce(
                          (acc, product) =>
                            acc + product.discount * product.amount,
                          0
                        )
                        .toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={5}>Thành tiền</TableCell>
                    <TableCell className="text-right">
                      {activeProducts
                        .reduce((acc, product) => acc + product.total, 0)
                        .toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
              {errorProduct && (
                <p className="text-red-500 pt-5 text-xs">*{errorProduct}</p>
              )}
              <Button className="float-end" onClick={handleViewQrCode}>
                Tạo hóa đơn
              </Button>
            </div>
          )}
          <div className="w-1/4 bg-white">
            <div className="flex flex-col justify-center pt-4 pr-4">
              {qrCode ? (
                <div className="flex flex-col mt-3">
                  <QRCode
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
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateMultiBill;
