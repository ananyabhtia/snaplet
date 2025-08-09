import { useState } from "react";
import { DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { v4 as uuidv4 } from "uuid";
import Header from "../components/Header";
import ButtonBox from "../components/ButtonBox";
import MemoryWindow from "../components/MemoryWindow";
import CodeWindow from "../components/CodeWindow";
import VariablesWindow from "../components/VariablesWindow";


const VisPage = () => {
    const [variableItems, setVariableItems] = useState([
        { id: uuidv4(), name: "", value: "", type: "variable" }
    ]);
    const [activeFrames, setActiveFrames] = useState([
        { id: uuidv4(), name: "", value: "", type: "frame" }
    ]);
    const [globalsItems, setGlobalsItems] = useState([]);
    const [stackItems, setStackItems] = useState([]);
    const [heapItems, setHeapItems] = useState([]);
    const [frameItems, setFrameItems] = useState([]);
    const pointerSensor = useSensor(PointerSensor);
    const sensors = useSensors(pointerSensor);

    const HandleDragEnd = (event) => {
        const { active, over } = event;

        if (!over || !active.data.current) return;

        const item = active.data.current;
        const draggedFromGlobals = globalsItems.some((globalsItem) => globalsItem.id === item.id);
        const draggedFromStack = stackItems.some((stackItem) => stackItem.id === item.id);
        const draggedFromHeap = heapItems.some((heapItem) => heapItem.id === item.id);
        const draggedFromBank = !draggedFromGlobals && !draggedFromStack && !draggedFromHeap;

        if (over?.id === "globals-area") {
            if (!draggedFromGlobals) {
                setGlobalsItems((prev) => [...prev, item]);
            };
            if (draggedFromHeap) {
                setHeapItems(heapItems.filter(heapItem => heapItem.id !== item.id));
            };
            if (draggedFromStack) {
                setStackItems(stackItems.filter(stackItem => stackItem.id !== item.id));
            };
        } else if (over?.id === "stack-area") {
            if (!draggedFromStack) {
                setStackItems((prev) => [...prev, item]);
            };
            if (draggedFromGlobals) {
                setGlobalsItems(globalsItems.filter(globalsItem => globalsItem.id !== item.id));
            };
            if (draggedFromHeap) {
                setHeapItems(heapItems.filter(heapItem => heapItem.id !== item.id));
            };
        } else if (over?.id === "heap-area") {
            if (!draggedFromHeap) {
                setHeapItems((prev) => [...prev, item]);
            };
            if (draggedFromGlobals) {
                setGlobalsItems(globalsItems.filter(globalsItem => globalsItem.id !== item.id));
            };
            if (draggedFromStack) {
                setStackItems(stackItems.filter(stackItem => stackItem.id !== item.id));
            };
        } else if (over?.id.startsWith("frame-droppable-")) {
            const frameID = over.id.replace("frame-droppable-", "");
            setFrameItems((prev) => ({
                ...prev, 
                [frameID]: [...(prev[frameID] || []), item]}));
        }

        if (item.type === "variable") {
            if (draggedFromBank) {
                setVariableItems((prev) => [
                    ...prev.filter((v) => v.id !== item.id),
                    { id: uuidv4(), name: "", value: "", type: "variable" }
                ])
            }
        }

        if (item.type === "frame") {
            if (draggedFromBank) {
                setActiveFrames((prev) => [
                    ...prev.filter((v) => v.id !== item.id),
                    { id: uuidv4(), name: "", value: "", type: "frame" }
                ])
            }
        }
    };

    return (
        <DndContext sensors={sensors} onDragEnd={HandleDragEnd}>
            <div className="px-8 py-4 h-screen flex flex-col">
                <Header />
                <div className="flex flex-row w-full flex-1 border-pink-500 rounded-xl">
                    <div className="flex flex-col w-2/3 h-full border-green-600 rounded-xl mr-2">
                        <ButtonBox />
                        <MemoryWindow globalsItems={globalsItems} stackItems={stackItems} heapItems={heapItems} frameItems={frameItems} />
                    </div>
                    <div className="flex flex-col w-1/3 h-full border-purple-600 rounded-xl">
                        <CodeWindow />
                        <VariablesWindow variableItems={variableItems} frameItems={frameItems} activeFrames={activeFrames} />
                    </div>
                </div>
            </div>
        </DndContext>
    );
};

export default VisPage;