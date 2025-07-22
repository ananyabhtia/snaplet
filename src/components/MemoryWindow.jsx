import { useDroppable } from "@dnd-kit/core";
import VariableButton from "./variableButton";
import DraggableItem from "./DraggableItem";

const MemorySlot = ({id, label, items}) => {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div ref={setNodeRef} className="border-2 rounded-xl w-1/3 h-[calc(100%-1rem)] m-2 bg-white overflow-auto">
            <h1>{label}</h1>
            {items.map((item) => 
                // <DraggableItem id={item.id} label={item.label} type={item.type}>
                    <VariableButton key={item.id} name={item.label} value="" type={item.type} />
                // </DraggableItem>
            )}
        </div>
    );
};

const MemoryWindow = ({globalsItems, stackItems, heapItems}) => {
    return (
        <div className="flex flex-row w-full h-11/12 border-2 border-yellow-700 rounded-xl items-end bg-gray-300">
            <MemorySlot id='globals-area' label="globals" items={globalsItems} />
            <MemorySlot id='stack-area' label="stack" items={stackItems} />
            <MemorySlot id='heap-area' label="heap" items={heapItems} />
        </div>
    );
};

export default MemoryWindow;