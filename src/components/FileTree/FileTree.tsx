import { useState, useEffect } from "react";
import { invoke } from '@tauri-apps/api/tauri'
import Collection from "./Collection";
import { Box, Button, TextInput, Title, rem } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

const FileTree = () => {
    const [files, setFiles] = useState<Data>();

    const syncFileSystem = () => {
        invoke('sync_files').then((files) => setFiles(JSON.parse(files as string)))
    }

    useEffect(() => {
        syncFileSystem()
    },[]);

    const icon = <IconSearch style={{ width: rem(16), height: rem(16) }} />;

    return (
        <Box p="xs">
            <Title>File tree</Title>
            <TextInput placeholder="Search collections" leftSection={icon}/>
            <Button variant="default" color="gray">+</Button>
            {files?.collections.map(collection => (<Collection key={crypto.randomUUID()} collection={collection}/>))}
            <Button variant="default" color="gray" onClick={syncFileSystem}>
                refresh
            </Button>
        </Box>
    )
}

export default FileTree
