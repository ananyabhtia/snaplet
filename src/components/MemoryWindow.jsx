import { useDroppable } from "@dnd-kit/core";
import VariableButton from "./VariableButton";
import DraggableItem from "./DraggableItem";

const MemorySlot = ({id, label, items, frameItems, objectItems, onInputChange, onDelete}) => {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div ref={setNodeRef} className="border-2 rounded-xl w-1/3 m-2 bg-white overflow-y-auto overflow-x-hidden flex flex-col" style={{height: 'calc(100% - 1rem)'}}>
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

const MemoryWindow = ({globalsItems, stackItems, heapItems, frameItems, objectItems, onInputChange, onDelete}) => {
    return (
        <div className="flex flex-row w-full border-2 rounded-xl bg-gray-300" style={{height: '82vh'}}>
            <MemorySlot id='globals-area' label="globals" items={globalsItems} frameItems={frameItems} objectItems={objectItems} onInputChange={onInputChange} onDelete={onDelete} />
            <MemorySlot id='stack-area' label="stack" items={stackItems} frameItems={frameItems} objectItems={objectItems} onInputChange={onInputChange} onDelete={onDelete} />
            <MemorySlot id='heap-area' label="heap" items={heapItems} frameItems={frameItems} objectItems={objectItems} onInputChange={onInputChange} onDelete={onDelete} />
        </div>
    );
};

export default MemoryWindow;