import CodeMirror from "@uiw/react-codemirror"
import { json } from "@codemirror/lang-json"
import { tokyoNightStorm } from "@uiw/codemirror-theme-tokyo-night-storm" 

interface Props {
    value: string
}

const ResponseBody = (props: Props) => {
    return(
        <div>
            <CodeMirror value={props.value} height="200px" theme={tokyoNightStorm} extensions={[json()]} readOnly />
        </div>
    )
}

export default ResponseBody
