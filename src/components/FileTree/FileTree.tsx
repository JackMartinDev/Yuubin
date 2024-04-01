import { useState, useEffect } from "react";
import { invoke } from '@tauri-apps/api/tauri'
import Collection from "./Collection";
import { Accordion, AccordionControlProps, ActionIcon, Box, Button, Center, TextInput, Title, rem } from "@mantine/core";
import { IconDots, IconSearch } from "@tabler/icons-react";

const FileTree = () => {
    const [files, setFiles] = useState<Data>();

    const testFiles = {"collections":[{"name":"col5","requests":[{"method":"POST","url":"https://jsonplaceholder.typicode.com/todos","body":"{name:Jack}","auth":null,"meta":{"name":"req2","sequence":2}}]},{"name":"col","requests":[{"method":"GET","url":"www.facebook.com","body":null,"auth":null,"meta":{"name":"req2","sequence":2}},{"method":"GET","url":"https://jsonplaceholder.typicode.com/todos/1","body":null,"auth":null,"meta":{"name":"req","sequence":3}}]}]}

    const syncFileSystem = () => {
        invoke('sync_files').then((files) => setFiles(JSON.parse(files as string)))
    }
    console.log(JSON.stringify(files))

    useEffect(() => {
        syncFileSystem()
    },[]);

    const icon = <IconSearch style={{ width: rem(16), height: rem(16) }} />;

    return (
        <Box bg="#F5F5F5" h="100%">
            <Title order={1}>Collections</Title>
            <TextInput placeholder="Search collections" leftSection={icon} mb="sm" m="xs"/>
            {testFiles?.collections.map(collection => (<Collection key={crypto.randomUUID()} collection={collection}/>))}
            <Button variant="default" color="gray" onClick={syncFileSystem}>
                refresh
            </Button>
            <Button variant="default" color="gray">+</Button>
        </Box>
    )
}

const AccordionControl = (props: AccordionControlProps) => {
    return (
        <Center>
            <Accordion.Control {...props} />
            <ActionIcon size="lg" variant="subtle" color="gray">
                <IconDots size="1rem" />
            </ActionIcon>
        </Center>
    );
}

const CollectionAccordion = () => {
    return (
        <Accordion chevronPosition="left" maw={400} mx="auto">
            <Accordion.Item value="item-1">
                <AccordionControl>Control 1</AccordionControl>
                <Accordion.Panel>Panel 1</Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="item-2">
                <AccordionControl>Control 2</AccordionControl>
                <Accordion.Panel>Panel 2</Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="item-3">
                <AccordionControl>Control 3</AccordionControl>
                <Accordion.Panel>Panel 3</Accordion.Panel>
            </Accordion.Item>
        </Accordion>

    )
}

export default FileTree
