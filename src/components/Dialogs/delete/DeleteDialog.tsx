import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>;
  message: string;
  title?: string;
}

export default function DeleteDialog({ 
  isOpen, 
  onClose, 
  onDelete, 
  message,
  title = "Confirm Deletion" 
}: DeleteDialogProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const handleDelete = async () => {
    setIsLoading(true);
    await onDelete();
    onClose();
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-white">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={isLoading} onClick={handleDelete} className="bg-red-500 text-white hover:bg-red-600">
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
