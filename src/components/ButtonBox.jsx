const ButtonBox = () => {
    return (
        <div className="flex flex-row w-full h-1/12 border-yellow-700 rounded-xl justify-between items-center mb-1">
            <div className="flex flex-row border-orange-700 rounded-xl justify-between items-center">
                <button className="bg-gray-200 hover:bg-gray-400 font-bold py-2 px-4 rounded-full border-2 h-full mr-1">prev</button>
                <button className="bg-gray-200 hover:bg-gray-400 font-bold py-2 px-4 rounded-full border-2 h-full m-1">line number</button>
                <button className="bg-gray-200 hover:bg-gray-400 font-bold py-2 px-4 rounded-full border-2 h-full m-1">step number</button>
                <button className="bg-gray-200 hover:bg-gray-400 font-bold py-2 px-4 rounded-full border-2 h-full m-1">total steps</button>
                <button className="bg-gray-200 hover:bg-gray-400 font-bold py-2 px-4 rounded-full border-2 h-full m-1">next</button>
            </div>
            <div className="flex flex-row border-orange-700 rounded-xl justify-between items-center">
                <button className="bg-gray-200 hover:bg-gray-400 font-bold py-2 px-4 rounded-full border-2 h-full m-1">undo</button>
                <button className="bg-gray-200 hover:bg-gray-400 font-bold py-2 px-4 rounded-full border-2 h-full m-1">redo</button>
                <button className="bg-gray-200 hover:bg-gray-400 font-bold py-2 px-4 rounded-full border-2 h-full ml-1">save</button>
            </div>
        </div>
    );
};

export default ButtonBox;