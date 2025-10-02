"use client";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { ClipboardList, Gift } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill-new");
    const Quill = (await import("quill")).default;

    // register custom icons
    const icons = Quill.import("ui/icons") as any;
    icons["requirement"] = renderToStaticMarkup(<ClipboardList size={18} />);
    icons["benefit"] = renderToStaticMarkup(<Gift size={18} />);

    return RQ;
  },
  { ssr: false }
);

interface ITextEditor {
  value: string;
  setValue: (value: string) => void;
  profile: boolean;
}

export default function TextEditor({ value, setValue, profile }: ITextEditor) {
  const modulesDescription = {
    toolbar: {
      container: [
        ["bold", "italic", "underline", "strike"],
        [{ size: ["small", false, "large", "huge"] }],
        // ["requirement", "benefit"], // custom button
        [{ header: [1, 2, 3, false] }],
        [{ list: "ordered" }, { list: "bullet" },
          //  { list: "check" }
        ],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ align: [] }, { direction: "rtl" }],
        // [{ color: [] }, { background: [] }],
        ["blockquote", "code-block"],
        ["link", "video"],
        ["clean"],
      ],
      // ini custom toolbar
      handlers: {
        // requirement: function (this: any) {
        //   const editor = this.quill;
        //   editor.insertText(editor.getLength() - 1, "\nRequirements:\n");
        //   editor.formatLine(editor.getLength() - 1, 1, { list: "bullet" });
        // },
        // benefit: function (this: any) {
        //   const editor = this.quill;
        //   editor.insertText(editor.getLength() - 1, "\nBenefits:\n");
        //   editor.formatLine(editor.getLength() - 1, 1, { list: "bullet" });
        // },
        // image: function (this: any) {
        //   const editor = this.quill;
        //   const url = prompt("Enter image URL"); // bisa diganti modal custom
        //   if (!url) return;

        //   const width = prompt("Enter image width (px)", "400");
        //   const height = prompt("Enter image height (px)", "300");

        //   const range = editor.getSelection(true);
        //   editor.insertEmbed(range.index, "image", url, "user");

        //   // Atur ukuran setelah insert
        //   setTimeout(() => {
        //     const img = editor.root.querySelector(`img[src="${url}"]`) as HTMLImageElement;
        //     if (img) {
        //       img.width = width ? parseInt(width) : 400;
        //       img.height = height ? parseInt(height) : 300;
        //     }
        //   }, 100);
        // },
        // image: function (this: any) {
        //   const editor = this.quill;
        //   const url = prompt("Enter image URL:");
        //   if (!url) return;

        //   const range = editor.getSelection(true);
        //   editor.insertEmbed(range.index, "image", url, "user");
        // },
      },
    },
  };

  const modulesProfile = {
    toolbar: {
      container: [
        ["bold", "italic", "underline", "strike"],
        [{ header: [1, 2, 3, false] }],
        // [{ color: [] }, { background: [] }],
        [{ list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ align: [] }, { direction: "rtl" }],
        ["link"],
        ["clean"],
      ],
    },
  };
  return (
    <div className="my-2">
      <ReactQuill
        theme="snow"
        value={value}
        modules={profile ? modulesProfile : modulesDescription}
        onChange={setValue}
        placeholder="Write Something..."
      />
    </div>
  );
}
