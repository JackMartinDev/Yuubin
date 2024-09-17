import { Dispatch, SetStateAction, useEffect, useState } from "react";
import classes from "./SearchBar.module.css";
import { Group, Select, TextInput } from "@mantine/core";
import { IconDeviceFloppy } from "@tabler/icons-react";

interface Props {
  method: HttpVerb;
  url: string;
  onUrlChange: Dispatch<SetStateAction<string>>;
  onMethodChange: Dispatch<SetStateAction<HttpVerb>>;
  saveVisible: boolean;
  onSave: () => void;
}

const SearchBar = ({
  url,
  method,
  onUrlChange,
  onMethodChange,
  saveVisible,
  onSave,
}: Props) => {
  const [localUrl, setLocalUrl] = useState(url);
  const [localMethod, setLocalMethod] = useState<HttpVerb>(method);

  useEffect(() => {
    onUrlChange(localUrl);
  }, [localUrl, onUrlChange]);

  useEffect(() => {
    onMethodChange(localMethod);
  }, [localMethod, onMethodChange]);

  const saveIcon = saveVisible ? (
    <IconDeviceFloppy
      onClick={onSave}
      width={24}
      height={24}
      className={classes.save}
    />
  ) : null;

  return (
    <Group w="100%" gap={10} wrap="nowrap">
      <Select
        w={150}
        withCheckIcon={false}
        value={localMethod}
        onChange={(value, _option) => setLocalMethod(value as HttpVerb)}
        allowDeselect={false}
        withScrollArea={false}
        data={["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"]}
      />
      <TextInput
        type="url"
        rightSection={saveIcon}
        w="100%"
        value={localUrl}
        onChange={(e) => setLocalUrl(e.target.value)}
      />
    </Group>
  );
};

export default SearchBar;
