import { useState } from "react";
import Container from "@/components/container";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { v4 as uuidv4 } from "uuid";
import QRCode from "react-qr-code";
import { Trash2 } from "lucide-react";
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
import { Button } from "@/components/ui/button";

function CreateBill() {
  const [products, setProducts] = useState([
    { name: "", price: 0, quantity: 1, discount: 0, total: 0 },
  ]);
  const [store, setStore] = useState("");
  const [qrCode, setQrCode] = useState("");
  const billID = uuidv4();
  const handleProductChange = (index: number, field: string, value: string) => {
    const updatedProducts: any = [...products];
    updatedProducts[index][field] =
      field === "price" || field === "quantity" || field === "discount"
        ? parseFloat(value)
        : value;

    // Tính lại tổng tiền cho mỗi sản phẩm
    updatedProducts[index].total =
      (updatedProducts[index].price - updatedProducts[index].discount) *
      updatedProducts[index].quantity;

    setProducts(updatedProducts);
  };

  const addProduct = () => {
    setProducts([
      ...products,
      { name: "", price: 0, quantity: 1, discount: 0, total: 0 },
    ]);
  };

  const removeProduct = (index: number) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(qrCode)
      .then(() => {
        alert("Copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  const handleSubmit = async () => {
    const billData = {
      store,
      products,
      totalDiscount: products.reduce(
        (acc, product) => acc + product.discount * product.quantity,
        0
      ),
      totalAmount: products.reduce((acc, product) => acc + product.total, 0),
    };

    try {
      const response = await fetch("API_ENDPOINT_URL", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(billData),
      });

      if (response.ok) {
        alert("Đơn hàng đã được gửi thành công!");
      } else {
        alert("Có lỗi xảy ra!");
      }
    } catch (error) {
      console.error("Error submitting bill:", error);
      alert("Không thể gửi đơn hàng.");
    }
  };

  return (
    <Container>
      <div className="flex flex-row">
        <div className="w-3/4">
          <h4>Tạo đơn hàng</h4>
          <div className="flex flex-col gap-y-4 mt-12">
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="email">BillId</Label>
              <Input
                disabled
                type="id"
                placeholder={billID}
                className="bg-gray-100 text-white w-80"
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="store">Lựa chọn cửa hàng</Label>
              <Select onValueChange={(value) => setStore(value)}>
                <SelectTrigger className="w-80">
                  <SelectValue placeholder="Lựa chọn cửa hàng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="coopmart">Coopmart</SelectItem>
                    <SelectItem value="GS25">GS25</SelectItem>
                    <SelectItem value="Thai Son">Thai Son</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-3/12">Tên sản phẩm</TableHead>
                <TableHead className="w-2/12">Đơn giá</TableHead>
                <TableHead className="w-2/12">Số lượng</TableHead>
                <TableHead className="w-2/12">Giảm giá</TableHead>
                <TableHead className="w-2/12">Thành tiền</TableHead>
                <TableHead className="w-1/12">Actions</TableHead>
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
                      value={product.price}
                      onChange={(e) =>
                        handleProductChange(index, "price", e.target.value)
                      }
                      placeholder="Đơn giá"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={product.quantity}
                      onChange={(e) =>
                        handleProductChange(index, "quantity", e.target.value)
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
                      // color="red"
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
                      (acc, product) =>
                        acc + product.discount * product.quantity,
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
          <div className="flex justify-between">
            <Button
              className="mt-4 bg-blue-500 text-white px-4 py-2"
              onClick={addProduct}
            >
              Thêm sản phẩm
            </Button>
            <Button
              className="mt-4 bg-blue-500 text-white px-4 py-2"
              onClick={() => setQrCode(`https://sanbox-demo/${billID}`)}
            >
              Generate QR code
            </Button>
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
                  <div
                    onClick={handleCopy}
                    className="bg-gray-400 w-[20%] flex justify-center items-center rounded-tr-xl rounded-br-xl cursor-pointer"
                  >
                    Copy
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      <div>
        <button
          className="mt-4 bg-green-500 text-white px-4 py-2"
          onClick={handleSubmit}
        >
          Save
        </button>
      </div>
    </Container>
  );
}

export default CreateBill;
