"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Edit3, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiCall } from "@/helper/apiCall";
import { Dots_v2 } from "@/components/ui/spinner";
import { useToast } from "@/components/basic-toast";

type Job = {
  slug: string;
};

const ManagePosting = ({ slug }: Job) => {
  const [openDelete, setOpenDelete] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleDelete = async () => {
    try {
      setLoadingDelete(true);
      const { data } = await apiCall.delete(`/postings/delete/${slug}`);
      if (data.success) {
        setOpenDelete(false);
        toast.success(data.message);
        router.replace("/dashboard/postings");
      }
    } catch (error) {
      toast.error("Failed to delete");
      console.log(error);
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleEdit = async () => {
    setLoadingEdit(true);
    // Bisa pakai timeout untuk simulasi loading jika ingin cepat terlihat
    setTimeout(() => {
      router.push(`/dashboard/postings/manage/edit/${slug}`);
    }, 300);
  };

  return (
    <>
      {/* Dropdown titik tiga */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="absolute right-2 top-6 hover:bg-indigo-100 hover:rounded-full p-2 transition">
            <EllipsisVertical size={28} className="text-gray-600 hover:text-indigo-600" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-44" side="bottom" align="end">
          <DropdownMenuItem
            onClick={handleEdit}
            className="py-2 text-lg flex items-center gap-2 hover:bg-indigo-50 transition"
          >
            {loadingEdit ? <Dots_v2 /> : <><Edit3 size={18} /> Edit</>}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpenDelete(true)}
            className="py-2 text-lg flex items-center gap-2 text-red-600 hover:bg-red-50 transition"
          >
            <Trash2 size={18} /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modal confirm delete */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mt-2">
            This action cannot be undone. The job posting <b>{slug}</b> will be permanently deleted.
          </p>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpenDelete(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              {loadingDelete ? <Dots_v2 /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ManagePosting;
