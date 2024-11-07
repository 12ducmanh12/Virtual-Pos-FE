import React from "react";
import { Button } from "@/components/ui/button";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 shadow-lg" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
        <p className="text-sm font-semibold">Are you sure you want to delete this bill?</p>
        <div className="flex justify-end mt-6 space-x-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm}>Confirm Delete</Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;