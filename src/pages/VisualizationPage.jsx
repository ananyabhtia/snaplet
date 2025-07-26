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
    
        if (over?.id === "globals-area") {
            setGlobalsItems((prev) => [...prev, item]);
        } else if (over?.id === "stack-area") {
            setStackItems((prev) => [...prev, item]);
        } else if (over?.id === "heap-area") {
            setHeapItems((prev) => [...prev, item]);
        } else if (over?.id === "frame-droppable") {
            setFrameItems((prev) => [...prev, item]);
        }

        if (item.type === "variable") {
            setVariableItems((prev) => [
                ...prev.filter((v) => v.id !== item.id),
                { id: uuidv4(), name: "", value: "", type: "variable" }
            ])
        }

        if (item.type === "frame") {
            setActiveFrames((prev) => [
                ...prev.filter((v) => v.id !== item.id),
                { id: uuidv4(), name: "", value: "", type: "frame" }
            ])
        }

        console.log(item.id);
    };

    return (
        <DndContext sensors={sensors} onDragEnd={HandleDragEnd}>
            <div className="px-8 py-4 h-screen flex flex-col">
                <Header />
                <div className="flex flex-row w-full flex-1 border-2 border-pink-500 rounded-xl">
                    <div className="flex flex-col w-2/3 h-full border-2 border-green-600 rounded-xl">
                        <ButtonBox />
                        <MemoryWindow globalsItems={globalsItems} stackItems={stackItems} heapItems={heapItems} />
                    </div>
                    <div className="flex flex-col w-1/3 h-full border-2 border-purple-600 rounded-xl">
                        <CodeWindow />
                        <VariablesWindow variableItems={variableItems} frameItems={frameItems} activeFrames={activeFrames} />
                    </div>
                </div>
            </div>
        </DndContext>
    );
};

export default VisPage;