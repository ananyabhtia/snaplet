import VariableButton from "./VariableButton";
import DraggableItem from "./DraggableItem";

const VariablesWindow = ({ variableItems, activeFrames, activeReturns, activeObjects, onInputChange }) => {
    return (
        <div className="w-full h-5/11 border-2 rounded-xl bg-gray-300">
            {activeFrames.map((item) => (
                <DraggableItem key={item.id} id={item.id}>
                    <VariableButton key={item.id} id={item.id} name={item.name} type="frame" position="bank" items={[]} onInputChange={onInputChange} />
                </DraggableItem>
            ))}
            {/* <p className="mt-0 mb-1">stack frame</p> */}
            {variableItems.map((item) => (
                <DraggableItem key={item.id} id={item.id}>
                    <VariableButton key={item.id} id={item.id} name={item.name} value={item.value} type="variable" position="bank" onInputChange={onInputChange} />
                </DraggableItem>
            ))}
            {/* <p>variable</p> */}
            {activeReturns.map((item) => (
                <DraggableItem key={item.id} id={item.id}>
                    <VariableButton key={item.id} id={item.id} name={item.name} value={item.value} type="ret" position="bank" onInputChange={onInputChange} />
                </DraggableItem>
            ))}
            {activeObjects.map((item) => (
                <DraggableItem key={item.id} id={item.id}>
                    <VariableButton key={item.id} id={item.id} name={item.name} type="object" position="bank" items={[]} onInputChange={onInputChange} />
                </DraggableItem>
            ))}
        </div>
    );
};

export default VariablesWindow;