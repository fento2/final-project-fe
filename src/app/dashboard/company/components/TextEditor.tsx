"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface IDescriptionCompany {
  value: string;
  setValue: (value: string) => void;
  editing: boolean;
}
export default function TextEditor({
  editing,
  value,
  setValue,
}: IDescriptionCompany) {
  const modules = {
    toolbar: [
      [{ font: [] }],
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link"],
      ["clean"],
    ],
  };

  return (
    <div className="my-2">
      {editing && (
        <ReactQuill
          theme="snow"
          value={value}
          modules={modules}
          onChange={setValue}
          placeholder="Write Something..."
        />
      )}
      <div className="mt-2">
        {editing && (
          <span className="font-bold tracking-wider text-lg">Preview</span>
        )}
        <div
          className={`p-3 border rounded-sm ${
            editing ? "text-black" : "text-neutral-500"
          }`}
        >
          <div dangerouslySetInnerHTML={{ __html: value }} />
        </div>
      </div>
    </div>
  );
}
