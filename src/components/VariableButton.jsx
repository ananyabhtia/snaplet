import { useState } from "react";

const VariableButton = ({ name, value, type }) => {
    const [inputName, setInputName] = useState(name || "")
    const [inputValue, setInputValue] = useState(value || "")

    switch (type) {
        case "variable":
            return (
                <div onClick={(e) => e.stopPropagation()} className="text-sm flex flex-row items-center bg-pink-200 hover:bg-pink-400 font-bold py-2 px-4 rounded-full border-2 h-10 m-1 w-4/5">
                    <p>name</p>
                    <input onPointerDown={(e) => e.stopPropagation()} type="text" className="bg-white ml-2 mr-2 text-black w-1/5" value={inputName} onChange={e => setInputName(e.target.value)}></input>
                    <p>value</p>
                    <input onPointerDown={(e) => e.stopPropagation()} type="text" className="bg-white ml-2 mr-2 text-black w-2/5" value={inputValue} onChange={e => setInputValue(e.target.value)}></input>
                </div>
            );
        case "t2":
            return (
                <button className="bg-gray-200 hover:bg-gray-400 font-bold py-2 px-4 rounded-full border-2 h-10 m-1">
                    {name}
                </button>
            );
    };
};

export default VariableButton;