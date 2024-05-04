import { Dispatch, SetStateAction, useEffect, useState } from "react"
import styles from "./SearchBar.module.css"
import { Select, TextInput, rem } from "@mantine/core"
import { IconDeviceFloppy } from "@tabler/icons-react"

interface Props {
    method: HttpVerb,
    url: string,
    onUrlChange: Dispatch<SetStateAction<string>>,
    onMethodChange:Dispatch<SetStateAction<HttpVerb>>
    saveVisible: boolean,
    onSave: () => void
}

const SearchBar = ({url, method, onUrlChange, onMethodChange, saveVisible, onSave}: Props) =>{
    const [localUrl, setLocalUrl] = useState(url)
    const [localMethod, setLocalMethod] = useState<HttpVerb>(method)

    useEffect(() => {
        onUrlChange(localUrl);
    }, [localUrl, onUrlChange]);

    useEffect(() => {
        onMethodChange(localMethod);
    }, [localMethod, onMethodChange]);

    const saveIcon = saveVisible ? <IconDeviceFloppy onClick={onSave} style={{ width: rem(24), height: rem(24)}}/> : null

    return(
        <form className={styles.body}>
            <Select
                w={150}
                withCheckIcon={false}
                value={localMethod}
                onChange={(value, _option) => setLocalMethod(value as HttpVerb)}
                allowDeselect={false}
                withScrollArea={false}
                data={['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD']}
            />
            <TextInput type="url" rightSection={saveIcon} w="100%" value={localUrl} onChange={(e) => setLocalUrl(e.target.value)}/>
        </form>
    )
}

export default SearchBar
