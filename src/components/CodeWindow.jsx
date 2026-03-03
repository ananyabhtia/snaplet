import CodeMirror from "@uiw/react-codemirror";
import { python } from '@codemirror/lang-python';
import { noctisLilac } from "@uiw/codemirror-theme-noctis-lilac";
import "../styles/CodeWindow.css";

// CodeWindow : component styled to look like a code editor with Python syntax highlighting and line numbers
//              for users to paste their code into and refer to while diagramming, uses CodeMirror package        
const CodeWindow = ({ code, setCode }) => {
    return (
        <div className="w-full border-2 rounded-xl bg-white overflow-hidden flex flex-col mb-2" style={{height: '48vh'}}>
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