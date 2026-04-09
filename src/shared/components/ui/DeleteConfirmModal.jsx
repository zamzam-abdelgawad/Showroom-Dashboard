import { Modal } from "./Modal";
import { Button } from "./Button";
import { AlertCircle } from "lucide-react";

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, isDeleting, itemName, title = "Confirm Deletion" }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col items-center justify-center text-center py-4">
        <div className="bg-red-100 p-3 rounded-full mb-4">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <h4 className="text-lg font-bold text-gray-900 mb-2">Are you sure?</h4>
        <p className="text-sm text-gray-500 mb-6 max-w-sm">
          Are you sure you want to delete {itemName ? <span className="font-semibold text-gray-800">'{itemName}'</span> : "this item"}? This action cannot be undone.
        </p>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none w-full sm:w-24" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="danger" className="flex-1 sm:flex-none w-full sm:w-24" onClick={onConfirm} isLoading={isDeleting}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
