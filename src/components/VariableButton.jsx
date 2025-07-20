import { useState } from "react";

const VariableButton = ({ name, value, type }) => {
    switch (type) {
        case "variable":
            const [inputName, setInputName] = useState("")
            const [inputValue, setInputValue] = useState("")

            return (
                <div className="flex flex-row items-center bg-pink-200 hover:bg-pink-400 font-bold py-2 px-4 rounded-full border-2 h-10 m-1 w-4/5">
                    <p>name</p>
                    <input type="text" className="bg-white ml-2 mr-2 text-black w-20" value={inputName} onChange={e => setInputName(e.target.value)}></input>
                    <p>value</p>
                    <input type="text" className="bg-white ml-2 mr-2 text-black w-30" value={inputValue} onChange={e => setInputValue(e.target.value)}></input>
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