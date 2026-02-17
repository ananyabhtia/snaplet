import { useState } from "react";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { v4 as uuidv4 } from "uuid";
import Header from "../components/Header";
import ButtonBox from "../components/ButtonBox";
import MemoryWindow from "../components/MemoryWindow";
import CodeWindow from "../components/CodeWindow";
import VariablesWindow from "../components/VariablesWindow";
import VariableButton from "../components/VariableButton";
import { jsPDF } from "jspdf";
import { toJpeg } from "html-to-image";

// Main program tracing interface page
// Contains Header, CodeWindow, MemoryWindow, VariablesWindow components 
const VisPage = () => { 

    // diagramTitle (string): diagram title
    const [diagramTitle, setDiagramTitle] = useState("untitled-diagram");

    //  currentStep (int): current step of the diagram
    const [currentStep, setCurrentStep] = useState(1);

    //  totalSteps (int): total steps in the diagram so far
    const [totalSteps, setTotalSteps] = useState(1);

    //  lineNumber (string): line number that corresponds to the current step
    const [lineNumber, setLineNumber] = useState("");

    //  stepData (object): object where keys are step numbers and values are
    const [stepData, setStepData] = useState({});

    //  variableItems (array): to render new variable objects inside the variable window  
    const [variableItems, setVariableItems] = useState([
        { id: uuidv4(), name: "", value: "", type: "variable" }
    ]);

    //  activeFrames (array): to render new frame objects inside the variable window
    const [activeFrames, setActiveFrames] = useState([
        { id: uuidv4(), name: "", value: "", type: "frame" }
    ]);

    //  activeReturns (array): to render new return objects inside the variable window
    const [activeReturns, setActiveReturns] = useState([
        {id: uuidv4(), name: "", value: "", type: "ret"}
    ]);

    //  activeObjects (array): to render new heap objects inside the variable window
    const [activeObjects, setActiveObjects] = useState([
        {id: uuidv4(), name: "", value: "", type: "object"}
    ]);

    //  globalsItems (array): array containing the variable/return/stack/heap objects in the globals 
    //  section for the current step
    const [globalsItems, setGlobalsItems] = useState([]);

    //  stackItems (array): array containing the variable/return/stack/heap objects in the stack section 
    //  for the current step
    const [stackItems, setStackItems] = useState([]);

    //  heapItems (array): array containing the variable/return/stack/heap objects in the heap section 
    //  for the current step
    const [heapItems, setHeapItems] = useState([]);

    //  frameItems(array): array of objects where keys are frameIDs and values are all variable/return/
    //  stack/heap objects in all stack frames for the current step
    const [frameItems, setFrameItems] = useState([]);

    //  objectItems(array): array of objects where keys are objectIDs and values are all variable/return/
    //  stack/heap objects in all heapObjects for the current step
    const [objectItems, setObjectItems] = useState([]);

    // activeDragItem: state to store item currently being dragged
    const [activeDragItem, setActiveDragItem] = useState(null);

    // // uploadedFile: state to store file uploaded for import functionalit
    // const [uploadedFile, setUploadedFile] = useState(null);

    const pointerSensor = useSensor(PointerSensor);
    const sensors = useSensors(pointerSensor);

    const HandleDragStart = (event) => {
        setActiveDragItem(event.active.data.current);
    };

    // HandleDragEnd(event) : function to handle drag end for active drag item
    //  1. checks drag item's source (bank || globals || stack || heap || frame || object)
    //  2. adds the drag item to the state variable corresponding to its destination
    //  3. removes the drag item from the state variable corresponding to its source
    //  4. if the drag item's source was the bank, resets the corresponding state to render a new object
    //     of that type in the bank
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

    // onInputChange(id, name, value, position, type) : 
    //  function to update state variables when the text inputs of drag items are modified
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

    // onDelete(id, type, position) :
    //  function to remove object from corresponding state variable when it is deleted from UI
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

    // handleSaveButton() :
    //  function to save current step's data in stepData state variable
    const handleSaveButton = () => new Promise((resolve) => {
    setStepData((prev) => {
        const newData = {
        ...prev,
        [currentStep]: {
            globals: globalsItems,
            stack: stackItems,
            heap: heapItems,
            frames: frameItems,
            objects: objectItems,
            line: lineNumber,
        },
        };
        resolve(newData);
        return newData;
    });
    });

    // handlePreviousButton() :
    //  function to handle previous button click
    //  1. sets currentStep to currentStep - 1
    //  2. sets globalsItems, stackItems, heapItems, frameItems, objectItems, lineNumber to 
    //     saved values from previous step's stepData
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
                return updatedStepData;
            });
        }
    };

    // handleNextButton() :
    //  function to handle next button click
    //  1. sets currentStep to currentStep + 1
    //  2. sets globalsItems, stackItems, heapItems, frameItems, objectItems, lineNumber to 
    //     saved values from next step's stepData
    const handleNextButton = () => {
        if (currentStep < totalSteps) {
            const newStepCount = currentStep + 1;
            setCurrentStep((prev) => prev + 1);

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
                return updatedStepData;
            });
        }
    }

    // handleAddButton() :
    //  function to add a new step
    //  1. sets currentStep to currentStep + 1
    //  2. increments totalSteps
    //  3. sets globalsItems, stackItems, heapItems, frameItems, objectItems, lineNumber to 
    //     saved values from previous step's stepData
    const handleAddButton = () => {
        const newStepCount = currentStep + 1;
        setCurrentStep((prev) => prev + 1);
        if (newStepCount > Object.keys(stepData).length) {
            setTotalSteps((prev) => prev + 1);
            setLineNumber("");
        };

        setStepData((prev) => {
            const updatedStepData = {...prev, [currentStep]: {
                'globals': globalsItems,
                'stack': stackItems,
                'heap': heapItems,
                'frames': frameItems,
                'objects': objectItems,
                'line': lineNumber
            }};

            const newStepData = updatedStepData[newStepCount];
            if (newStepData) {
                setGlobalsItems(newStepData.globals);
                setStackItems(newStepData.stack);
                setHeapItems(newStepData.heap);
                setFrameItems(newStepData.frames);
                setObjectItems(newStepData.objects);
                setLineNumber(newStepData.line);
                setCurrentStep(newStepCount);
            }
            return updatedStepData;
        })
    };

    // handleSnap() : function to download the diagram as a custom .snap filetype
    const handleSnap = () => {
        const newStepData = {
            ...stepData,
            [currentStep]: {
            globals: globalsItems,
            stack: stackItems,
            heap: heapItems,
            frames: frameItems,
            objects: objectItems,
            line: lineNumber,
            },
        };

        setStepData(newStepData);

        setGlobalsItems(newStepData[1].globals);
        setStackItems(newStepData[1].stack);
        setHeapItems(newStepData[1].heap);
        setFrameItems(newStepData[1].frames);
        setObjectItems(newStepData[1].objects);
        setLineNumber(newStepData[1].line);
        setCurrentStep(1);

        const snapData = {
            metadata: {
                title: diagramTitle,
                snapletVersion: 1,
                totalSteps: totalSteps},
            content: newStepData
        };

        const stepJSON = JSON.stringify(snapData, null, 2);
        const blob = new Blob([stepJSON], {type: 'application/json'});
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = `${diagramTitle.replace(/\s+/g, '_')}.snap`;

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        console.log('meow');
    }

    

    // handlePDF() : function to create and download snapshots of all steps in PDF format
    //  iterates over all steps, takes an image of the memory window and adds to document
    const handlePDF = async () => {

        const doc = new jsPDF({
            orientation: "portrait",
            unit: "in",
            format: [8.5, 11]
        });
        
        const newStepData = {
            ...stepData,
            [currentStep]: {
            globals: globalsItems,
            stack: stackItems,
            heap: heapItems,
            frames: frameItems,
            objects: objectItems,
            line: lineNumber,
            },
        };

        setStepData(newStepData);

        setGlobalsItems(newStepData[1].globals);
        setStackItems(newStepData[1].stack);
        setHeapItems(newStepData[1].heap);
        setFrameItems(newStepData[1].frames);
        setObjectItems(newStepData[1].objects);
        setLineNumber(newStepData[1].line);
        setCurrentStep(1);

        const nextButton = document.getElementById("next");
        for (let i = 1; i <= totalSteps; i++) {
            let node = document.getElementById('capture');
            let dataUrl = await toJpeg(node, {quality: 0.8, 
                filter: (domNode) => {
                    if (domNode.classList?.contains("exclude-from-pdf")) {
                return false;
            }
            return true;
        }});
            let img = document.createElement('img');

            img.src = dataUrl;

            const imgProps = doc.getImageProperties(dataUrl);
            const pdfWidth = doc.internal.pageSize.getWidth();
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

            doc.addImage(dataUrl, "JPEG", 0.5, 0.5, pdfWidth / 1.15, imgHeight / 1.15);

            if (i < totalSteps) {
                doc.addPage();
                nextButton.click();
            }
        }

        doc.save("diagram.pdf");
    }

    // handleImport(event) : function to handle file upload for import functionality
    const handleImport = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        console.log("Importing file:", file);

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target.result;
                const data = JSON.parse(content);
                setStepData(data.content);
                setDiagramTitle(data.metadata.title);
                setTotalSteps(data.metadata.totalSteps);
                setGlobalsItems(data.content[1].globals);
                setStackItems(data.content[1].stack);
                setHeapItems(data.content[1].heap);
                setFrameItems(data.content[1].frames);
                setObjectItems(data.content[1].objects);
                setLineNumber(data.content[1].line);
                setCurrentStep(1);
            } catch (error) {
                console.error("error parsing file:", error);
            }
        }
        reader.readAsText(file);
    };


    // Visualization page JSX code, also contains dnd-kit context code to enable drag-and-drop
    return (
        <DndContext sensors={sensors} onDragStart={HandleDragStart} onDragEnd={HandleDragEnd}>
            <div className="px-8 pb-4 pt-2 h-screen flex flex-col bg-white">
                <Header />
                <div className="flex flex-row w-full flex-1 border-pink-500 rounded-xl bg-white">
                    <div id="capture" className="flex flex-col w-2/3 h-full border-green-600 rounded-xl mr-2 bg-white">
                        <ButtonBox handleImport={handleImport} handleSave={handleSaveButton} handlePrev={handlePreviousButton} handleNext={handleNextButton} handleAdd={handleAddButton} handlePDF={handlePDF} handleSnap={handleSnap} currentStep={currentStep} totalSteps={totalSteps} lineNumber={lineNumber} setLineNumber={setLineNumber} diagramTitle={diagramTitle} setDiagramTitle={setDiagramTitle} />
                        <MemoryWindow globalsItems={globalsItems} stackItems={stackItems} heapItems={heapItems} frameItems={frameItems} objectItems={objectItems} onInputChange={onInputChange} onDelete={onDelete} totalSteps={totalSteps} lineNumber={lineNumber} setLineNumber={setLineNumber} currentStep={currentStep} />
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