import Client from "./components/Client/Client"
import FileTree from "./components/FileTree/FileTree";
import classes from "./App.module.css"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { ActionIcon, Button, Checkbox, CloseButton, Divider, Flex, Group, Modal,Switch, Tabs, Text, TextInput, Title } from "@mantine/core";
import { Notifications } from '@mantine/notifications';
import { notifications } from "@mantine/notifications"
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store/store";
import { updateActiveRequest, updateRequests, updatefiles } from "./requestSlice";
import MethodIcon from "./components/MethodIcon";
import { IconSettings } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { moonIcon, sunIcon } from "./components/Settings/Icons";
import LanguageSelect from "./components/Settings/LanguageSelect";
import { open as openTauri } from '@tauri-apps/api/dialog';
import { appDataDir } from '@tauri-apps/api/path';
import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

function App(): JSX.Element {
    const dispatch = useDispatch()
    const [opened, { open, close }] = useDisclosure(false);
    const activeTab = useSelector((state: RootState) => state.request.activeRequest)
    const files = useSelector((state:RootState) => state.request.files)
    const activeRequests = useSelector((state: RootState) => state.request.activeRequests)

    //Temp state
    const [config, setConfig] = useState<Config>();
    const [selectedFolder, setSelectedFolder] = useState<string>()

    const syncFileSystem = () => {
        //Consider having these 2 invokes as a single "sync" invoke
        invoke('sync_files').then((files) => dispatch(updatefiles(JSON.parse(files.message as string)))).catch((error) => 
            notifications.show({
                title: 'Unexpected Error',
                message: error,
                color: 'red'
            })
        )
        
        //TODO Change this implementation to redux
        invoke('sync_config').then((res) => { 
            const config:Config = camelcaseKeys(JSON.parse(res.message as string))
            setConfig(config)
            setSelectedFolder(config.dataPath)
        }).catch((error) => 
                notifications.show({
                    title: 'Unexpected Error',
                    message: error,
                    color: 'red'
                })
            )
    }

    useEffect(() => {
        syncFileSystem() 
    },[]);

    const selectDirectory = async() => {
        const selected = await openTauri({
            directory: true,
            defaultPath: await appDataDir(),
        });
        if (Array.isArray(selected)){
        }
        else if (selected === null) {
            // user cancelled the selection
            console.log("2",selected)
        } else {
            // user selected a single directory
            console.log("3",selected)
            setSelectedFolder(selected)
        }
    }

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

    const onSubmitHandler = () => {
        const config: Config = {saveOnQuit: true, preserveOpenTabs: true, activeTabs: ["1","2"], dataPath: "../data",language: "jp", theme: "dark"}
        invoke('edit_config', {data: JSON.stringify(snakecaseKeys(config))})
            .then((res) => {
                if(!res.error){
                    //Update config redux state here

                    notifications.show({
                        title: 'Success',
                        message: "Config succesfully updated",
                        color: 'green'
                    })
                }else{
                    notifications.show({
                        title: 'Error',
                        message: res.message,
                        color: 'red'
                    })
                }
            }).catch((error) => 
                notifications.show({
                    title: 'Unexpected Error',
                    message: error,
                    color: 'red'
                })
            )
    }

    return (
        <div className={classes.container}>
            <Modal opened={opened} onClose={close} title="Settings" centered size="xl">
                <Checkbox label="Preserve open tabs" size="md"/>
                <Checkbox label="Save on quit" mt="md" size="md"/>
                <Group align="end" gap={4}>
                    <TextInput
                        w="30%"
                        readOnly
                        miw={300}
                        value={selectedFolder}
                        mt="md"
                        label="Collection data path"
                    />
                    <Button onClick={selectDirectory}>
                        Browse
                    </Button>
                </Group>
                <Divider mt="lg"/>
                <Text fw={500} size="lg" mt="md" >Display Settings</Text>
                <LanguageSelect/>
                <Text size="sm" fw={500} mt={16}>Theme</Text>
                <Switch labelPosition="right" size="lg" color="dark.4" onLabel={sunIcon} offLabel={moonIcon} />
                <Button type="submit" mt={16} onClick={onSubmitHandler}>Apply Changes</Button>
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
