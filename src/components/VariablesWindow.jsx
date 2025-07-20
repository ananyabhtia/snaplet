import { useDraggable } from "@dnd-kit/core";

const DraggableButton = ({ id, label }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id,
        data: { id, label },
    });

    const style = {
        transform : transform
            ? `translate(${transform.x}px, ${transform.y}px)`
            : undefined,
    };

    return (
        <button 
            ref={setNodeRef} 
            {...listeners} 
            {...attributes} 
            style={style} 
            className="bg-gray-200 hover:bg-gray-400 font-bold py-2 px-4 rounded-full border-2 h-10 m-1"
        >
            {label}
        </button>
    );
};

const VariablesWindow = () => {
    return (
        <div className="w-full h-5/11 border-2 rounded-xl bg-gray-300">
            <DraggableButton id="variable-1" label="variable" />
        </div>
    );
};

export default VariablesWindow;