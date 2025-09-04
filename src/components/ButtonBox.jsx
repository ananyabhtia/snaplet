const ButtonBox = ({ handleSave, handlePrev, handleNext, currentStep, totalSteps, lineNumber, setLineNumber }) => {
    const isButtonDisabled = currentStep === 1;

    return (
        <div className="flex flex-row w-full h-1/12 border-yellow-700 rounded-xl justify-between items-center mb-1 px-2">
            <div className="flex flex-row border-orange-700 rounded-xl justify-between items-center gap-1 flex-wrap">
                <div onClick={!isButtonDisabled ? handlePrev : undefined} className={`flex flex-row font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-full h-full items-center text-xs sm:text-sm ${isButtonDisabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-purple-300 hover:bg-purple-500 active:bg-purple-800 cursor-pointer'}`}>
                    <i className="fa-solid fa-arrow-left mr-1 sm:mr-2 text-xs sm:text-sm" />
                    <p>prev</p>
                </div>
                <div className="flex flex-row bg-purple-300 hover:bg-purple-500 font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-full h-full items-center text-xs sm:text-sm">
                    <p>line number</p>
                    <input type="text" value={lineNumber} onChange={e => setLineNumber(e.target.value)} className="bg-white ml-1 sm:ml-2 text-black rounded-full pl-1 sm:pl-2 w-6 sm:w-10 text-xs sm:text-sm"></input>
                </div>
                <div className="flex flex-row bg-purple-300 hover:bg-purple-500 font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-full h-full items-center text-xs sm:text-sm">
                    <p>step number</p>
                    <input value={currentStep} readOnly={true} type="text" className="bg-white ml-1 sm:ml-2 text-black rounded-full pl-1 sm:pl-2 w-6 sm:w-10 text-xs sm:text-sm"></input>
                </div>
                <div className="flex flex-row bg-purple-300 hover:bg-purple-500 font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-full h-full items-center text-xs sm:text-sm">
                    <p>total steps</p>
                    <input type="text" value={totalSteps} readOnly={true} className="bg-white ml-1 sm:ml-2 text-black rounded-full pl-1 sm:pl-2 w-6 sm:w-10 text-xs sm:text-sm"></input>
                </div>
                <div onClick={handleNext} className="flex flex-row bg-purple-300 hover:bg-purple-500 active:bg-purple-800 font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-full h-full items-center text-xs sm:text-sm">
                    <p>next</p>
                    <i className="fa-solid fa-arrow-right ml-1 sm:ml-2 text-xs sm:text-sm" />
                </div>
            </div>
            <div className="flex flex-row border-orange-700 rounded-xl justify-between items-center gap-1">
                <div className="bg-yellow-200 hover:bg-yellow-400 font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-full h-full">
                    <i className="fa-solid fa-arrow-rotate-left text-xs sm:text-sm"/>
                </div>
                <div className="bg-yellow-200 hover:bg-yellow-400 font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-full h-full">
                    <i className="fa-solid fa-arrow-rotate-right text-xs sm:text-sm"/>
                </div>
                <div onClick={handleSave} className="bg-yellow-200 hover:bg-yellow-400 font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-full h-full cursor-pointer text-xs sm:text-sm active:bg-yellow-700">save</div>
            </div>
        </div>
    );
};

export default ButtonBox;