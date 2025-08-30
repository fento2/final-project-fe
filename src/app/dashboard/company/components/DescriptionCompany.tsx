"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface IDescriptionCompany {
  editing: boolean;
}
export default function DescriptionCompany({ editing }: IDescriptionCompany) {
  const [value, setValue] = useState(`
    <h2><b>Judul Artikel Default</b></h2>
    <p>
      Ini adalah <b>default content</b> yang sudah ada sejak awal.
      Kamu bisa mengedit langsung di editor ini.
    </p>
    <p>
      Contoh paragraf kedua dengan teks <i>italic</i> dan
      <u>underline</u>.
    </p>
    <blockquote>
      “Ini contoh kutipan default.”
    </blockquote>
  `);
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
        {editing && <span className="font-bold tracking-widest">Preview</span>}
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
