import { useDroppable } from "@dnd-kit/core";
import VariableButton from "./VariableButton";
import DraggableItem from "./DraggableItem";
import { v4 as uuidv4 } from "uuid";

// MemorySlot : component representing a segment of computer memory (globals || stack || heap),
//              all VariableButton types can be dragged into here
//  props: {id, label, items, frameItems, objectItems, onInputChange, onDelete}
//      id: uuid for this slot, used to make this a unique droppable zone for dnd-kit
//      label: memory slot title (globals || stack || heap)
//      items: state variable containing all VariableButton items currently placed in this memory slot 
//             (globalsItems || stackItems || heapItems)
//      frameItems: all VariableButton items in all stack frames for the current step
//      objectItems: all VariableButton items in all heap objects for the current step
//      onInputChange, onDelete: handlers
const MemorySlot = ({id, label, items, frameItems, objectItems, onInputChange, onDelete}) => {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div ref={setNodeRef} className="border-2 rounded-xl flex-1 m-2 bg-white overflow-y-auto overflow-x-hidden flex flex-col" style={{height: '73.4vh', maxHeight: '73.4vh'}}>
            <h1 className="flex-shrink-0">{label}</h1>
                {items.map((item) => {
                    let currItems = [];

                    if (item.type === "frame" && frameItems[item.id]) {
                        currItems = frameItems[item.id];
                    } else if (item.type === "object" && objectItems[item.id]) {
                        currItems = objectItems[item.id];
                    }

                    return(
                        <DraggableItem key={item.id} id={item.id}>
                            <VariableButton key={item.id} id={item.id} name={item.name} value={item.value} type={item.type} position={item.position} items={currItems} onInputChange={onInputChange} onDelete={onDelete} />
                        </DraggableItem>
                    );
                })}
        </div>
    );
};

// MemoryWindow : component consisting of three MemorySlot components to represent a computer's memory,
//                primary droppable zone for VariableButton items,
//                also displays currentStep and totalSteps,
//                contains text input for user to enter lineNumber, saves this to lineNumber state variable
const MemoryWindow = ({globalsItems, stackItems, heapItems, frameItems, objectItems, onInputChange, onDelete, totalSteps, lineNumber, setLineNumber, currentStep, onDeleteStep }) => {
    return (
        <div className="flex flex-col w-full border-2 rounded-xl bg-gray-200" style={{height: '82vh'}}>
            <div className="flex flex-row items-center mt-2 px-2">
                <div className="flex-1" />
                <div className="flex flex-row items-center justify-center gap-2">
                    <div className="flex flex-row bg-purple-300 font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-full items-center text-xs sm:text-sm cursor-default">
                        <p>line number</p>
                        <input id={uuidv4()} type="text" value={lineNumber} onChange={e => setLineNumber(e.target.value)} className="bg-white ml-1 sm:ml-2 text-black rounded-full pl-1 sm:pl-2 w-6 sm:w-10 text-xs sm:text-sm"></input>
                    </div>
                    <div className="flex flex-row bg-purple-300 font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-full items-center text-xs sm:text-sm cursor-default">
                        <p>step number</p>
                        <input id={uuidv4()} value={currentStep} readOnly={true} type="text" className="bg-white ml-1 sm:ml-2 text-black rounded-full pl-1 sm:pl-2 w-6 sm:w-10 text-xs sm:text-sm cursor-default"></input>
                    </div>
                    <div className="flex flex-row bg-purple-300 font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-full items-center text-xs sm:text-sm cursor-default">
                        <p>total steps</p>
                        <input id={uuidv4()} type="text" value={totalSteps} readOnly={true} className="bg-white ml-1 sm:ml-2 text-black rounded-full pl-1 sm:pl-2 w-6 sm:w-10 text-xs sm:text-sm cursor-default"></input>
                    </div>
                </div>
                <div className="flex-1 flex justify-end">
                    <div onClick={onDeleteStep} className="flex flex-row bg-fuchsia-300 hover:bg-fuchsia-400 active:bg-fuchsia-700 font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-full items-center text-xs sm:text-sm cursor-pointer">
                        <p>delete step</p>
                        <i className="ml-2 fa-solid fa-trash"></i>
                    </div>
                </div>
            </div>
            <div className="flex flex-row w-full rounded-xl" style={{height: '72vh', maxHeight: '72vh'}}>
                <MemorySlot id='globals-area' label="globals" items={globalsItems} frameItems={frameItems} objectItems={objectItems} onInputChange={onInputChange} onDelete={onDelete} />
                <MemorySlot id='stack-area' label="stack" items={stackItems} frameItems={frameItems} objectItems={objectItems} onInputChange={onInputChange} onDelete={onDelete} />
                <MemorySlot id='heap-area' label="heap" items={heapItems} frameItems={frameItems} objectItems={objectItems} onInputChange={onInputChange} onDelete={onDelete} />
            </div>
        </div>
    );
};

export default MemoryWindow;