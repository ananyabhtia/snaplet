import { useDroppable } from "@dnd-kit/core";

const MemorySlot = ({id, label, items}) => {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div ref={setNodeRef} className="border-2 rounded-xl w-1/3 h-[calc(100%-1rem)] m-2 bg-white overflow-auto">
            <h1>{label}</h1>
            {items.map((item, index) => 
                <button  key={index} className="bg-gray-200 hover:bg-gray-400 font-bold py-2 px-4 rounded-full border-2 h-10 m-1">
                    {item.label}
                </button>
            )}
        </div>
    );
};

const MemoryWindow = ({globalsItems, stackItems, heapItems}) => {
    return (
        <div className="flex flex-row w-full h-11/12 border-2 border-yellow-700 rounded-xl items-end bg-gray-300">
            <MemorySlot id='globals-area' label="globals" items={globalsItems} />
            <MemorySlot id='stack-area' label="stack" items={stackItems} />
            <MemorySlot id='heap-area' label="globals" items={heapItems} />
        </div>
    );
};

export default MemoryWindow;