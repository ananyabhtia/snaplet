import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import VariableButton from "./variableButton";
import DraggableItem from "./DraggableItem";

const VariablesWindow = ({ variableItems, frameItems, activeFrames }) => {
    return (
        <div className="w-full h-5/11 border-2 rounded-xl bg-gray-300">
            {activeFrames.map((item) => (
                <DraggableItem id={item.id} label={item.name} type="frame">
                    <VariableButton key={item.id} id={item.id} type="frame" items={frameItems} />
                </DraggableItem>
            ))}

            <p>stack frame</p>
            {variableItems.map((item) => (
                <DraggableItem id={item.id} label={item.name} type="variable">
                    <VariableButton key={item.id} id={item.id} name={item.name} value={item.value} type="variable" />
                </DraggableItem>
            ))}
            <p>variable</p>
        </div>
    );
};

export default VariablesWindow;