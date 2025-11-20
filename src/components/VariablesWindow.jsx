import VariableButton from "./VariableButton";
import DraggableItem from "./DraggableItem";

const VariablesWindow = ({ variableItems, activeFrames, activeReturns, activeObjects, onInputChange }) => {
    return (
        <div id="variables-bank" className="flex flex-col w-full border-2 rounded-xl bg-gray-300 text-xs" style={{height: '40vh'}}>
            {variableItems.map((item) => (
                <DraggableItem key={item.id} id={item.id}>
                    <VariableButton key={item.id} id={item.id} name={item.name} value={item.value} type="variable" position="bank" onInputChange={onInputChange} />
                </DraggableItem>
            ))}
            {activeFrames.map((item) => (
                <DraggableItem key={item.id} id={item.id}>
                    <VariableButton key={item.id} id={item.id} name={item.name} type="frame" position="bank" items={[]} onInputChange={onInputChange} />
                </DraggableItem>
            ))}
            {/* <p>stack frame</p> */}
            {activeObjects.map((item) => (
                <DraggableItem key={item.id} id={item.id}>
                    <VariableButton key={item.id} id={item.id} name={item.name} type="object" position="bank" items={[]} onInputChange={onInputChange} />
                </DraggableItem>
            ))}
            {/* <p>heap object</p> */}
            {activeReturns.map((item) => (
                <DraggableItem key={item.id} id={item.id}>
                    <VariableButton key={item.id} id={item.id} name={item.name} value={item.value} type="ret" position="bank" onInputChange={onInputChange} />
                </DraggableItem>
            ))}
        </div>
    );
};

export default VariablesWindow;