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
    return(
        <div>
            <div className={styles.stats}>
                <p>{status}</p>
                <p>{time}ms</p>
                <p>{size}</p>
            </div>
            {body && <CodeMirror value={JSON.stringify(body, null, 2)} height="500px" theme={tokyoNightStorm} extensions={[json(), EditorView.lineWrapping]} readOnly />}
        </div>
    )
}

export default ResponseBody
