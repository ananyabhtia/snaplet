import { useDraggable } from "@dnd-kit/core";
import VariableButton from "./variableButton";

const DraggableItem = ({ id, label, type, children }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id,
        data: { id, label, type },
    });

    const style = {
        transform : transform
            ? `translate(${transform.x}px, ${transform.y}px)`
            : undefined,
    };

    return (
        <div 
            ref={setNodeRef} 
            {...listeners} 
            {...attributes} 
            style={style} 
        >
            {children}
        </div>
    );
};

const VariablesWindow = () => {
    return (
        <div className="w-full h-5/11 border-2 rounded-xl bg-gray-300">
            <DraggableItem id="variable-1" label="beep" type="t2">
                <VariableButton name="beep" value="beep" type="t2" />
            </DraggableItem>
            <DraggableItem id="variable-2" label="boop" type="variable">
                <VariableButton name="" value="" type="variable" />
            </DraggableItem>
        </div>
    );
};

export default VariablesWindow;