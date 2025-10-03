import { useDroppable } from "@dnd-kit/core";
import DraggableItem from "./DraggableItem";
import { v4 as uuidv4 } from "uuid";

const VariableButton = ({ id, name, value, type, position, items, onInputChange, onDelete }) => {

    switch (type) {
        case "variable":
            // console.log('VariableButton props:', { id, name, value, type, position, onInputChange });
            return (
                <div className="text-sm flex flex-row items-center bg-pink-300 hover:bg-pink-400 font-bold py-2 px-4 rounded-xl border-2 border-pink-400 h-10 mt-2 ml-2 mr-2 mb-1 w-95/100 z-1000 cursor-move">
                    {/* <p>{id}</p> */}
                    <input id={uuidv4()} onPointerDown={(e) => e.stopPropagation()} type="text" className="bg-white ml-2 mr-2 text-black w-2/6 rounded-full pl-2" value={name || ""} onChange={e => onInputChange(id, e.target.value, value, position, type)}></input>
                    <p>=</p>
                    <input id={uuidv4()} onPointerDown={(e) => e.stopPropagation()} type="text" className="bg-white ml-2 mr-2 text-black w-3/6 rounded-full pl-2" value={value || ""} onChange={e => onInputChange(id, name, e.target.value, position, type)}></input>
                    {position !== "bank" && (<i onPointerDown={(e) => e.stopPropagation()} onClick={() => onDelete(id, type, position)} className="fa-solid fa-trash active:text-red-600 text-md ml-auto cursor-pointer"></i>)}
                </div>
            );
        case "frame":
            const { setNodeRef: setFrameNodeRef, isOver: isOverFrame } = useDroppable({ id: `frame-droppable-${id}`});
            return (
                <div className="text-sm flex flex-col bg-blue-300 hover:bg-blue-400 font-bold py-2 px-4 rounded-xl border-2 border-blue-400 mt-2 ml-2 mr-2 mb-1 w-95/100 cursor-move">
                    {/* <p>{id}</p> */}
                    <div className="flex flex-row items-center">
                        <input id={uuidv4()} onPointerDown={(e) => e.stopPropagation()} type="text" className="bg-white ml-2 mr-2 text-black w-4/5 rounded-full pl-2" value={name || ""} onChange={e => onInputChange(id, e.target.value, value, position, type)}></input>
                        {position !== "bank" && (<i onPointerDown={(e) => e.stopPropagation()} onClick={() => onDelete(id, type, position)} className="fa-solid fa-trash active:text-red-600 text-md ml-auto cursor-pointer"></i>)}
                    </div>
                    <div ref={setFrameNodeRef} className={`w-full min-h-10 h-auto bg-white border-blue-400 border-2 rounded-xl mt-2 ${isOverFrame ? 'ring-4 ring-blue-700' : ''}`}>
                        {items?.map((item) => 
                            <DraggableItem key={item.id} id={item.id}>
                                <VariableButton key={item.id} id={item.id} name={item.name} value={item.value} type={item.type} position={item.position} items={item.items} onInputChange={onInputChange} onDelete={onDelete} />
                            </DraggableItem>
                        )}
                    </div>
                </div>
            );
        case "ret":
            return (
                <div className="text-sm flex flex-row font-bold items-center bg-green-200 hover:bg-green-300 py-2 px-4 rounded-xl border-2 border-green-300 h-10 mt-2 ml-2 mr-2 mb-1 w-95/100 z-1000 cursor-move">
                    <p>return</p>
                    <input id={uuidv4()} onPointerDown={(e) => e.stopPropagation()} type="text" className="bg-white ml-2 mr-2 text-black w-1/2 rounded-full pl-2" value={value || ""} onChange={e => onInputChange(id, name, e.target.value, position, type)} />
                    {position !== "bank" && (<i onPointerDown={(e) => e.stopPropagation()} onClick={() => onDelete(id, type, position)} className="fa-solid fa-trash active:text-red-600 text-md ml-auto cursor-pointer"></i>)}
                </div>
            )
        case "object":
            const { setNodeRef: setObjectNodeRef, isOver: isOverObject } = useDroppable({ id: `object-droppable-${id}`});
            return (
                <div className="text-sm flex flex-col bg-orange-300 hover:bg-orange-400 font-bold py-2 px-4 rounded-xl border-2 border-orange-400 mt-2 ml-2 mr-2 mb-1 w-95/100 cursor-move">
                    {/* <p>{id}</p> */}
                    <div className="flex flex-row items-center">
                        <div className="flex flex-row items-center">
                            <input id={uuidv4()} onPointerDown={(e) => e.stopPropagation()} type="text" className="bg-white ml-2 text-black w-1/2 rounded-full pl-2" value={name || ""} onChange={e => onInputChange(id, e.target.value, value, position, type)}></input>
                        </div>
                        <div className="flex flex-row items-center ml-auto">
                            <input id={uuidv4()} onPointerDown={(e) => e.stopPropagation()} type="text" className="bg-white mr-2 text-black w-full rounded-full pl-2" value={value || ""} onChange={e => onInputChange(id, name, e.target.value, position, type)}></input>
                            {position !== "bank" && (<i onPointerDown={(e) => e.stopPropagation()} onClick={() => onDelete(id, type, position)} className="fa-solid fa-trash active:text-red-600 text-md ml-auto cursor-pointer"></i>)}
                        </div>
                    </div>
                    <div ref={setObjectNodeRef} className={`w-full min-h-10 h-auto bg-white border-orange-400 border-2 rounded-xl mt-2 ${isOverObject ? 'ring-4 ring-orange-700' : ''}`}>
                        {items?.map((item) => 
                            <DraggableItem key={item.id} id={item.id}>
                                <VariableButton key={item.id} id={item.id} name={item.name} value={item.value} type={item.type} position={item.position} items={item.items} onInputChange={onInputChange} onDelete={onDelete} />
                            </DraggableItem>
                        )}
                    </div>
                </div>
            );
    };
};

export default VariableButton;