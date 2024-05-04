import CodeMirror, { EditorView } from "@uiw/react-codemirror"
import { json, jsonParseLinter } from "@codemirror/lang-json"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { lintGutter, linter } from "@codemirror/lint"
import {createTheme} from '@uiw/codemirror-themes';
import { Box } from "@mantine/core"

interface Props {
    body?: string
    onBodyChange: Dispatch<SetStateAction<string>>,
}

const RequestBody = ({body, onBodyChange}: Props) => {
    const [localBody, setLocalBody] = useState(body ? body : "{}")

    useEffect(() => {
        onBodyChange(localBody);
    }, [localBody, onBodyChange]);


    const myTheme = createTheme({
        theme: "light",
        settings: {
        },
        styles: []
        
    })

    const testTheme = EditorView.theme({
        "&": {
            fontSize: "10pt",
            border: "1px solid #c0c0c0",
            maxHeight: '50vh',
            height: '50vh',
        },
        "&.cm-editor.cm-focused": {
            outline: "none"
        },
        ".cm-scroller": {overflow: "auto"}
    })

    return(
        <Box mr={16}> 
            <CodeMirror 
                value={localBody} 
                theme={testTheme}
                extensions={[json(), linter(jsonParseLinter()), lintGutter()]}  
                onChange={(val, _viewUpdate) => setLocalBody(val)} 
            />
        </Box>
    )
}

export default RequestBody
