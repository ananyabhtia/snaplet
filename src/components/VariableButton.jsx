import { useDroppable } from "@dnd-kit/core";
import DraggableItem from "./DraggableItem";

const VariableButton = ({ id, name, value, type, position, items, onInputChange, onDelete }) => {

    switch (type) {
        case "variable":
            // console.log('VariableButton props:', { id, name, value, type, position, onInputChange });
            return (
                <div className="text-sm flex flex-row items-center bg-pink-200 hover:bg-pink-400 font-bold py-2 px-4 rounded-xl border-2 h-10 m-2 w-95/100 z-1000 cursor-move">
                    {/* <p>{id}</p> */}
                    <input onPointerDown={(e) => e.stopPropagation()} type="text" className="bg-white ml-2 mr-2 text-black w-2/6 rounded-full pl-2" value={name} onChange={e => onInputChange(id, e.target.value, value, position, type)}></input>
                    <p>=</p>
                    <input onPointerDown={(e) => e.stopPropagation()} type="text" className="bg-white ml-2 mr-2 text-black w-3/6 rounded-full pl-2" value={value} onChange={e => onInputChange(id, name, e.target.value, position, type)}></input>
                    {position !== "bank" && (<i onPointerDown={(e) => e.stopPropagation()} onClick={() => onDelete(id, type, position)} className="fa-solid fa-trash active:text-red-600 text-md ml-auto cursor-pointer"></i>)}
                </div>
            );
        case "frame":
            const { setNodeRef, isOver } = useDroppable({ id: `frame-droppable-${id}`});
            return (
                <div className="text-sm flex flex-col bg-blue-200 hover:bg-blue-400 font-bold py-2 px-4 rounded-xl border-2 m-2 w-95/100 cursor-move">
                    {/* <p>{id}</p> */}
                    <div className="flex flex-row items-center">
                        <input onPointerDown={(e) => e.stopPropagation()} type="text" className="bg-white ml-2 mr-2 text-black w-4/5 rounded-full pl-2" value={name} onChange={e => onInputChange(id, e.target.value, value, position, type)}></input>
                        {position !== "bank" && (<i onPointerDown={(e) => e.stopPropagation()} onClick={() => onDelete(id, type, position)} className="fa-solid fa-trash active:text-red-600 text-md ml-auto cursor-pointer"></i>)}
                    </div>
                    <div ref={setNodeRef} className={`w-full min-h-10 h-auto bg-white border-black border-2 rounded-xl mt-2 ${isOver ? 'ring-4 ring-blue-700' : ''}`}>
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
                <div className="text-sm flex flex-row font-bold items-center bg-green-200 hover:bg-green-400 py-2 px-4 rounded-xl border-2 h-10 m-2 w-95/100 z-1000 cursor-move">
                    <p>return</p>
                    <input onPointerDown={(e) => e.stopPropagation()} type="text" className="bg-white ml-2 mr-2 text-black w-1/2 rounded-full pl-2" value={value} onChange={e => onInputChange(id, name, e.target.value, position, type)} />
                    {position !== "bank" && (<i onPointerDown={(e) => e.stopPropagation()} onClick={() => onDelete(id, type, position)} className="fa-solid fa-trash active:text-red-600 text-md ml-auto cursor-pointer"></i>)}
                </div>
            )
    };
};

export default VariableButton;