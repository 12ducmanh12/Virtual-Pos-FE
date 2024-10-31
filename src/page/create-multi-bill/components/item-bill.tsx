import { Trash2 } from "lucide-react";

function ItemBill({ billNumber, onClick, active, handleDelete }: any) {
  return (
    <div>
      <div
        className={`flex justify-between rounded-l-lg px-5 py-3 ${active ? "bg-white" : "bg-transparent"}`}
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
