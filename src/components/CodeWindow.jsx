import CodeMirror from "@uiw/react-codemirror";
import { python } from '@codemirror/lang-python';
import { StateField, StateEffect, Decoration, EditorView } from "@uiw/react-codemirror";
import { noctisLilac } from "@uiw/codemirror-theme-noctis-lilac";
import { useRef, useEffect } from "react";
import "../styles/CodeWindow.css";

const addLineHighlight = StateEffect.define();

const lineHighlightField = StateField.define({
    create() {
        return Decoration.none;
    },
    update(lines, tr) {
        lines = lines.map(tr.changes);

        if (lines.size > 0) {
            const currentRange = lines.iter().value; 
            if (currentRange && currentRange.to > tr.state.doc.length) {
                return Decoration.none;
            }
        }
        for (let e of tr.effects) {
            if (e.is(addLineHighlight)) {
                const lineNum = parseInt(e.value);

                if (isNaN(lineNum) || lineNum < 1 || lineNum > tr.state.doc.lines) {
                    return Decoration.none;
                }
                
                const pos = tr.state.doc.line(e.value).from;
                return Decoration.set([lineHighlightMark.range(pos)]);
            }
        }
        return lines;
    },
    provide: (f) => EditorView.decorations.from(f),
});

const lineHighlightMark = Decoration.line({
    attributes: {style: 'background-color: #f5f0acff'},
}); 

// CodeWindow : component styled to look like a code editor with Python syntax highlighting and line numbers
//              for users to paste their code into and refer to while diagramming, uses CodeMirror package        
const CodeWindow = ({ code, setCode, lineNumber }) => {
    const editorRef = useRef(null);

    useEffect(() => {
        if (editorRef.current?.view) {
            editorRef.current.view.dispatch({
                effects: addLineHighlight.of(lineNumber || null)
            });
        }
    }, [lineNumber]);

    const handleCreateEditor = (view) => {
        if (lineNumber) {
            view.dispatch({
                effects: addLineHighlight.of(lineNumber)
            })
        }
    }

    return (
        <div className="w-full border-2 rounded-xl bg-white overflow-hidden flex flex-col mb-2" style={{height: '48vh'}}>
            <CodeMirror
                ref={editorRef}
                value={code} 
                onCreateEditor={handleCreateEditor}
                onChange={(code) => setCode(code)}
                extensions={[python(), lineHighlightField]}
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