const ButtonBox = () => {
    return (
        <div className="flex flex-row w-full h-1/12 border-yellow-700 rounded-xl justify-between items-center mb-1">
            <div className="flex flex-row border-orange-700 rounded-xl justify-between items-center">
                <div className="flex flex-row bg-purple-300 hover:bg-purple-500 font-bold py-2 px-4 rounded-full h-full mr-1 items-center">
                    <i className="fa-solid fa-arrow-left mr-2" />
                    <p>prev</p>
                </div>
                <div className="flex flex-row bg-purple-300 hover:bg-purple-500 font-bold py-2 px-4 rounded-full h-full mr-1 items-center">
                    <p>line number</p>
                    <input type="text" className="bg-white ml-2 text-black rounded-full pl-2 w-10"></input>
                </div>
                <div className="flex flex-row bg-purple-300 hover:bg-purple-500 font-bold py-2 px-4 rounded-full h-full mr-1 items-center">
                    <p>step number</p>
                    <input type="text" className="bg-white ml-2 text-black rounded-full pl-2 w-10"></input>
                </div>
                <div className="flex flex-row bg-purple-300 hover:bg-purple-500 font-bold py-2 px-4 rounded-full h-full mr-1 items-center">
                    <p>total steps</p>
                    <input type="text" className="bg-white ml-2 text-black rounded-full pl-2 w-10"></input>
                </div>
                <div className="flex flex-row bg-purple-300 hover:bg-purple-500 font-bold py-2 px-4 rounded-full h-full mr-1 items-center">
                    <p>next</p>
                    <i className="fa-solid fa-arrow-right ml-2" />
                </div>
            </div>
            <div className="flex flex-row border-orange-700 rounded-xl justify-between items-center">
                <div className="bg-yellow-200 hover:bg-yellow-400 font-bold py-2 px-4 rounded-full h-full m-1">
                    <i className="fa-solid fa-arrow-rotate-left"/>
                </div>
                <div className="bg-yellow-200 hover:bg-yellow-400 font-bold py-2 px-4 rounded-full h-full m-1">
                    <i className="fa-solid fa-arrow-rotate-right"/>
                </div>
                <div className="bg-yellow-200 hover:bg-yellow-400 font-bold py-2 px-4 rounded-full h-full ml-1">save</div>
            </div>
        </div>
    );
};

export default ButtonBox;