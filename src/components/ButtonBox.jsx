import { useState, useRef } from "react";

// ButtonBox : component containing previous, next, add step, and export buttons
const ButtonBox = ({ handleImport, handleSave, handlePrev, handleNext, handleAdd, handleClearAll, handlePDF, handleSnap, currentStep, totalSteps, diagramTitle, setDiagramTitle }) => {
    const isPrevButtonDisabled = currentStep === 1;
    const isNextButtonDisabled = totalSteps === currentStep;

    const [showExportModal, setShowExportModal] = useState(false);
    const fileInputRef = useRef(null);

    return (
        <div className="flex flex-row flex-wrap w-full min-h-[8%] max-h-[15%] border-yellow-700 rounded-xl justify-between items-center mb-1 px-2 py-1 bg-white gap-2 overflow-y-auto">
            <div className="flex flex-row rounded-xl justify-start items-center gap-1 flex-wrap border-orange-700 flex-1">
                <div id="prev" onClick={!isPrevButtonDisabled ? handlePrev : undefined} className={`exclude-from-pdf flex flex-row font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-full items-center text-xs sm:text-sm whitespace-nowrap ${isPrevButtonDisabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-purple-300 hover:bg-purple-500 active:bg-purple-800 cursor-pointer'}`}>
                    <i className="fa-solid fa-arrow-left mr-1 sm:mr-2 text-xs sm:text-sm" />
                    <p>prev</p>
                </div>
                <div id="next" onClick={!isNextButtonDisabled ? handleNext: undefined} className={`exclude-from-pdf flex flex-row font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-full items-center text-xs sm:text-sm whitespace-nowrap ${isNextButtonDisabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-purple-300 hover:bg-purple-500 active:bg-purple-800 cursor-pointer'}`}>
                    <p>next</p>
                    <i className="fa-solid fa-arrow-right ml-1 sm:ml-2 text-xs sm:text-sm" />
                </div>
                <div id="add" onClick={handleAdd} className="exclude-from-pdf flex flex-row bg-purple-300 hover:bg-purple-500 active:bg-purple-800 font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-full items-center text-xs sm:text-sm cursor-pointer whitespace-nowrap">
                    <p>add step</p>
                    <i className="fa-solid fa-plus ml-1 sm:ml-2 text-xs sm:text-sm" />
                </div>
                <input id="title-input" type="text" placeholder="untitled diagram" value={diagramTitle} onChange={e => setDiagramTitle(e.target.value)} className="flex flex-row bg-white hover:bg-gray-200 font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-full min-w-[120px] max-w-[200px] flex-1 items-center text-xs sm:text-sm cursor-text border-2 outline-none"/>
            </div>
            <div className="relative flex flex-row border-orange-700 rounded-xl justify-end items-center gap-1 flex-wrap sm:flex-nowrap">
                <div onClick={handleClearAll} className="exclude-from-pdf flex flex-row items-center justify-center bg-red-300 hover:bg-red-400 font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-full cursor-pointer text-xs sm:text-sm active:bg-red-700 whitespace-nowrap">
                    <p className="mr-1 sm:mr-2">clear all</p>
                    <i className="fa-solid fa-circle-xmark"></i>
                </div>
                <div onClick={() => setShowExportModal(true)} className="exclude-from-pdf flex flex-row items-center justify-center bg-yellow-200 hover:bg-yellow-400 font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-full cursor-pointer text-xs sm:text-sm active:bg-yellow-700 whitespace-nowrap">
                    <p className="mr-1 sm:mr-2">export</p>
                    <i className="fa-solid fa-download"></i>
                </div>
                <div onClick={() => fileInputRef.current?.click()} className="exclude-from-pdf flex flex-row items-center justify-center bg-teal-200 hover:bg-teal-400 font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-full cursor-pointer text-xs sm:text-sm active:bg-teal-700 whitespace-nowrap">
                    <p className="mr-1 sm:mr-2">import</p>
                    <i className="fa-solid fa-file-import"></i>
                </div>
                <input type="file" accept=".snap" className="hidden" id="file-input" onChange={handleImport} ref={fileInputRef} />
            </div>

            {/* Export format modal */}
            {showExportModal && (
                <div className="exclude-from-pdf fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowExportModal(false)}>
                    <div className="bg-white rounded-2xl shadow-xl p-6 min-w-[280px] flex flex-col items-center gap-4" onClick={e => e.stopPropagation()}>
                        <h2 className="text-lg font-bold text-gray-800">export as</h2>
                        <p className="text-sm text-gray-500">select a file format:</p>
                        <div className="flex flex-row gap-3 w-full justify-center">
                            <button
                                onClick={() => { setShowExportModal(false); handleSnap(); }}
                                className="flex flex-row items-center gap-2 bg-indigo-200 hover:bg-indigo-400 active:bg-indigo-700 font-bold py-2 px-5 rounded-full text-sm cursor-pointer transition-colors"
                            >
                                <i className="fa-solid fa-file-arrow-down"></i>
                                .snap
                            </button>
                            <button
                                onClick={() => { setShowExportModal(false); handlePDF(); }}
                                className="flex flex-row items-center gap-2 bg-rose-200 hover:bg-rose-400 active:bg-rose-700 font-bold py-2 px-5 rounded-full text-sm cursor-pointer transition-colors"
                            >
                                <i className="fa-solid fa-file-pdf"></i>
                                .pdf
                            </button>
                        </div>
                        <button onClick={() => setShowExportModal(false)} className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer mt-1">
                            cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ButtonBox;