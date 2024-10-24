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
import { ScanQrCode } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

interface dataBillType {
  billId: number;
  retailerName: string;
  total: number;
}
function Home() {
  const [data, setData] = useState<dataBillType[]>([]);
  const [selectedBillId, setSelectedBillId] = useState<number | null>(null);

  useEffect(() => {
    axios
      .get("http://180.93.182.148:5000/api/all-bill")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
    <Container>
      <Table className="relative rounded-lg">
        <TableHeader className="bg-blue-400 text-white rounded-lg">
          <TableRow className=" rounded-lg">
            <TableHead className="w-1/5 text-white text-center">
              Bill Id
            </TableHead>
            <TableHead className="w-2/5 text-white text-center">
              Tên cửa hàng
            </TableHead>
            <TableHead className="w-1/5 text-white text-center">
              Tổng tiền
            </TableHead>
            <TableHead className="w-1/5 text-white text-center">
              Qr Code
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((invoice) => (
            <TableRow key={invoice.billId}>
              <TableCell className="font-medium text-center">
                {invoice.billId}
              </TableCell>
              <TableCell className="text-center">
                {invoice.retailerName}
              </TableCell>
              <TableCell className="text-center">{invoice.total}</TableCell>
              <TableCell className=" text-center flex justify-center">
                <div
                  className="relative bg-slate-200 rounded-xl flex justify-center items-center w-32 h-8 cursor-pointer"
                  onClick={() => {
                    setSelectedBillId(
                      selectedBillId === invoice.billId ? null : invoice.billId
                    );
                  }}
                >
                  <ScanQrCode />
                  <p>QR Code</p>
                </div>
                {selectedBillId === invoice.billId && (
                  <div className="absolute top-full z-10 mt-2 bg-slate-200 p-7 shadow-xl">
                    {/* `absolute` để không ảnh hưởng đến layout */}
                    <QRCode
                      size={134}
                      style={{
                        height: "auto",
                        maxWidth: "100%",
                        width: "100%",
                      }}
                      value={`http://sanbox/bill/${invoice.billId}`}
                      viewBox={`0 0 256 256`}
                    />
                    <div className="flex mt-3">
                      <div className="border border-blue-400 px-2 py-2 w-[75%] rounded-tl-xl rounded-bl-xl">
                        <p className="block w-full whitespace-nowrap overflow-hidden text-ellipsis">
                          {`http://sanbox/bill/${invoice.billId}`}
                        </p>
                      </div>
                      <Link
                        to={`http://sanbox/bill/${invoice.billId}`}
                        target="_blank"
                        className="bg-gray-400 w-[25%] flex h-10 justify-center items-center rounded-tr-xl rounded-br-xl cursor-pointer"
                      >
                        Go to
                      </Link>
                    </div>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}

export default Home;
