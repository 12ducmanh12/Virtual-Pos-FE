import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface Product {
  name: string;
  price: number;
  quantity: number;
}

interface BillResponse {
  url: string;
  billId: string;
  time_stamp: number;
}

const App: React.FC = () => {
  const [productName, setProductName] = useState<string>('');
  const [price, setPrice] = useState<number | ''>('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [billURL, setBillURL] = useState<string>('');

  // Hàm thêm sản phẩm vào danh sách
  const handleAddProduct = () => {
    if (productName && price !== '' && quantity !== '') {
      const newProduct: Product = {
        name: productName,
        price: Number(price),
        quantity: Number(quantity),
      };
      setProducts([...products, newProduct]);
      setProductName('');
      setPrice('');
      setQuantity('');
    }
  };

  // Hàm gửi yêu cầu tạo hóa đơn
  const handleGenerateBill = () => {
    if (products.length > 0) {
      const time_stamp = Date.now();
      const billId = Math.random().toString(36).substr(2, 9); // Tạo billId ngẫu nhiên

      const billData = { billId, time_stamp, products };

      // Gửi dữ liệu đến API để tạo URL bill
      fetch('http://localhost:5281/api/bills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(billData),
      })
        .then(response => response.json())
        .then((data: BillResponse) => setBillURL(data.url)); // Nhận URL từ backend
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row items-center justify-center bg-gray-100 p-4 space-x-4">
      <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Tạo Bill</h1>
        <input
          type="text"
          placeholder="Tên sản phẩm"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="number"
          placeholder="Giá tiền"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="number"
          placeholder="Số lượng"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        />

        <button
          onClick={handleAddProduct}
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition mb-4 w-full"
        >
          Thêm sản phẩm
        </button>

        <ul className="list-disc mb-6">
          {products.map((product, index) => (
            <li key={index}>
              {product.name} - Giá: {product.price} - Số lượng: {product.quantity}
            </li>
          ))}
        </ul>

        <button
          onClick={handleGenerateBill}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition w-full"
        >
          Tạo Bill
        </button>
      </div>

      <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
        {billURL && (
          <div className="mt-6 text-center">
            <p className="mb-2">
              Đường dẫn bill: <a href={billURL} className="text-blue-500 underline">{billURL}</a>
            </p>
            <QRCodeSVG value={billURL} />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
