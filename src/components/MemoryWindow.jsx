import { useDroppable } from "@dnd-kit/core";
import VariableButton from "./VariableButton";
import DraggableItem from "./DraggableItem";

const MemorySlot = ({id, label, items, frameItems}) => {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div ref={setNodeRef} className="border-2 rounded-xl w-1/3 h-[calc(100%-1rem)] m-2 bg-white overflow-auto z-0">
            <h1>{label}</h1>
            {items.map((item) => 
                <DraggableItem key={item.id} id={item.id} label={item.label} type={item.type}>
                    <VariableButton key={item.id} id={item.id} name={item.label} value={item.value} type={item.type} items={item.type === "frame" && frameItems[item.id] ? frameItems[item.id] : []} />
                </DraggableItem>
            )}
        </div>
    );
};

const MemoryWindow = ({globalsItems, stackItems, heapItems, frameItems}) => {
    return (
        <div className="flex flex-row w-full h-11/12 border-2 rounded-xl items-end bg-gray-300 z-0">
            <MemorySlot id='globals-area' label="globals" items={globalsItems} frameItems={frameItems} />
            <MemorySlot id='stack-area' label="stack" items={stackItems} frameItems={frameItems} />
            <MemorySlot id='heap-area' label="heap" items={heapItems} frameItems={frameItems} />
        </div>
    );
};

export default MemoryWindow;