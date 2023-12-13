import CodeMirror from "@uiw/react-codemirror"
import { json } from "@codemirror/lang-json"
import { tokyoNightStorm } from "@uiw/codemirror-theme-tokyo-night-storm" 
import { useCallback, useState } from "react"

function App(): JSX.Element {
    const [value, setValue] = useState("console.log('Hello World!');")
    const onChange = useCallback((val, viewUpdate) => {
        console.log("val: ", val);
        setValue(val);
    }, []);
    return (
        <div className="container">
            <h3>Hey you</h3>
            <CodeMirror value={value} height="200px" theme={tokyoNightStorm} extensions={[json()]} onChange={onChange} />
        </div>
    )
}

export default App
