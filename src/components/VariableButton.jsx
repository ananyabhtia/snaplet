import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";

const VariableButton = ({ id, name, value, type, items }) => {
    const [inputName, setInputName] = useState(name || "")
    const [inputValue, setInputValue] = useState(value || "")

    switch (type) {
        case "variable":
            return (
                <div className="text-sm flex flex-row items-center bg-pink-200 hover:bg-pink-400 font-bold py-2 px-4 rounded-md border-2 h-10 m-2 w-95/100">
                    <p>name</p>
                    <input onPointerDown={(e) => e.stopPropagation()} type="text" className="bg-white ml-2 mr-2 text-black w-1/5 rounded-full pl-2" value={inputName} onChange={e => setInputName(e.target.value)}></input>
                    <p>value</p>
                    <input onPointerDown={(e) => e.stopPropagation()} type="text" className="bg-white ml-2 mr-2 text-black w-2/5 rounded-full pl-2" value={inputValue} onChange={e => setInputValue(e.target.value)}></input>
                </div>
            );
        case "frame":
            const { setNodeRef, isOver } = useDroppable({ id: 'frame-droppable'});
            return (
                <div className="flex flex-col bg-blue-200 hover:bg-blue-400 font-bold py-2 px-4 rounded-md border-2 m-2 w-95/100">
                    <input onPointerDown={(e) => e.stopPropagation()} type="text" className="bg-white ml-2 mr-2 text-black w-2/5 rounded-full pl-2"></input>
                    <div ref={setNodeRef} className={`w-full min-h-10 h-auto bg-white border-black border-2 rounded-md mt-2 ${isOver ? 'ring-4 ring-blue-700' : ''}`}>
                        {items?.map((item) => 
                            // <DraggableItem id={item.id} label={item.label} type={item.type}>
                                <VariableButton key={item.id} id={item.id} name={item.label} value="" type={item.type} />
                            // </DraggableItem>
                        )}
                    </div>
                </div>
            );
    };
};

export default VariableButton;