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
import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";

interface dataBillType {
  billId: number;
  retailerName: string;
  total: number;
}
function Home() {
  const [data, setData] = useState<dataBillType[]>([]);
  const [selectedBillId, setSelectedBillId] = useState<number | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setSelectedBillId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);

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
      <Link to="/create-bill" className="flex justify-end my-10">
        <Button>Create Bill</Button>
      </Link>
      <div className="border border-gray-400 p-4 rounded-lg drop-shadow-sm">
        <Table>
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
                <TableCell className="flex justify-center relative">
                  <div
                    className="relative bg-slate-200 rounded-xl gap-x-2 flex justify-center items-center w-32 h-8 cursor-pointer"
                    onClick={() => {
                      setSelectedBillId(
                        selectedBillId === invoice.billId
                          ? null
                          : invoice.billId
                      );
                    }}
                  >
                    <ScanQrCode />
                    <p className="text-sm">QR Code</p>
                  </div>

                  {selectedBillId === invoice.billId && (
                    <div
                      ref={modalRef}
                      className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 bg-white p-4 shadow-xl border rounded-lg z-10"
                      style={{ minWidth: "250px" }}
                    >
                      <QRCode
                        size={134}
                        style={{
                          height: "auto",
                          maxWidth: "100%",
                          width: "100%",
                          padding: "20px",
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
      </div>
    </Container>
  );
}

export default Home;
