"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import Quill from "quill";
import { ClipboardList, Gift } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

// register custom icon
const icons = Quill.import("ui/icons") as any;
icons["requirement"] = renderToStaticMarkup(<ClipboardList size={18} />);
icons["benefit"] = renderToStaticMarkup(<Gift size={18} />); // bisa ganti svg/icon

interface IDescriptionCompany {
  value: string;
  setValue: (value: string) => void;
  editing: boolean;
  showEdit: boolean;
  profile: boolean;
}

export default function TextEditor({
  editing,
  value,
  setValue,
  showEdit,
  profile,
}: IDescriptionCompany) {
  const modulesDescription = {
    toolbar: {
      container: [
        [{ font: [] }],
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["link"],
        ["clean"],
        ["requirement", "benefit"], // custom button
      ],
      handlers: {
        requirement: function (this: any) {
          const editor = this.quill;
          editor.insertText(editor.getLength() - 1, "\nRequirements:\n");
          editor.formatLine(editor.getLength() - 1, 1, { list: "bullet" });
        },
        benefit: function (this: any) {
          const editor = this.quill;
          editor.insertText(editor.getLength() - 1, "\nBenefits:\n");
          editor.formatLine(editor.getLength() - 1, 1, { list: "bullet" });
        },
      },
    },
  };

  const modulesProfile = {
    toolbar: {
      container: [
        [{ font: [] }],
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["link"],
        ["clean"],
        // custom button
      ],
    },
  };
  return (
    <div className="my-2">
      {editing && (
        <ReactQuill
          theme="snow"
          value={value}
          modules={profile ? modulesProfile : modulesDescription}
          onChange={setValue}
          placeholder="Write Something..."
        />
      )}
      {showEdit && (
        <div className="mt-2">
          {editing && (
            <span className="font-bold tracking-wider text-lg">Preview</span>
          )}
          <div
            className={`${
              editing ? "text-black" : "text-neutral-500"
            } border rounded-lg`}
          >
            <ReactQuill
              value={value}
              readOnly={true}
              theme="bubble"
              modules={{ toolbar: false }}
              className="preview"
            />
          </div>
        </div>
      )}
    </div>
  );
}
