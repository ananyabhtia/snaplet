import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from '@codemirror/lang-python';
import { noctisLilac } from "@uiw/codemirror-theme-noctis-lilac";
import "../styles/CodeWindow.css";

const CodeWindow = () => {
    const [code, setCode] = useState(`print("hello, world!")`);
    return (
        <div className="w-full h-[55%] border-2 rounded-xl bg-white overflow-hidden flex flex-col">
            <CodeMirror
                value={code} 
                onChange={(code) => setCode(code)}
                extensions={[python()]}
                className="w-full h-full"
                style={{
                    fontSize: '14px',
                    lineHeight: '1.5',
                    height: '100%',
                    overflow: 'auto',
                    maxHeight: '100%'
                }}
                theme={noctisLilac}
                basic={{
                    lineNumbers: true,
                    foldGutter: true,
                    highlightActiveLine: true,
                }}
            />
        </div>
    );
};

export default CodeWindow;