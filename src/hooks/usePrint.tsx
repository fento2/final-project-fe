import { useReactToPrint } from "react-to-print";
import { RefObject } from "react";

export function usePrint<T extends HTMLElement = HTMLElement>(ref: RefObject<T | null>, documentTitle?: string) {
    return useReactToPrint({
        contentRef: ref,
        documentTitle: documentTitle ?? "document",
        pageStyle: `
            @media print {
                @page { size: A4; margin: 20mm; }
            }
        `,
    });
}