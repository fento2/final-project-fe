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
  className?: string;
}

export default function ReadOnlyQuill({ value, className }: IReadOnlyQuill) {
  return (
    <div className={`ql-readonly ql-snow ${className || ''}`}>
      <ReactQuill
        theme="bubble"
        value={value}
        readOnly={true}
        modules={{ toolbar: false }}
      />
      <style jsx global>{`
        /* Ensure Quill read-only content follows site typography */
        .ql-readonly .ql-editor {
          font-family: var(--font-sans, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, "Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol");
          font-size: 1rem; /* Tailwind text-base */
          line-height: 1.625; /* Tailwind leading-relaxed */
          color: #374151; /* Tailwind text-gray-700 */
        }
        .ql-readonly .ql-editor p { margin: 0 0 0.75rem; }
        .ql-readonly .ql-editor ul, .ql-readonly .ql-editor ol { padding-left: 1.25rem; margin: 0 0 0.75rem; }
        .ql-readonly .ql-editor h1, .ql-readonly .ql-editor h2, .ql-readonly .ql-editor h3,
        .ql-readonly .ql-editor h4, .ql-readonly .ql-editor h5, .ql-readonly .ql-editor h6 {
          color: #111827; /* text-gray-900 */
          margin: 1rem 0 0.5rem;
          line-height: 1.25;
        }
        .ql-readonly .ql-editor a { color: #4f46e5; text-decoration: underline; }
        .ql-readonly .ql-editor strong { font-weight: 600; }
        .ql-readonly .ql-editor em { font-style: italic; }
        .ql-readonly .ql-editor code { background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem; }
      `}</style>
    </div>

  );
}
