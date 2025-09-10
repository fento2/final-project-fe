"use client";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// Import ReactQuill secara dynamic supaya SSR tidak error
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill-new");
    return RQ;
  },
  { ssr: false }
);

interface IReadOnlyQuill {
  value: string;
}

export default function ReadOnlyQuill({ value }: IReadOnlyQuill) {
  return (
    <div className="ql-readonly ql-snow">
      <ReactQuill
        theme="bubble"
        value={value}
        readOnly={true}
        modules={{ toolbar: false }}
      />
    </div>

  );
}
