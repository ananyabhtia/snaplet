import CodeMirror from "@uiw/react-codemirror";
import { python } from '@codemirror/lang-python';
import { StateField, StateEffect, Decoration, EditorView } from "@uiw/react-codemirror";
import { noctisLilac } from "@uiw/codemirror-theme-noctis-lilac";
import { useRef, useEffect } from "react";
import "../styles/CodeWindow.css";

const setLineHighlights = StateEffect.define();

const lineHighlightMarkCurrent = Decoration.line({
    attributes: {style: 'background-color: #fcddddff'},
}); 

const lineHighlightMarkPrevious = Decoration.line({
    attributes: {style: 'background-color: #d3f1dfff'},
}); 

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
        for (const e of tr.effects) {
            if (e.is(setLineHighlights)) {
                const { current, previous } = e.value;
                const totalLines = tr.state.doc.lines;
                const decorations = [];

                const prevNum = parseInt(previous, 10);
                const currNum = parseInt(current, 10);

                const hasPrev = !isNaN(prevNum) && prevNum >= 1 && prevNum <= totalLines;
                const hasCurr = !isNaN(currNum) && currNum >= 1 && currNum <= totalLines;

                if (hasPrev && hasCurr && prevNum === currNum) {
                    const pos = tr.state.doc.line(currNum).from;
                    decorations.push(lineHighlightMarkCurrent.range(pos));
                } else {
                    if (hasPrev) {
                        const pos = tr.state.doc.line(prevNum).from;
                        decorations.push(lineHighlightMarkPrevious.range(pos));
                    }
                    if (hasCurr) {
                        const pos = tr.state.doc.line(currNum).from;
                        decorations.push(lineHighlightMarkCurrent.range(pos));
                    }
                }

                decorations.sort((a, b) => a.from - b.from);

                return Decoration.set(decorations);
            }
        }
        return lines;
    },
    provide: (f) => EditorView.decorations.from(f),
});

// CodeWindow : component styled to look like a code editor with Python syntax highlighting and line numbers
//              for users to paste their code into and refer to while diagramming, uses CodeMirror package        
const CodeWindow = ({ code, setCode, lineNumber, previousLineNumber }) => {
    const editorRef = useRef(null);

    useEffect(() => {
        if (editorRef.current?.view) {
            editorRef.current.view.dispatch({
                effects: setLineHighlights.of({
                    current: lineNumber || null,
                    previous: previousLineNumber || null
                }),
            });
        }
    }, [lineNumber, previousLineNumber]);

    const handleCreateEditor = (view) => {
        if (lineNumber || previousLineNumber) {
            view.dispatch({
                effects: setLineHighlights.of({
                    current: lineNumber || null,
                    previous: previousLineNumber || null
                }),
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