import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from '@codemirror/lang-python';
import { noctisLilac } from "@uiw/codemirror-theme-noctis-lilac";
import "../styles/CodeWindow.css";

const CodeWindow = () => {
    const [code, setCode] = useState(`# sample program, replace this with your own code!\nbananas = 0\n\ndef transform(n):\n\tglobal bananas\n\tif n % 2 == 0:\n\t\tbananas += n\n\t\treturn n // 2\n\telif n % 3 == 0:\n\t\tbananas -= n\n\t\treturn n * 2\n\telse:\n\t\tbananas += 1\n\t\treturn n + bananas\n\na = 5\nb = transform(a)\nprint(f"final bananas: {bananas}")`);
    return (
        <div className="w-full border-2 rounded-xl bg-white overflow-hidden flex flex-col mb-2" style={{height: '45vh'}}>
            <CodeMirror
                value={code} 
                onChange={(code) => setCode(code)}
                extensions={[python()]}
                className="w-full h-full"
                style={{
                    fontSize: '1em',
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