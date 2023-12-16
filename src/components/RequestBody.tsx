import CodeMirror from "@uiw/react-codemirror"
import { json } from "@codemirror/lang-json"
import { tokyoNightStorm } from "@uiw/codemirror-theme-tokyo-night-storm" 
import { useCallback, useState } from "react"
import { useDispatch } from "react-redux"
import { updateBody } from "../requestSlice"

const RequestBody = () => {
    const dispatch = useDispatch()
    const [value, setValue] = useState("{}")
    const onChange = useCallback((val, viewUpdate) => {
        console.log("val: ", val);
        setValue(val);
        dispatch(updateBody(val))
    }, []);
    return(
        <div>
            <CodeMirror value={value} height="200px" theme={tokyoNightStorm} extensions={[json()]} onChange={onChange} />
        </div>
    )
}

export default RequestBody
