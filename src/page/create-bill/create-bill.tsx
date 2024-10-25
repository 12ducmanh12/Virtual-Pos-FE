import { useState } from "react";
import Container from "@/components/container";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import QRCode from "react-qr-code";
import { ArrowLeft, RotateCcw, Trash2 } from "lucide-react";
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

function CreateBill() {
  const [products, setProducts] = useState([
    { name: "", unitPrice: 0, amount: 1, discount: 0, total: 0 },
  ]);
  const [errorBranch, setErrorBranch] = useState("");
  const [errorProduct, setErrorProduct] = useState("");
  const [retailerId, setRetailerId] = useState("");
  const [qrCode, setQrCode] = useState("");
  const navigate = useNavigate();
  const handleProductChange = (index: number, field: string, value: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedProducts: any = [...products];
    updatedProducts[index][field] =
      field === "unitPrice" || field === "amount" || field === "discount"
        ? parseFloat(value)
        : value;

    // Tính lại tổng tiền cho mỗi sản phẩm
    updatedProducts[index].total =
      (updatedProducts[index].unitPrice - updatedProducts[index].discount) *
      updatedProducts[index].amount;

    setProducts(updatedProducts);
  };

  const addProduct = () => {
    setProducts([
      ...products,
      { name: "", unitPrice: 0, amount: 1, discount: 0, total: 0 },
    ]);
  };

  const handeResetField = () => {
    setRetailerId("");
    setProducts([{ name: "", unitPrice: 0, amount: 1, discount: 0, total: 0 }]);
  };

  const removeProduct = (index: number) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  const handleSubmit = async () => {
    if (!retailerId) {
      setErrorBranch("Vui lòng chọn cửa hàng trước khi tạo đơn hàng.");
      return;
    }

    const hasEmptyProduct = products.some(
      (product) =>
        !product.name || product.unitPrice <= 0 || product.amount <= 0
    );

    if (hasEmptyProduct) {
      setErrorProduct("Vui lòng điền đầy đủ thông tin sản phẩm trước khi lưu.");
      return;
    }
    setErrorProduct("");
    setErrorBranch("");

    const billData = {
      retailerId,
      products,
      totalDiscount: products.reduce(
        (acc, product) => acc + product.discount * product.amount,
        0
      ),
      total: products.reduce((acc, product) => acc + product.total, 0),
    };
    console.log(billData);
    try {
      const response = await axios.post(
        "http://180.93.182.148:5000/api/bill/create",
        billData
      );
      setQrCode(
        `https://main.d1jsvpuea6rgcp.amplifyapp.com/bill/${response.data.billId}`
      );
    } catch (error) {
      console.error("Error:", error);
    }
    handeResetField();
  };
  const [animationback, setAnimationback] = useState(false);

  return (
    <Container>
      <div className="flex flex-row">
        <div className="w-3/4">
          <div
            className={`${
              animationback ? "text-gray-900 border-gray-500" : "text-gray-500 border-gray-300"
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
          <h4>Tạo đơn hàng</h4>
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

          <div className="flex flex-col">
            <div className="flex flex-col gap-y-2"></div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-y-2">
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
              </div>

              {/* Hiển thị lỗi bên cạnh Select */}
              {errorBranch && (
                <p className="text-red-500 pt-5 text-xs">*{errorBranch}</p>
              )}
            </div>
          </div>
          <Table className="mt-5">
            <TableHeader className="bg-gradient-custom">
              <TableRow>
                <TableHead className="w-3/12 text-white">
                  Tên sản phẩm
                </TableHead>
                <TableHead className="w-2/12 text-white">Đơn giá</TableHead>
                <TableHead className="w-2/12 text-white">Số lượng</TableHead>
                <TableHead className="w-2/12 text-white">Giảm giá</TableHead>
                <TableHead className="w-2/12 text-white">Thành tiền</TableHead>
                <TableHead className="w-1/12 text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input
                      value={product.name}
                      onChange={(e) =>
                        handleProductChange(index, "name", e.target.value)
                      }
                      placeholder="Tên sản phẩm"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={product.unitPrice}
                      onChange={(e) =>
                        handleProductChange(index, "unitPrice", e.target.value)
                      }
                      placeholder="Đơn giá"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={product.amount}
                      onChange={(e) =>
                        handleProductChange(index, "amount", e.target.value)
                      }
                      placeholder="Số lượng"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={product.discount}
                      onChange={(e) =>
                        handleProductChange(index, "discount", e.target.value)
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
                  {products
                    .reduce(
                      (acc, product) => acc + product.discount * product.amount,
                      0
                    )
                    .toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={5}>Thành tiền</TableCell>
                <TableCell className="text-right">
                  {products
                    .reduce((acc, product) => acc + product.total, 0)
                    .toFixed(2)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
          {errorProduct && (
            <p className="text-red-500 pt-5 text-xs">*{errorProduct}</p>
          )}
          <div className="flex justify-between">
            <Button
              className="mt-4 bg-blue-500 text-white px-4 py-2"
              onClick={addProduct}
            >
              Thêm sản phẩm
            </Button>
            <button
              className="mt-4 bg-green-500 text-white px-4 py-2"
              onClick={handleSubmit}
            >
              Save
            </button>
          </div>
        </div>
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
      <div></div>
    </Container>
  );
}

export default CreateBill;
