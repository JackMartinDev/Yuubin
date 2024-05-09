import Client from "./components/Client/Client"
import FileTree from "./components/FileTree/FileTree";
import classes from "./App.module.css"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { ActionIcon, Box, Button, Checkbox, CloseButton, Divider, FileInput, Flex, Modal, Paper, Switch, Tabs, Text, TextInput, Title } from "@mantine/core";
import { Notifications } from '@mantine/notifications';
import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store/store";
import { updateActiveRequest, updateRequests, updatefiles } from "./requestSlice";
import MethodIcon from "./components/MethodIcon";
import { IconSettings } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { moonIcon, sunIcon } from "./components/Settings/Icons";
import LanguageSelect from "./components/Settings/LanguageSelect";

function App(): JSX.Element {
    const dispatch = useDispatch()
    const [opened, { open, close }] = useDisclosure(false);
    const activeTab = useSelector((state: RootState) => state.request.activeRequest)
    const files = useSelector((state:RootState) => state.request.files)
    const activeRequests = useSelector((state: RootState) => state.request.activeRequests)

    const syncFileSystem = () => {
        //TODO: Remove collecion key from this object
        invoke('sync_files').then((files) => dispatch(updatefiles(JSON.parse(files as string))))
        //invoke('sync_config').then((config) => dispatch(updateRequests(JSON.parse(config as string).active_tabs)))
    }

    useEffect(() => {
        syncFileSystem() 
    },[]);

    const onChangeHandler = (tabId: string) => {
        if(activeTab != tabId){
            dispatch(updateActiveRequest(tabId));
        }
    }

    const onCloseHandler = (event:React.MouseEvent,tabId: string) => {
        event.stopPropagation();
        const newTabs = activeRequests.filter(id => id!== tabId)
        dispatch(updateRequests(newTabs))
        if(activeTab === tabId){
            dispatch(updateActiveRequest(newTabs[newTabs.length -1]))
        }
    }

    return (
        <div className={classes.container}>
            <Modal opened={opened} onClose={close} title="Settings" centered size="xl">
                <Checkbox label="Preserve open tabs" size="md"/>
                <Checkbox label="Setting 2" mt="md" size="md"/>
                <Checkbox label="Setting 3" mt="md" size="md"/>
                <Checkbox label="Setting 4" mt="md" size="md"/>
                <Checkbox label="Setting 5" mt="md" size="md"/>
                <FileInput
                    w="30%"
                    miw={300}
                    mt="md"
                    label="Collection data path"
                    placeholder="Currently unavailable"
                />
                <Divider mt="lg"/>
                <Text fw={500} size="lg" mt="md" >Display Settings</Text>
                <LanguageSelect/>
                <Text size="sm" fw={500} mt={16}>Theme</Text>
                <Switch labelPosition="right" size="lg" color="dark.4" onLabel={sunIcon} offLabel={moonIcon} />
                <Button type="submit" mt={16}>Apply Changes</Button>
            </Modal>
            <Notifications/>
            <PanelGroup direction="horizontal">
                <Panel defaultSize={15} minSize={10}>
                    <div className={classes.file}>
                        <FileTree files={files} />
                        <ActionIcon variant="default" color="gray" aria-label="Settings" onClick={open}>
                            <IconSettings style={{ width: '70%', height: '70%' }} stroke={1.5} />
                        </ActionIcon>
                    </div>
                </Panel>
                <PanelResizeHandle />
                <Panel defaultSize={90} minSize={70}>
                    {activeRequests.length > 0 ?
                        <Tabs variant="outline" value={activeTab} onChange={(val) => onChangeHandler(val!)} mx="md" mt="md" >
                            <Tabs.List>
                                {activeRequests.map(activeRequestId => 
                                    files.flatMap(collection => 
                                        collection.requests
                                        .filter(request => request.meta.id === activeRequestId)
                                        .map(request => (
                                            <Tabs.Tab key={request.meta.id} value={request.meta.id} p="xs">
                                                <Flex align="center" gap="xs">
                                                    <Text><MethodIcon method={request.method}/> {request.meta.name}</Text>
                                                    <CloseButton onClick={(event) => onCloseHandler(event, request.meta.id)} size="sm"/>
                                                </Flex>
                                            </Tabs.Tab>
                                        ))
                                    )
                                )}
                            </Tabs.List>

                            {activeRequests.map(activeRequestId =>
                                files.flatMap(collection =>
                                    collection.requests
                                    .filter(request => activeRequestId === request.meta.id)
                                    .map(request => (
                                        <Tabs.Panel value={request.meta.id} mt="sm" key={request.meta.id}>
                                            <Client request={request} collectionName={collection.name}/>
                                        </Tabs.Panel>
                                    ))
                                )
                            )
                            }
                        </Tabs>
                        :<Title>Introduction Page</Title>
                    }

                </Panel>
            </PanelGroup>
        </div>
    )
}

export default App
