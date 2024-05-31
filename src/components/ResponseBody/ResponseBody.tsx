import CodeMirror from "@uiw/react-codemirror"
import { EditorView } from "@codemirror/view";
import { json } from "@codemirror/lang-json"
import  { vscodeDark } from "@uiw/codemirror-theme-vscode"
import  { quietlight } from "@uiw/codemirror-theme-quietlight"
import { lintGutter } from "@codemirror/lint";
import { Box, Group, Text, useMantineColorScheme } from "@mantine/core";
import { HttpStatusCode } from "axios";

type Response = {
    data: {},
    duration: number,
    size: string,
    status: HttpStatusCode
}

type ResponseError = {
    message: string,
    status?: number | undefined
}

type Props = {
    response?: Response
    error?: ResponseError
}

const ResponseBody = ({response, error}: Props) => {
    const { colorScheme } = useMantineColorScheme();
    return(
        <Box ml="md">
            {response ? 
                <Group justify="right">
                    <Text c="green">{`${response.status} OK`}</Text>
                    <Text>{response.duration}ms</Text>
                    <Text>{response.size}</Text>
                </Group>
                :
                <Group justify="right">
                    <Text c="red">{error?.status ? `${error?.status} Error`: "Error" }</Text>
                </Group>
            }
            {(response || error) && <CodeMirror 
                value={JSON.stringify(response ? response.data : error?.message, null, 2)} 
                height="80vh"
                theme={colorScheme === "dark" ? vscodeDark : quietlight}
                readOnly 
                extensions={[json(), lintGutter(), EditorView.theme({
                    "&": {
                        fontSize: "11pt",
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
