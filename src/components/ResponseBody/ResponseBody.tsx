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
import { HttpStatusCode } from "axios";

type Response = {
    data: {},
    duration: number,
    size: string,
    status: HttpStatusCode
}

type ResponseError = {
    message: string,
    status: number
}

type Props = {
    response?: Response
    error?: ResponseError
}

const ResponseBody = ({response, error}: Props) => {

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
        //Refactor
        <Box ml="md">
                {response ? 
                <div className={styles.stats}>
                    <p style={{color:"green"}}>{`${response.status} OK`}</p>
                    <p>{response.duration}ms</p>
                    <p>{response.size}</p>
                </div>
                :
                <div className={styles.stats}>
                <p style={{color: "red"}}>{`Error`}</p>
                </div>
                }
            {(response || error) && <CodeMirror 
                value={JSON.stringify(response ? response.data : error?.message, null, 2)} 
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
