import Container from "@/components/container";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];

function Home() {
  return (
    <Container>
      <Table>
        <TableHeader className="bg-blue-400 text-white">
          <TableRow>
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
          {invoices.map((invoice) => (
            <TableRow key={invoice.invoice}>
              <TableCell className="font-medium text-center">
                {invoice.invoice}
              </TableCell>
              <TableCell className="text-center">
                {invoice.paymentStatus}
              </TableCell>
              <TableCell className="text-center">
                {invoice.paymentMethod}
              </TableCell>
              <TableCell className="text-center">
                {invoice.totalAmount}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}
export default Home;
