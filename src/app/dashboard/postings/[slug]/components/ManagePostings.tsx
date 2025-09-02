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
import { EllipsisVertical } from "lucide-react";
import { useRouter } from "next/navigation";

type Job = {
  slug: string;
};

const ManagePosting = ({ slug }: Job) => {
  const [openDelete, setOpenDelete] = useState(false);
  const router = useRouter();

  const handleDelete = () => {
    console.log("Delete job id:");
    setOpenDelete(false);
    // TODO: panggil API delete job
  };

  return (
    <>
      {/* Dropdown titik tiga */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="absolute right-2 top-6 hover:bg-indigo-500 hover:rounded-full p-2">
            <EllipsisVertical size={30} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              router.push(`/dashboard/postings/manage/edit/${slug}`);
            }}
            className="py-2 text-lg"
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpenDelete(true)}
            className="text-red-600 text-lg py-2"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modal confirm delete */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This action cannot be undone. The job posting <b>{slug}</b> will be
            permanently deleted.
          </p>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpenDelete(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ManagePosting;
