import CodeMirror from "@uiw/react-codemirror"
import { json } from "@codemirror/lang-json"
import { tokyoNightStorm } from "@uiw/codemirror-theme-tokyo-night-storm" 
import { useCallback, useState } from "react"
import { useDispatch } from "react-redux"
import { updateBody } from "../requestSlice"
import { debounce } from "../utils/utils"

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

    return(
        <div>
            <CodeMirror value={value} height="200px" theme={tokyoNightStorm} extensions={[json()]} onChange={onChange} />
        </div>
    )
}

export default RequestBody
