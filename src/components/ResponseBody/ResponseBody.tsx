import CodeMirror from "@uiw/react-codemirror"
import { EditorView } from "@codemirror/view";
import { json } from "@codemirror/lang-json"
import { tokyoNightStorm } from "@uiw/codemirror-theme-tokyo-night-storm" 
import type { RootState } from "../../store/store"
import { useSelector } from "react-redux"
import styles from "./ResponseBody.module.css"

const ResponseBody = () => {
    const body = useSelector((state: RootState) => state.response.response)
    const time = useSelector((state: RootState) => state.response.elapsed)
    const size = useSelector((state: RootState) => state.response.size)
    const status = useSelector((state: RootState) => state.response.status)
    const error = useSelector((state: RootState) => state.response.isError)

    return(
        <div>
            <div className={styles.stats}>
                <p style={error ? {color: "red"} : {color:"green"}}>{error ? !!status ? status : "Error" : `${status} OK`}</p>
                <p>{time}ms</p>
                <p>{size}</p>
            </div>
            {body && <CodeMirror value={JSON.stringify(body, null, 2)} height="700px" extensions={[json(), EditorView.lineWrapping]} readOnly />}
        </div>
    )
}

export default ResponseBody
