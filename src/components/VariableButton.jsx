import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";

const VariableButton = ({ id, name, value, type, position, items, onInputChange }) => {

    switch (type) {
        case "variable":
            // console.log('VariableButton props:', { id, name, value, type, position, onInputChange });
            return (
                <div className="text-sm flex flex-row items-center bg-pink-200 hover:bg-pink-400 font-bold py-2 px-4 rounded-xl border-2 h-10 m-2 w-95/100 z-1000">
                    {/* <p>{id}</p> */}
                    <p>name</p>
                    <input onPointerDown={(e) => e.stopPropagation()} type="text" className="bg-white ml-2 mr-2 text-black w-1/5 rounded-full pl-2" value={name} onChange={e => onInputChange(id, e.target.value, value, position, type)}></input>
                    <p>value</p>
                    <input onPointerDown={(e) => e.stopPropagation()} type="text" className="bg-white ml-2 mr-2 text-black w-2/5 rounded-full pl-2" value={value} onChange={e => onInputChange(id, name, e.target.value, position, type)}></input>
                </div>
            );
        case "frame":
            const { setNodeRef, isOver } = useDroppable({ id: `frame-droppable-${id}`});
            return (
                <div className="flex flex-col bg-blue-200 hover:bg-blue-400 font-bold py-2 px-4 rounded-xl border-2 m-2 w-95/100">
                    {/* <p>{id}</p> */}
                    <input onPointerDown={(e) => e.stopPropagation()} type="text" className="bg-white ml-2 mr-2 text-black w-2/5 rounded-full pl-2" value={name} onChange={e => onInputChange(id, e.target.value, value, position, type)}></input>
                    <div ref={setNodeRef} className={`w-full min-h-10 h-auto bg-white border-black border-2 rounded-xl mt-2 ${isOver ? 'ring-4 ring-blue-700' : ''}`}>
                        {items?.map((item) => 
                            // <DraggableItem id={item.id} name={item.label} type={item.type}>
                                <VariableButton key={item.id} id={item.id} name={item.name} value={item.value} type={item.type} position={item.position} items={item.items} onInputChange={onInputChange} />
                            // </DraggableItem>
                        )}
                    </div>
                </div>
            );
    };
};

export default VariableButton;