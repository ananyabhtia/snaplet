import { useState } from "react";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { v4 as uuidv4 } from "uuid";
import Header from "../components/Header";
import ButtonBox from "../components/ButtonBox";
import MemoryWindow from "../components/MemoryWindow";
import CodeWindow from "../components/CodeWindow";
import VariablesWindow from "../components/VariablesWindow";
import VariableButton from "../components/VariableButton";
import DraggableItem from "../components/DraggableItem";


const VisPage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [totalSteps, setTotalSteps] = useState(1);
    const [lineNumber, setLineNumber] = useState("");
    const [stepData, setStepData] = useState({});
    const [variableItems, setVariableItems] = useState([
        { id: uuidv4(), name: "", value: "", type: "variable" }
    ]);
    const [activeFrames, setActiveFrames] = useState([
        { id: uuidv4(), name: "", value: "", type: "frame" }
    ]);
    const [activeReturns, setActiveReturns] = useState([
        {id: uuidv4(), name: "", value: "", type: "ret"}
    ]);
    const [activeObjects, setActiveObjects] = useState([
        {id: uuidv4(), name: "", value: "", type: "object"}
    ]);
    const [globalsItems, setGlobalsItems] = useState([]);
    const [stackItems, setStackItems] = useState([]);
    const [heapItems, setHeapItems] = useState([]);
    const [frameItems, setFrameItems] = useState([]);
    const [objectItems, setObjectItems] = useState([]);
    const [activeDragItem, setActiveDragItem] = useState(null);
    const pointerSensor = useSensor(PointerSensor);
    const sensors = useSensors(pointerSensor);

    const HandleDragStart = (event) => {
        setActiveDragItem(event.active.data.current);
    };

    const HandleDragEnd = (event) => {
        const { active, over } = event;

        if (!over || !active.data.current) return;

        const item = active.data.current;

        const draggedFromGlobals = globalsItems.some((globalsItem) => globalsItem.id === item.id);
        const draggedFromStack = stackItems.some((stackItem) => stackItem.id === item.id);
        const draggedFromHeap = heapItems.some((heapItem) => heapItem.id === item.id);
        const draggedFromFrame = item.position.startsWith("stack-frame-");
        const draggedFromObject = item.position.startsWith("heap-object-");
        const draggedFromBank = !draggedFromGlobals && !draggedFromStack && !draggedFromHeap && !draggedFromFrame && !draggedFromObject;

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
            if (draggedFromObject) {
                const oldObjectID = item.position.replace("heap-object-", "");
                setObjectItems((prev) => ({...prev, [oldObjectID]: prev[oldObjectID].filter(objectItem => objectItem.id !== item.id)}))
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
            if (draggedFromObject) {
                const oldObjectID = item.position.replace("heap-object-", "");
                setObjectItems((prev) => ({...prev, [oldObjectID]: prev[oldObjectID].filter(objectItem => objectItem.id !== item.id)}))
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
            if (draggedFromObject) {
                const oldObjectID = item.position.replace("heap-object-", "");
                setObjectItems((prev) => ({...prev, [oldObjectID]: prev[oldObjectID].filter(objectItem => objectItem.id !== item.id)}))
            }
        } else if (over?.id.startsWith("frame-droppable-")) {
            const frameID = over.id.replace("frame-droppable-", "");
            const oldFrameID = item.position.replace("stack-frame-", "");
            const oldObjectID = item.position.replace("heap-object-", "");
            if (item.id !== frameID) { // to prevent self-drops

                // if the item started out in a section, remove it from that section
                if (draggedFromGlobals) {
                    setGlobalsItems(globalsItems.filter(globalsItem => globalsItem.id !== item.id));
                }
                if (draggedFromStack) {
                    setStackItems(stackItems.filter(stackItem => stackItem.id !== item.id));
                }
                if (draggedFromHeap) {
                    setHeapItems(heapItems.filter(heapItem => heapItem.id !== item.id));
                } 
                if (draggedFromObject) {
                    setObjectItems((prev) => ({
                        ...prev,
                        [oldObjectID]: prev[oldObjectID].filter(objectItem => objectItem.id !== item.id) 
                    }))
                }
                // if the item didn't start out in a stack frame, add it to the destination stack frame's items
                if (!draggedFromFrame) {
                    setFrameItems((prev) => ({
                        ...prev, 
                        [frameID]: [...(prev[frameID] || []), {...item, position: `stack-frame-${frameID}`}]}));
                
                // if the item did start out in a stack frame (checking if the drag origin and destination frames
                // are the same, if they are then don't do anything to prevent duplicates)
                // remove the item from the origin's items and add it to the destination's items
                } else if (oldFrameID !== frameID) {
                    setFrameItems((prev) => ({
                        ...prev, 
                        [frameID]: [...(prev[frameID] || []), {...item, position: `stack-frame-${frameID}`}],
                        [oldFrameID]: prev[oldFrameID].filter(frameItem => frameItem.id !== item.id)}));
                }
            }
        } else if (over?.id.startsWith("object-droppable-")) {
            const objectID = over.id.replace("object-droppable-", "");
            const oldFrameID = item.position.replace("stack-frame-", "");
            const oldObjectID = item.position.replace("heap-object-", "");
            if (item.id !== objectID) {
                if (draggedFromGlobals) {
                    setGlobalsItems(globalsItems.filter(globalsItem => globalsItem.id !== item.id));
                }
                if (draggedFromStack) {
                    setStackItems(stackItems.filter(stackItem => stackItem.id !== item.id));
                }
                if (draggedFromHeap) {
                    setHeapItems(heapItems.filter(heapItem => heapItem.id !== item.id));
                } 
                if (draggedFromFrame) {
                    setFrameItems((prev) => ({
                        ...prev,
                        [oldFrameID]: prev[oldFrameID].filter(objectItem => objectItem.id !== item.id) 
                    }))
                }
                if (!draggedFromObject) {
                    setObjectItems((prev) => ({
                        ...prev, 
                        [objectID]: [...(prev[objectID] || []), {...item, position: `heap-object-${objectID}`}]}));
                
                } else if (oldObjectID !== objectID) {
                    setObjectItems((prev) => ({
                        ...prev, 
                        [objectID]: [...(prev[objectID] || []), {...item, position: `heap-object-${objectID}`}],
                        [oldFrameID]: prev[oldFrameID].filter(objectItem => objectItem.id !== item.id)}));
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

        if (item.type === "ret") {
            if (draggedFromBank) {
                setActiveReturns((prev) => [
                    ...prev.filter((v) => v.id !== item.id),
                    { id: uuidv4(), name: "", value: "", type: "ret"}
                ])
            }
        }

        if (item.type === "object") {
            if (draggedFromBank) {
                setActiveObjects((prev) => [
                    ...prev.filter((v) => v.id !== item.id),
                    { id: uuidv4(), name: "", value: "", type: "object"}
                ])
            }
        }
        setActiveDragItem(null);
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
            } else if (type == "ret") {
                setActiveReturns((prev) =>
                    prev.map(item => item.id === id ? {...item, name: name, value: value} : item));
            } else if (type == "object") {
                setActiveObjects((prev) => 
                    prev.map(item => item.id === id ? {...item, name: name, value: value} : item));
            }
        } else if (position.startsWith("stack-frame-")) {
            const frameID = position.replace("stack-frame-", "");
            setFrameItems((prev) => ({...prev, 
                [frameID]: prev[frameID].map(item => item.id === id ? {...item, name: name, value: value} : item)}))
        } else if (position.startsWith("heap-object-")) {
            const objectID = position.replace("heap-object-", "");
            setObjectItems((prev) => ({...prev,
                [objectID]: prev[objectID].map(item => item.id === id ? {...item, name: name, value: value} : item)}))
        }
    };

    const onDelete = (id, type, position) => {
        if (type === "frame") {
            setFrameItems(prev => {
                const { [id]: removed, ...rest } = prev;
                return rest;
            });
        };
        if (type === "object") {
            setObjectItems(prev => {
                const { [id]: removed, ...rest} = prev;
                return rest;
            });
        };
        if (position === "globals") {
            setGlobalsItems(globalsItems.filter(item => item.id !== id));
        } else if (position === "stack") {
            setStackItems(stackItems.filter(item => item.id !== id));
        } else if (position === "heap") {
            setHeapItems(heapItems.filter(item => item.id !== id));
        } else if (position.startsWith("stack-frame-")) {
            const frameID = position.replace("stack-frame-", "");
            setFrameItems((prev) => ({...prev,
                [frameID]: prev[frameID].filter(item => item.id !== id)}));
        } else if (position.startsWith("heap-object-")) {
            const objectID = position.replace("heap-object-", "");
            setObjectItems((prev) => ({...prev,
                [objectID]: prev[objectID].filter(item => item.id !== id)}));
        }
    };

    const handleSaveButton = () => {
        setStepData((prev) => ({...prev, [currentStep]: {
            'globals': globalsItems,
            'stack': stackItems,
            'heap': heapItems,
            'frames': frameItems,
            'objects': objectItems,
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
                    'objects': objectItems,
                    'line': lineNumber
                }};

                const previousStepData = updatedStepData[newStepCount];
                if (previousStepData) {
                    setGlobalsItems(previousStepData.globals);
                    setStackItems(previousStepData.stack);
                    setHeapItems(previousStepData.heap);
                    setFrameItems(previousStepData.frames);
                    setObjectItems(previousStepData.objects);
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
                'objects': objectItems,
                'line': lineNumber
            }};

            const nextStepData = updatedStepData[newStepCount];
            if (nextStepData) {
                setGlobalsItems(nextStepData.globals);
                setStackItems(nextStepData.stack);
                setHeapItems(nextStepData.heap);
                setFrameItems(nextStepData.frames);
                setObjectItems(nextStepData.objects);
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
        <DndContext sensors={sensors} onDragStart={HandleDragStart} onDragEnd={HandleDragEnd}>
            <div className="px-8 pb-4 pt-2 h-screen flex flex-col">
                <Header />
                <div className="flex flex-row w-full flex-1 border-pink-500 rounded-xl">
                    <div className="flex flex-col w-2/3 h-full border-green-600 rounded-xl mr-2">
                        <ButtonBox handleSave={handleSaveButton} handlePrev={handlePreviousButton} handleNext={handleNextButton} currentStep={currentStep} totalSteps={totalSteps} lineNumber={lineNumber} setLineNumber={setLineNumber} />
                        <MemoryWindow globalsItems={globalsItems} stackItems={stackItems} heapItems={heapItems} frameItems={frameItems} objectItems={objectItems} onInputChange={onInputChange} onDelete={onDelete} />
                    </div>
                    <div className="flex flex-col w-1/3 h-full border-purple-600 rounded-xl">
                        <CodeWindow />
                        <VariablesWindow variableItems={variableItems} frameItems={frameItems} activeFrames={activeFrames} activeReturns={activeReturns} activeObjects={activeObjects} onInputChange={onInputChange} />
                    </div>
                </div>
            </div>
            <DragOverlay
                dropAnimation={{
                    duration: 125,
                    easing: "linear"
                }}>
                {activeDragItem ? (
                    <VariableButton 
                        id={activeDragItem.id} 
                        name={activeDragItem.name} 
                        value={activeDragItem.value} 
                        type={activeDragItem.type} 
                        position={activeDragItem.position} 
                        items={activeDragItem.items || []} 
                        onInputChange={onInputChange} 
                        onDelete={onDelete} 
                    />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};

export default VisPage;