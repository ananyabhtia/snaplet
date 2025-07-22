import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import VariableButton from "./variableButton";
import DraggableItem from "./DraggableItem";

const VariablesWindow = ({ frameItems }) => {
    return (
        <div className="w-full h-5/11 border-2 rounded-xl bg-gray-300">
            <DraggableItem id="variable-1" label="beep" type="frame">
                <VariableButton name="beep" value="beep" type="frame" items={frameItems} />
            </DraggableItem>
            <p>stack frame</p>
            <DraggableItem id="variable-2" label="" type="variable">
                <VariableButton name="" value="" type="variable" />
            </DraggableItem>
            <p>variable</p>
        </div>
    );
};

export default VariablesWindow;