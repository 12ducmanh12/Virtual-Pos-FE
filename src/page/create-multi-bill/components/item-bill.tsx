import { Trash2 } from "lucide-react";

function ItemBill({ billNumber, onClick, active, handleDelete }: any) {
  return (
    <div>
      <div
        className={`flex justify-between bg-blue-300 rounded-lg pl-4 pr-2 py-2 mb-3 ${
          active ? "border-2 border-red-500" : ""
        } `}
        onClick={onClick}
      >
        <p>Bill {billNumber}</p>
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
