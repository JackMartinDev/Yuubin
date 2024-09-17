import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { json, jsonParseLinter } from "@codemirror/lang-json";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { quietlight } from "@uiw/codemirror-theme-quietlight";
import { lintGutter, linter } from "@codemirror/lint";
import { Box, useMantineColorScheme } from "@mantine/core";

interface Props {
  body?: string;
  onBodyChange: Dispatch<SetStateAction<string>>;
}

const RequestBody = ({ body, onBodyChange }: Props) => {
  const [localBody, setLocalBody] = useState(body ? body : "{}");
  const { colorScheme } = useMantineColorScheme();

  useEffect(() => {
    onBodyChange(localBody);
  }, [localBody, onBodyChange]);

  return (
    <Box mr={16}>
      <CodeMirror
        value={localBody}
        theme={colorScheme === "dark" ? vscodeDark : quietlight}
        extensions={[
          json(),
          linter(jsonParseLinter()),
          lintGutter(),
          EditorView.theme({
            "&": {
              fontSize: "11pt",
              border: "1px solid #c0c0c0",
            },
            "&.cm-editor.cm-focused": {
              outline: "none",
            },
          }),
        ]}
        onChange={(val, _viewUpdate) => setLocalBody(val)}
      />
    </Box>
  );
};

export default RequestBody;
