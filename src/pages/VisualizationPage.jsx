import { useState } from "react";
import { DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { v4 as uuidv4 } from "uuid";
import Header from "../components/Header";
import ButtonBox from "../components/ButtonBox";
import MemoryWindow from "../components/MemoryWindow";
import CodeWindow from "../components/CodeWindow";
import VariablesWindow from "../components/VariablesWindow";


const VisPage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [totalSteps, setTotalSteps] = useState(1);
    const [lineNumber, setLineNumber] = useState();
    const [stepData, setStepData] = useState({});
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
        const draggedFromFrame = item.position.startsWith("stack-frame-");
        const draggedFromBank = !draggedFromGlobals && !draggedFromStack && !draggedFromHeap && !draggedFromFrame;

        if (over?.id === "globals-area") {
            if (!draggedFromGlobals) {
                setGlobalsItems((prev) => [...prev, {...item, position: "globals"}]);
            }
            if (draggedFromHeap) {
                setHeapItems(heapItems.filter(heapItem => heapItem.id !== item.id));
            }
            if (draggedFromStack) {
                setStackItems(stackItems.filter(stackItem => stackItem.id !== item.id));
            }
            if (draggedFromFrame) {
                const oldFrameID = item.position.replace("stack-frame-", "");
                setFrameItems((prev) => ({...prev, [oldFrameID]: prev[oldFrameID].filter(frameItem => frameItem.id !== item.id)}))
            }
        } else if (over?.id === "stack-area") {
            if (!draggedFromStack) {
                setStackItems((prev) => [...prev, {...item, position: "stack"}]);
            }
            if (draggedFromGlobals) {
                setGlobalsItems(globalsItems.filter(globalsItem => globalsItem.id !== item.id));
            }
            if (draggedFromHeap) {
                setHeapItems(heapItems.filter(heapItem => heapItem.id !== item.id));
            }
            if (draggedFromFrame) {
                const oldFrameID = item.position.replace("stack-frame-", "");
                setFrameItems((prev) => ({...prev, [oldFrameID]: prev[oldFrameID].filter(frameItem => frameItem.id !== item.id)}))
            }
        } else if (over?.id === "heap-area") {
            if (!draggedFromHeap) {
                setHeapItems((prev) => [...prev, {...item, position: "heap"}]);
            }
            if (draggedFromGlobals) {
                setGlobalsItems(globalsItems.filter(globalsItem => globalsItem.id !== item.id));
            }
            if (draggedFromStack) {
                setStackItems(stackItems.filter(stackItem => stackItem.id !== item.id));
            }
            if (draggedFromFrame) {
                const oldFrameID = item.position.replace("stack-frame-", "");
                setFrameItems((prev) => ({...prev, [oldFrameID]: prev[oldFrameID].filter(frameItem => frameItem.id !== item.id)}))
            }
        } else if (over?.id.startsWith("frame-droppable-")) {
            const frameID = over.id.replace("frame-droppable-", "");
            const oldFrameID = item.position.replace("stack-frame-", "");
            if (item.id !== frameID) {
                if (draggedFromGlobals) {
                    setGlobalsItems(globalsItems.filter(globalsItem => globalsItem.id !== item.id));
                }
                if (draggedFromStack) {
                    setStackItems(stackItems.filter(stackItem => stackItem.id !== item.id));
                }
                if (draggedFromHeap) {
                    setHeapItems(heapItems.filter(heapItem => heapItem.id !== item.id));
                }
                if (!draggedFromFrame) {
                    setFrameItems((prev) => ({
                        ...prev, 
                        [frameID]: [...(prev[frameID] || []), {...item, position: `stack-frame-${frameID}`}]}));
                } else if (oldFrameID !== frameID) {
                    setFrameItems((prev) => ({
                        ...prev, 
                        [frameID]: [...(prev[frameID] || []), {...item, position: `stack-frame-${frameID}`}],
                        [oldFrameID]: prev[oldFrameID].filter(frameItem => frameItem.id !== item.id)}));
                }
            }
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

    const onInputChange = (id, name, value, position, type) => {
        if (position === "globals") {
            setGlobalsItems((prev) => 
                prev.map(item => item.id === id ? {...item, name: name, value: value} : item));
        } else if (position === "stack") {
            setStackItems((prev) => 
                prev.map(item => item.id === id ? {...item, name: name, value: value} : item));
        } else if (position === "heap") {
            setHeapItems((prev) => 
                prev.map(item => item.id === id ? {...item, name: name, value: value} : item));
        } else if (position === "bank") {
            if (type === "variable") {
                setVariableItems((prev) => 
                    prev.map(item => item.id === id ? {...item, name: name, value: value} : item));
            } else if (type === "frame") {
                setActiveFrames((prev) => 
                    prev.map(item => item.id === id ? {...item, name: name, value: value} : item));
            }
        } else if (position.startsWith("stack-frame-")) {
            const frameID = position.replace("stack-frame-", "");
            setFrameItems((prev) => ({...prev, 
                [frameID]: prev[frameID].map(item => item.id === id ? {...item, name: name, value: value} : item)}))
        }
    };

    const handleSaveButton = () => {
        setStepData((prev) => ({...prev, [currentStep]: {
            'globals': globalsItems,
            'stack': stackItems,
            'heap': heapItems,
            'frames': frameItems,
            'line': lineNumber
        }}))
        console.log(stepData);
    };

    const handlePreviousButton = () => {
        if (currentStep > 1) {
            const newStepCount = currentStep - 1;
            setCurrentStep((prev) => prev - 1);

            setStepData((prev) => {
                const updatedStepData = {...prev, [currentStep]: {
                    'globals': globalsItems,
                    'stack': stackItems,
                    'heap': heapItems,
                    'frames': frameItems, 
                    'line': lineNumber
                }};

                const previousStepData = updatedStepData[newStepCount];
                if (previousStepData) {
                    setGlobalsItems(previousStepData.globals);
                    setStackItems(previousStepData.stack);
                    setHeapItems(previousStepData.heap);
                    setFrameItems(previousStepData.frames);
                    setLineNumber(previousStepData.line);
                    setCurrentStep(newStepCount);
                }
                console.log(currentStep);
                console.log(previousStepData);
                return updatedStepData;
            });
        }
    };

    const handleNextButton = () => {
        const newStepCount = currentStep + 1;
        setCurrentStep((prev) => prev + 1);
        if (newStepCount > Object.keys(stepData).length) {
            setTotalSteps((prev) => prev + 1);
            setLineNumber("");
        };
        console.log(currentStep);
        console.log(newStepCount);
        console.log(stepData[newStepCount]);
        console.log(stepData);

        setStepData((prev) => {
            const updatedStepData = {...prev, [currentStep]: {
                'globals': globalsItems,
                'stack': stackItems,
                'heap': heapItems,
                'frames': frameItems,
                'line': lineNumber
            }};

            const nextStepData = updatedStepData[newStepCount];
            if (nextStepData) {
                setGlobalsItems(nextStepData.globals);
                setStackItems(nextStepData.stack);
                setHeapItems(nextStepData.heap);
                setFrameItems(nextStepData.frames);
                setLineNumber(nextStepData.line);
                setCurrentStep(newStepCount);
            }
            console.log(currentStep);
            console.log(nextStepData);
            console.log(updatedStepData);
            return updatedStepData;
        })
    };

    return (
        <DndContext sensors={sensors} onDragEnd={HandleDragEnd}>
            <div className="px-8 py-4 h-screen flex flex-col">
                <Header />
                <div className="flex flex-row w-full flex-1 border-pink-500 rounded-xl">
                    <div className="flex flex-col w-2/3 h-full border-green-600 rounded-xl mr-2">
                        <ButtonBox handleSave={handleSaveButton} handlePrev={handlePreviousButton} handleNext={handleNextButton} currentStep={currentStep} totalSteps={totalSteps} lineNumber={lineNumber} setLineNumber={setLineNumber} />
                        <MemoryWindow globalsItems={globalsItems} stackItems={stackItems} heapItems={heapItems} frameItems={frameItems} onInputChange={onInputChange} />
                    </div>
                    <div className="flex flex-col w-1/3 h-full border-purple-600 rounded-xl">
                        <CodeWindow />
                        <VariablesWindow variableItems={variableItems} frameItems={frameItems} activeFrames={activeFrames} onInputChange={onInputChange} />
                    </div>
                </div>
            </div>
        </DndContext>
    );
};

export default VisPage;