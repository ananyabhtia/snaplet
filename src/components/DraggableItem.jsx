import { useDraggable } from "@dnd-kit/core"

// DraggableItem : component wrapper placed around all VariableButton items to make them draggable
//                 using dnd-kit's useDraggable function
const DraggableItem = ({ id, children }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id,
        data: children.props,
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

export default DraggableItem;