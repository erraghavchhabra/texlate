import { useRef, useState, useEffect } from "react";
import {
    Upload as UploadIcon,
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

export default function Upload() {
    const inputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [processStep, setProcessStep] = useState(1);
    const [showSummary, setShowSummary] = useState(false);

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

    /* ---------------- PROCESS SIMULATION ---------------- */
    const handleProcess = () => {
        setShowModal(true);
        setProcessStep(1);

        setTimeout(() => setProcessStep(2), 1500);
        setTimeout(() => setProcessStep(3), 3000);

        setTimeout(() => {
            setShowModal(false);
            setShowSummary(true);
        }, 4500);
    };

    return (
        <div className="min-h-screen py-10 px-4 relative">
            <div className="max-w-5xl mx-auto p-6 my-16 rounded-3xl space-y-6 bg-white">

                {/* Heading */}
                <div className="text-center">
                    <h1 className="text-3xl font-semibold text-gray-900">
                        Translate Your PDF to English
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Upload, pay from wallet, and get your translated document
                    </p>
                </div>

                {/* Warning */}
                <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <AlertTriangle className="text-amber-500 mt-1" size={20} />
                    <p className="text-sm text-gray-700">
                        <span className="font-semibold">Verification Required:</span> Texlate can make mistakes.
                        Please cross-verify the translated document, especially{" "}
                        <span className="italic font-medium">handwritten numericals</span>.
                    </p>
                </div>

                {/* ================= UPLOAD OR SUMMARY ================= */}
                {!showSummary ? (
                    <>
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
                                    <UploadIcon size={24} />
                                </div>

                                <p className="text-lg font-medium text-gray-800">
                                    Tap to upload PDF or drag and drop here
                                </p>

                                <div className="flex justify-center gap-4 mt-5 text-xs text-gray-400">
                                    <span className="bg-gray-100 px-3 py-1 rounded-md">MAX 100 MB</span>
                                    <span className="bg-gray-100 px-3 py-1 rounded-md">MAX 200 PAGES</span>
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

                        {file && (
                            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
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

                                <div className="h-[520px] bg-gray-100">
                                    <embed src={previewUrl} type="application/pdf" className="w-full h-full" />
                                </div>

                                <div className="p-6">
                                    <button
                                        onClick={handleProcess}
                                        className="w-full flex items-center justify-center gap-2
                                        bg-blue-600 text-white py-3.5 rounded-lg
                                        text-base font-semibold hover:bg-blue-700 transition">
                                        <Calculator size={20} />
                                        Calculate Cost
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    /* ================= ORDER SUMMARY ================= */
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-6 md:p-10 border border-gray-200 space-y-6 animate-fadeIn">
                        <h2 className="text-3xl font-semibold text-center text-gray-900">
                            Order Summary
                        </h2>

                        <div className="bg-white rounded-2xl p-6 flex justify-between items-center border">
                            <p className="text-lg font-medium text-gray-800">Pages Detected:</p>
                            <p className="text-2xl font-semibold text-gray-900">2</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 flex justify-between items-center border">
                            <p className="text-lg font-medium text-gray-800">Payable Amount:</p>

                            <div>
                                <div className="flex items-center text-end gap-4">
                                <span className="text-gray-400 line-through text-lg">
                                    ₹100
                                </span>

                                <span className="text-3xl font-bold text-gray-900">
                                    ₹30
                                </span>


                            </div>
                            <span className="text-green-600 font-semibold">
                                70% OFF
                            </span>
                            </div>
                        </div>


                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-gray-700">
                            <span className="font-semibold">Important:</span> Please stay on page. You will be redirected once the payment is complete. A recovery file will auto-download. Save it OR <span className="text-blue-600 underline cursor-pointer">Copy this link</span> to track your order.
                        </div>

                        <div className="flex items-start gap-3 text-sm text-gray-600">
                            <input type="checkbox" className="mt-1" />
                            <p>
                                I have read, understood and accept the legal policies (being <span className="text-blue-600 underline cursor-pointer">terms and conditions</span>, <span className="text-blue-600 underline cursor-pointer">disclaimer</span>, <span className="text-blue-600 underline cursor-pointer">Privacy Policy</span> and <span className="text-blue-600 underline cursor-pointer">Refund Policy</span>) of Texlate and acknowledge that my continued use of their services is subject to such legal policies.
                            </p>
                        </div>

                        <button className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white py-4 rounded-full text-lg font-semibold">
                            Pay Now ₹30
                        </button>
                    </div>
                )}

                {/* SMART INFO SECTION */}
                <div className="space-y-6">
                    {/* Smart Processing */}
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
                            <div className="flex gap-4">
                                <Languages className="text-emerald-500" size={20} />
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    <span className="font-semibold text-gray-900">
                                        English Text Handling:
                                    </span>{" "}
                                    Upload carefree. If your document already contains English text,
                                    Texlate preserves it exactly as-is — just like a human typist would.
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <ScanLine className="text-emerald-500" size={20} />
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
                </div>
            </div>

            {/* ================= PROCESS MODAL ================= */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 w-[90%] max-w-md text-center space-y-6 shadow-xl">
                        <h3 className="text-xl font-semibold text-gray-800">Please wait...</h3>

                        <div className="space-y-4 text-left">

                            {/* STEP 1 */}
                            <div className="flex items-center gap-3">
                                {processStep > 1 ? (
                                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                ) : (
                                    <div className={`w-5 h-5 rounded-full border-2 ${processStep === 1 ? "border-blue-600 animate-spin border-t-transparent" : "border-gray-300"}`} />
                                )}
                                <span className={processStep >= 1 ? "text-blue-600" : "text-gray-400"}>
                                    Analyzing
                                </span>
                            </div>

                            {/* STEP 2 */}
                            <div className="flex items-center gap-3">
                                {processStep > 2 ? (
                                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                ) : (
                                    <div className={`w-5 h-5 rounded-full border-2 ${processStep === 2 ? "border-blue-600 animate-spin border-t-transparent" : "border-gray-300"}`} />
                                )}
                                <span className={processStep >= 2 ? "text-blue-600" : "text-gray-400"}>
                                    Calculating Pages
                                </span>
                            </div>

                            {/* STEP 3 */}
                            <div className="flex items-center gap-3">
                                {processStep > 3 ? (
                                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                ) : (
                                    <div className={`w-5 h-5 rounded-full border-2 ${processStep === 3 ? "border-blue-600 animate-spin border-t-transparent" : "border-gray-300"}`} />
                                )}
                                <span className={processStep >= 3 ? "text-blue-600" : "text-gray-400"}>
                                    Generating order summary
                                </span>
                            </div>

                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
