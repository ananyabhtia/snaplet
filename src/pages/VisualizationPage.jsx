import { useState } from "react";
import { DndContext } from "@dnd-kit/core";
import Header from "../components/Header";
import ButtonBox from "../components/ButtonBox";
import MemoryWindow from "../components/MemoryWindow";
import CodeWindow from "../components/CodeWindow";
import VariablesWindow from "../components/VariablesWindow";


const VisPage = () => {
    const [globalsItems, setGlobalsItems] = useState([]);
    const [stackItems, setStackItems] = useState([]);
    const [heapItems, setHeapItems] = useState([]);

    const HandleDragEnd = (event) => {
        const { active, over } = event;
    
        if (over?.id === "globals-area") {
            setGlobalsItems((items) => [...items, active.data.current]);
        } else if (over?.id === "stack-area") {
            setStackItems((items) => [...items, active.data.current]);
        } else if (over?.id === "heap-area") {
            setHeapItems((items) => [...items, active.data.current]);
        }
    };

    return (
        <DndContext onDragEnd={HandleDragEnd}>
            <div className="px-8 py-4">
                <Header />
                <div className="flex flex-row w-full h-183 border-2 border-pink-500 rounded-xl">
                    <div className="flex flex-col w-2/3 h-full border-2 border-green-600 rounded-xl">
                        <ButtonBox />
                        <MemoryWindow globalsItems={globalsItems} stackItems={stackItems} heapItems={heapItems} />
                    </div>
                    <div className="flex flex-col w-1/3 h-full border-2 border-purple-600 rounded-xl">
                        <CodeWindow />
                        <VariablesWindow />
                    </div>
                </div>
            </div>
        </DndContext>
    );
};

export default VisPage;