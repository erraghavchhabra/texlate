import { useRef, useState } from "react";
import {
  Upload,
  FileText,
  Trash2,
  Calculator,
  Wallet,
  Sparkles,
  Languages,
  ScanLine,
  AlertCircle,
  WifiOff,
  FileWarning,
  AlertTriangle
} from "lucide-react";

export default function NewTranslation() {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  /* ---------------- FILE SELECT ---------------- */
  const handleFile = selected => {
    if (!selected || selected.type !== "application/pdf") return;

    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  };

  const onInputChange = e => handleFile(e.target.files[0]);

  /* ---------------- DRAG EVENTS ---------------- */
  const handleDrag = e => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else setDragActive(false);
  };

  const handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFile(e.dataTransfer.files[0]);
  };

  /* ---------------- DELETE FILE ---------------- */
  const removeFile = () => {
    setFile(null);
    setPreviewUrl(null);
  };

  const formatSize = size =>
    size > 1024 * 1024
      ? (size / (1024 * 1024)).toFixed(2) + " MB"
      : (size / 1024).toFixed(2) + " KB";

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Heading */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">
          Translate Your PDF to English
        </h1>
        <p className="text-gray-500 mt-1">
          Upload, pay from wallet, and get your translated document
        </p>
      </div>

      {/* Balance Card */}
      <div className="flex items-center gap-4 bg-emerald-50 border border-emerald-200 rounded-xl p-5">
        <div className="bg-emerald-500 text-white p-3 rounded-lg">
          <Wallet size={22} />
        </div>
        <div>
          <p className="text-sm text-gray-600">Available Balance</p>
          <p className="text-2xl font-semibold text-emerald-600">0 pages</p>
        </div>
      </div>

      {/* Warning */}
      <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
        <AlertTriangle className="text-amber-500 mt-1" size={20} />
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Verification Required:</span> Texlate can make mistakes.
          Please cross-verify the translated document, especially{" "}
          <span className="italic font-medium">handwritten numericals</span>,
          as regional numbers may appear similar.
        </p>
      </div>

      {/* ---------------- DROPZONE ---------------- */}
      {!file && (
        <div
          onClick={() => inputRef.current.click()}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer
          transition-all duration-300 group
          ${dragActive
              ? "border-blue-500 bg-blue-50 scale-[1.01]"
              : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
            }`}
        >
          <div className="mx-auto w-14 h-14 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <Upload size={24} />
          </div>

          <p className="text-lg font-medium text-gray-800">
            Tap to upload PDF or drag and drop here
          </p>

          <div className="flex justify-center gap-4 mt-5 text-xs text-gray-400">
            <span className="bg-gray-100 px-3 py-1 rounded-md">
              MAX 100 MB
            </span>
            <span className="bg-gray-100 px-3 py-1 rounded-md">
              MAX 200 PAGES
            </span>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            onChange={onInputChange}
            className="hidden"
          />
        </div>
      )}

      {/* ---------------- PREVIEW ---------------- */}
      {file && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

          {/* File Info */}
          <div className="flex items-center justify-between px-5 py-4 border-b bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="bg-red-50 p-2 rounded-md">
                <FileText className="text-red-500" size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{file.name}</p>
                <p className="text-xs text-gray-500">{formatSize(file.size)}</p>
              </div>
            </div>

            <button
              onClick={removeFile}
              className="text-gray-400 hover:text-red-500 transition"
            >
              <Trash2 size={20} />
            </button>
          </div>

          {/* PDF Preview */}
          <div className="h-[520px] bg-gray-100">
            <embed
              src={previewUrl}
              type="application/pdf"
              className="w-full h-full"
            />
          </div>

          {/* Calculate Button */}
          <div className="p-6">
            <button className="w-full flex items-center justify-center gap-2
              bg-blue-600 text-white py-3.5 rounded-lg
              text-base font-semibold tracking-wide
              hover:bg-blue-700 transition-all duration-200
              shadow-sm active:scale-[0.98]">
              <Calculator size={20} />
              Calculate Cost
            </button>
          </div>
        </div>
      )}

    {/* ================= SMART INFO SECTION ================= */}
<div className="space-y-6">

  {/* Smart Processing Card */}
  <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl p-6 transition hover:shadow-md">
    <div className="flex items-center gap-3 mb-5">
      <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center">
        <Sparkles className="text-blue-600" size={20} />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">
        Smart Processing
      </h3>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      {/* English Handling */}
      <div className="flex gap-4">
        <div className="mt-1">
          <Languages className="text-emerald-500" size={20} />
        </div>

        <p className="text-sm text-gray-600 leading-relaxed">
          <span className="font-semibold text-gray-900">
            English Text Handling:
          </span>{" "}
          Upload carefree. If your document already contains English text,
          Texlate preserves it exactly as-is — just like a human typist would.
        </p>
      </div>

      {/* OCR */}
      <div className="flex gap-4">
        <div className="mt-1">
          <ScanLine className="text-emerald-500" size={20} />
        </div>

        <p className="text-sm text-gray-600 leading-relaxed">
          <span className="font-semibold text-gray-900">
            Advanced OCR:
          </span>{" "}
          Our OCR reads handwritten, old, and faded documents with high
          accuracy.
          <span className="text-gray-400 italic">
            {" "}Better clarity = better results.
          </span>
        </p>
      </div>
    </div>
  </div>

  {/* Upload Help Card */}
  <div className="bg-white border border-gray-200 rounded-2xl p-6 transition hover:shadow-md">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
        <AlertCircle className="text-amber-500" size={20} />
      </div>

      <h3 className="text-lg font-semibold text-gray-900">
        Upload Failed?
      </h3>
    </div>

    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <WifiOff className="text-gray-400 mt-1" size={18} />
        <p className="text-sm text-gray-600">
          <span className="font-medium text-gray-900">
            Network issues?
          </span>{" "}
          Try another connection. Some providers may intermittently block uploads.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <FileWarning className="text-gray-400 mt-1" size={18} />
        <p className="text-sm text-gray-600">
          <span className="font-medium text-gray-900">
            Check filename:
          </span>{" "}
          Remove emojis or special characters before uploading.
        </p>
      </div>
    </div>
  </div>

</div>

    </div>
  );
}
