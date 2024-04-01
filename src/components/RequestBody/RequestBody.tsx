import CodeMirror, { EditorView } from "@uiw/react-codemirror"
import { json, jsonParseLinter } from "@codemirror/lang-json"
import { tokyoNightStorm } from "@uiw/codemirror-theme-tokyo-night-storm" 
import { useCallback, useState } from "react"
import { useDispatch } from "react-redux"
import { updateBody } from "../../requestSlice"
import { debounce } from "../../utils/utils"
import { lintGutter, linter } from "@codemirror/lint"
import {createTheme} from '@uiw/codemirror-themes';
import { Box } from "@mantine/core"

const RequestBody = () => {
    const dispatch = useDispatch()
    const [value, setValue] = useState("{}")

    const debouncedDispatch = useCallback(debounce((value: string) => {
        console.log("val: ", value);
        dispatch(updateBody(value))
        }, 500), []);

    const onChange = useCallback((val, viewUpdate) => {
        setValue(val);
        debouncedDispatch(val)
    }, []);

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
                value={value} 
                theme={testTheme}
                extensions={[json(), linter(jsonParseLinter()), lintGutter()]}  
                onChange={onChange} 
            />
        </Box>
    )
}

export default RequestBody
