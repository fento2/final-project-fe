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
  editing: boolean;
  profile: boolean;
}

export default function TextEditor({
  editing,
  value,
  setValue,
  profile,
}: ITextEditor) {
  const modulesDescription = {
    toolbar: {
      container: [
        ["bold", "italic", "underline", "strike"],
        ["requirement", "benefit"], // custom button
        [{ color: [] }, { background: [] }],
        [{ list: "bullet" }],
        [{ align: [] }],
        ["link"],
        ["clean"],
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
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "bullet" }],
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

      <div className="mt-2">
        {!editing && (
          <div>
            <div
              className={`${
                editing ? "text-black" : "text-neutral-500"
              } border rounded-lg`}
            >
              <div
                className="quill-preview border p-4 rounded-md"
                dangerouslySetInnerHTML={{ __html: value }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
