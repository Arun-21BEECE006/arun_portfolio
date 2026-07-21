import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { RiLoader4Line, RiErrorWarningLine } from "react-icons/ri";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

// Renders every page of a PDF onto its own <canvas>, scaled to fit the
// container's actual width — this looks identical on every browser/device
// since we're drawing the pages ourselves instead of relying on each
// browser's own (wildly inconsistent) built-in PDF viewer. Re-renders on
// container resize too, so rotating a phone or resizing a window doesn't
// leave it stuck at a stale size.
export default function PdfViewer({ url, className = "" }) {
  const containerRef = useRef(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!url) return;
    let cancelled = false;
    let pdfDoc = null;
    let resizeTimeout = null;

    async function renderAllPages() {
      const container = containerRef.current;
      if (!container || !pdfDoc) return;

      const containerWidth = container.clientWidth;
      if (containerWidth === 0) return; // not laid out yet, skip this pass

      container.innerHTML = "";

      for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        if (cancelled) return;
        const page = await pdfDoc.getPage(pageNum);
        const unscaledViewport = page.getViewport({ scale: 1 });
        // Render at device pixel ratio for crisp text on high-DPI phone
        // screens, but size the CSS box to the container's actual width.
        const scale = containerWidth / unscaledViewport.width;
        const outputScale = window.devicePixelRatio || 1;
        const viewport = page.getViewport({ scale: scale * outputScale });

        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = `${containerWidth}px`;
        canvas.style.height = `${viewport.height / outputScale}px`;
        canvas.style.display = "block";
        canvas.style.marginBottom = pageNum < pdfDoc.numPages ? "12px" : "0";
        canvas.className = "rounded-lg";

        const ctx = canvas.getContext("2d");
        await page.render({ canvasContext: ctx, viewport }).promise;
        if (cancelled) return;

        container.appendChild(canvas);
      }
    }

    async function load() {
      setStatus("loading");
      try {
        // pdfjs-dist requires the explicit object form — a bare string
        // throws "expected either `data`, `range`, or `url` parameter".
        const loadingTask = pdfjsLib.getDocument({ url });
        pdfDoc = await loadingTask.promise;
        if (cancelled) return;
        await renderAllPages();
        if (!cancelled) setStatus("ready");
      } catch (err) {
        if (!cancelled) {
          console.error("PDF render error:", err);
          setErrorMessage(err.message || "Could not load the PDF");
          setStatus("error");
        }
      }
    }

    load();

    // Re-render (debounced) on container resize / device rotation so the
    // pages always match the current available width.
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (!cancelled && pdfDoc) renderAllPages();
      }, 200);
    });
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    return () => {
      cancelled = true;
      clearTimeout(resizeTimeout);
      resizeObserver.disconnect();
    };
  }, [url]);

  return (
    <div className={`relative ${className}`}>
      {status === "loading" && (
        <div className="absolute inset-0 grid place-items-center bg-ink-950 z-10">
          <RiLoader4Line className="animate-spin text-teal-400" size={28} />
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink-950 px-6 text-center z-10">
          <RiErrorWarningLine className="text-rose-400" size={28} />
          <p className="text-sm text-muted">{errorMessage}</p>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-teal-300 hover:text-teal-200 underline"
          >
            Open the PDF directly instead
          </a>
        </div>
      )}
      <div
        ref={containerRef}
        className="w-full h-full overflow-y-auto bg-ink-950 p-2"
      />
    </div>
  );
}
