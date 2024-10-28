import { useState } from "react";
import Container from "@/components/container";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
function CreateMultiBill() {
  const [products, setProducts] = useState<{ [key: number]: Product[] }>({});
  const [errorBranch, setErrorBranch] = useState<string>("");
  const [errorProduct, setErrorProduct] = useState<string>("");
  const [retailerId, setRetailerId] = useState<string>("");
  const [animationback, setAnimationback] = useState(false);
  const [qrCode, setQrCode] = useState<string>("");
  const [bill, setBill] = useState<number[]>([1]);
  const [billIdActive, setBillIdActive] = useState<number>(1);
  const navigate = useNavigate();
  const activeProducts = products[billIdActive] || [
    { name: "", unitPrice: 0, amount: 1, discount: 0, total: 0 },
  ];

  const handeResetField = () => {
    setRetailerId("");
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
    if (!retailerId) {
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

    // Tạo dữ liệu cho từng bill và tổng hợp thông tin để lưu
    const billDataList: BillData[] = bill.map((billId) => {
      const billProducts = products[billId] || [];
      return {
        retailerId,
        products: billProducts,
        totalDiscount: billProducts.reduce(
          (acc, product) => acc + product.discount * product.amount,
          0
        ),
        total: billProducts.reduce((acc, product) => acc + product.total, 0),
      };
    });

    console.log(billDataList);

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

  const handleAddBill = () => {
    setBill((prevBill) => [...prevBill, prevBill[prevBill.length - 1] + 1]);
  };

  const handleDeleteBill = (billNumber: number) => {
    setBill((prevBill) => {
      const newBill = prevBill.filter((item) => item !== billNumber);
      return newBill.map((_, index) => index + 1);
    });
  };

  return (
    <Container>
      <div
        className={`${
          animationback
            ? "text-gray-900 border-gray-500"
            : "text-gray-500 border-gray-300"
        } flex mb-3  cursor-pointer items-center gap-x-2 p-2 rounded-lg border  w-fit`}
        onClick={() => navigate("/")}
        onMouseLeave={() => setAnimationback(false)}
        onMouseMove={() => setAnimationback(true)}
      >
        <ArrowLeft
          className={`${animationback ? "animation-icon" : ""} relative`}
        />
        <p>Quay lại danh sách</p>
      </div>
      <div className="flex border border-gray-400">
        <div className="w-2/12 pl-3">Bill</div>
        <div className="w-10/12 flex justify-between px-10">
          <p>Tạo sản phẩm</p>
          <Button onClick={handleSubmit}>Save</Button>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="w-2/12 border-r border-gray-500 flex flex-col px-3 pt-4">
          {bill.map((item) => (
            <ItemBill
              key={item}
              billNumber={item}
              onClick={() => setBillIdActive(item)}
              handleDelete={() => handleDeleteBill(item)}
              active={item === billIdActive}
            />
          ))}
          <Button className="w-1/2 mt-2" onClick={handleAddBill}>
            <SquarePlus strokeWidth={1.5} /> Thêm Bill
          </Button>
        </div>
        <div className="w-10/12 flex px-8">
          {billIdActive && (
            <div className="w-3/4">
              <div className="flex justify-between items-center my-4">
                <div className="flex flex-col items-center gap-4">
                  <Label htmlFor="store">Lựa chọn cửa hàng</Label>
                  <Select
                    value={retailerId}
                    onValueChange={(value) => setRetailerId(value)}
                  >
                    <SelectTrigger className="w-80">
                      <SelectValue placeholder="Lựa chọn cửa hàng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="1">Coopmart</SelectItem>
                        <SelectItem value="2">GS25</SelectItem>
                        <SelectItem value="3">Circle K</SelectItem>
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
                        className=" bg-sky-500 rounded-full w-fit h-fit p-3 ml-auto cursor-pointer"
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
              <Button onClick={addProduct}>Thêm sản phẩm</Button>
              <Table className="mt-4">
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
            </div>
          )}
          <div className="w-1/4">
            <div className="flex flex-col justify-center px-10 mt-[20%]">
              <h4 className="text-center">Qr code</h4>
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
                      className="bg-gradient-custom w-[20%] flex justify-center items-center rounded-tr-xl rounded-br-xl cursor-pointer"
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
    </Container>
  );
}

export default CreateMultiBill;
