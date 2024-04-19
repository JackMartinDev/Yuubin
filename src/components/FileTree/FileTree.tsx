import Collection from "./Collection";
import { Box, Button, TextInput, Title, rem } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import React from "react";

interface Props {
    files: Collection[],
    }

const FileTree = ({ files }: Props) => {
    const icon = <IconSearch style={{ width: rem(16), height: rem(16) }} />;

    return (
        <Box bg="#F5F5F5" h="100%">
            <Title order={1}>Collections</Title>
            <TextInput placeholder="Search collections" leftSection={icon} mb="sm" m="xs"/>
            {files.map(collection => (<Collection key={crypto.randomUUID()} collection={collection}/>))}
            <Button variant="default" color="gray">+</Button>
        </Box>
    )
}

export default React.memo(FileTree)
