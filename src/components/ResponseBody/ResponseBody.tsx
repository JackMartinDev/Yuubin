import CodeMirror from "@uiw/react-codemirror"
import { EditorView } from "@codemirror/view";
import { json } from "@codemirror/lang-json"
import type { RootState } from "../../store/store"
import { useSelector } from "react-redux"
import styles from "./ResponseBody.module.css"
import { lintGutter } from "@codemirror/lint";
import {createTheme} from '@uiw/codemirror-themes';
import { Box } from "@mantine/core";
import { tags as t } from '@lezer/highlight';

const ResponseBody = () => {
    const body = useSelector((state: RootState) => state.response.response)
    const time = useSelector((state: RootState) => state.response.elapsed)
    const size = useSelector((state: RootState) => state.response.size)
    const status = useSelector((state: RootState) => state.response.status)
    const error = useSelector((state: RootState) => state.response.isError)

    const myTheme = createTheme({
        theme: "light",
        settings: {
//            background: '#ffffff',
//            backgroundImage: '',
//            foreground: '#75baff',
//            caret: '#5d00ff',
//            selection: '#036dd626',
//            selectionMatch: '#036dd626',
//            lineHighlight: '#8a91991a',
//            gutterBorder: '1px solid #ffffff10',
//            gutterBackground: '#fff',
//            gutterForeground: '#8a919966',
        },
        styles: [
            { tag: t.comment, color: '#787b8099' },
            { tag: t.variableName, color: '#0080ff' },
            { tag: [t.string, t.special(t.brace)], color: '#5c6166' },
            { tag: t.number, color: '#5c6166' },
            { tag: t.bool, color: '#5c6166' },
            { tag: t.null, color: '#5c6166' },
            { tag: t.keyword, color: '#5c6166' },
            { tag: t.operator, color: '#5c6166' },
            { tag: t.className, color: '#5c6166' },
            { tag: t.definition(t.typeName), color: '#5c6166' },
            { tag: t.typeName, color: '#5c6166' },
            { tag: t.angleBracket, color: '#5c6166' },
            { tag: t.tagName, color: '#5c6166' },
            { tag: t.attributeName, color: '#5c6166' },
        ]
    })

    return(
        <Box ml="md">
            <div className={styles.stats}>
                <p style={error ? {color: "red"} : {color:"green"}}>{error ? !!status ? status : "Error" : `${status} OK`}</p>
                <p>{time}ms</p>
                <p>{size}</p>
            </div>
            {body && <CodeMirror 
                value={JSON.stringify(body, null, 2)} 
                theme={myTheme} 
                height="700px"
                readOnly 
                extensions={[json(), lintGutter(), EditorView.theme({
                    "&": {
                        fontSize: "10pt",
                        border: "1px solid #c0c0c0",
                    },
                    "&.cm-editor.cm-focused": {
                        outline: "none"
                    },
                })
                ]} 
            />}
        </Box>
    )
}

export default ResponseBody
