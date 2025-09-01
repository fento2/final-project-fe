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

interface IprintTextEditor {
  value: string;
}

export default function PrintTextEditor({ value }: IprintTextEditor) {
  return (
    <div className="my-2">
      <div>
        <ReactQuill
          value={value}
          readOnly={true}
          theme="bubble"
          modules={{ toolbar: false }}
          className="preview"
        />
      </div>
    </div>
  );
}
