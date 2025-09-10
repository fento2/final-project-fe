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
import { useParams, useRouter } from "next/navigation";
import { apiCall } from "@/helper/apiCall";
import { Dots_v2 } from "@/components/ui/spinner";
import { useToast } from "@/components/basic-toast";

type Job = {
  slug: string;
};

const ManagePosting = ({ slug }: Job) => {
  const [openDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(false)
  const router = useRouter();
  const toast = useToast();

  const handleDelete = async () => {
    try {
      setLoading(true)
      const { data } = await apiCall.delete(`/postings/delete/${slug}`)
      if (data.success) {
        setOpenDelete(false)
        toast.success(data.message)
        router.replace('/dashboard/postings')
      }
    } catch (error) {
      toast.error('faild to delete')
      console.log(error)

    } finally {
      setLoading(false)
    }
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
      <Dialog open={openDelete} onOpenChange={setOpenDelete} >
        <DialogContent >
          <DialogHeader >

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
              {!loading ? 'Delete' : <Dots_v2 />}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ManagePosting;
