
// ButtonBox : component containing previous, next, add step, and export to PDF buttons
const ButtonBox = ({ handleSave, handlePrev, handleNext, handleAdd, handlePDF, currentStep, totalSteps }) => {
    const isPrevButtonDisabled = currentStep === 1;
    const isNextButtonDisabled = totalSteps === currentStep;

    return (
        <div className="flex flex-row w-full h-1/12 border-yellow-700 rounded-xl justify-between items-center mb-1 px-2">
            <div className="flex flex-row border-orange-700 rounded-xl justify-between items-center gap-1 flex-wrap">
                <div id="prev" onClick={!isPrevButtonDisabled ? handlePrev : undefined} className={`flex flex-row font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-full h-full items-center text-xs sm:text-sm ${isPrevButtonDisabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-purple-300 hover:bg-purple-500 active:bg-purple-800 cursor-pointer'}`}>
                    <i className="fa-solid fa-arrow-left mr-1 sm:mr-2 text-xs sm:text-sm" />
                    <p>prev</p>
                </div>
                <div id="next" onClick={!isNextButtonDisabled ? handleNext: undefined} className={`flex flex-row font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-full h-full items-center text-xs sm:text-sm ${isNextButtonDisabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-purple-300 hover:bg-purple-500 active:bg-purple-800 cursor-pointer'}`}>
                    <p>next</p>
                    <i className="fa-solid fa-arrow-right ml-1 sm:ml-2 text-xs sm:text-sm" />
                </div>
                <div id="next" onClick={handleAdd} className="flex flex-row bg-purple-300 hover:bg-purple-500 active:bg-purple-800 font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-full h-full items-center text-xs sm:text-sm cursor-pointer">
                    <p>add step</p>
                    <i className="fa-solid fa-plus ml-1 sm:ml-2 text-xs sm:text-sm" />
                </div>
            </div>
            <div className="flex flex-row border-orange-700 rounded-xl justify-between items-center gap-1">
                {/* <div className="bg-yellow-200 hover:bg-yellow-400 font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-full h-full">
                    <i className="fa-solid fa-arrow-rotate-left text-xs sm:text-sm"/>
                </div>
                <div className="bg-yellow-200 hover:bg-yellow-400 font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-full h-full">
                    <i className="fa-solid fa-arrow-rotate-right text-xs sm:text-sm"/>
                </div>
                <div onClick={handleSave} className="bg-yellow-200 hover:bg-yellow-400 font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-full h-full cursor-pointer text-xs sm:text-sm active:bg-yellow-700">save</div> */}
                <div onClick={handlePDF} className="flex flex-row items-center justify-center bg-yellow-200 hover:bg-yellow-400 font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-full h-full cursor-pointer text-xs sm:text-sm active:bg-yellow-700">
                    <p className="mr-2">export to PDF</p>
                    <i className="fa-solid fa-download"></i>
                </div>
            </div>
        </div>
    );
};

export default ButtonBox;