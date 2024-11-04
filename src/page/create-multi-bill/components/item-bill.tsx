import { Trash2, Copy } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ItemBill({ billNumber, onClick, active, handleDelete, handleDuplicate }: any) {
  return (
    <div>
      <div
        className={`flex justify-between items-center rounded-l-lg px-5 py-3 ${active ? "bg-white" : "bg-transparent"}`}
        onClick={onClick}
      >
        <p className="font-semibold">Bill {billNumber}</p>
        <Copy
          className="text-green-500 text-sm cursor-pointer"
          strokeWidth={2}
          size={20}
          onClick={(e) => {
            e.stopPropagation();
            handleDuplicate();
          }}
        />
        <Trash2
          className="text-red-500 text-sm cursor-pointer"
          strokeWidth={2}
          size={20}
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
        />
      </div>
    </div>
  );
}

export default ItemBill;
