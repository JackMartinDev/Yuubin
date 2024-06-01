import Client from "./components/Client/Client"
import FileTree from "./components/FileTree/FileTree";
import classes from "./App.module.css"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { ActionIcon, Box, CloseButton,Flex, Group, Modal, Stack, Tabs, Text, Title, useMantineColorScheme } from "@mantine/core";
import { Notifications } from '@mantine/notifications';
import { notifications } from "@mantine/notifications"
import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store/store";
import { updateActiveRequest, updateRequests, updatefiles } from "./requestSlice";
import MethodIcon from "./components/MethodIcon";
import { IconSettings } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import camelcaseKeys from 'camelcase-keys';
import Settings from "./components/Settings/Settings";
import { updateSettings } from "./configSlice";
import { useTranslation } from "react-i18next";
import i18next from 'i18next';

function App(): JSX.Element {
    const dispatch = useDispatch()
    const { t } = useTranslation();
    const { colorScheme, setColorScheme } = useMantineColorScheme();
    const [opened, { open, close }] = useDisclosure(false);
    const activeTab = useSelector((state: RootState) => state.request.activeRequest)
    const files = useSelector((state:RootState) => state.request.files)
    const activeRequests = useSelector((state: RootState) => state.request.activeRequests)

    const syncFileSystem = () => {
        //Consider having these 2 invokes as a single "sync" invoke
        invoke<TauriResponse>('sync_files').then((response) => dispatch(updatefiles(JSON.parse(response.message)))).catch((error) => { 
            notifications.show({
                title: t("unexpected_error"),
                message: error,
                color: 'red'
            })
        }
        )

        invoke<TauriResponse>('sync_config').then((response) => { 
            const {theme, dataPath, language, preserveOpenTabs}:Config = camelcaseKeys(JSON.parse(response.message))
            i18next.changeLanguage(language);
            setColorScheme(theme);
            dispatch(updateSettings({theme, dataPath, language, preserveOpenTabs}))
            if (preserveOpenTabs) {
                const localTabs = localStorage.getItem("activeTabs");
                if(localTabs != null){
                    const activeTabs = JSON.parse(localTabs)
                    dispatch(updateRequests(activeTabs))
                    dispatch(updateActiveRequest(activeTabs[0]))
                }
            }
        }).catch((error) => 
                notifications.show({
                    title: t("unexpected_error"),
                    message: error,
                    color: 'red'
                })
            )
    }

    useEffect(() => {
        console.log("hello")
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
        localStorage.setItem("activeTabs", JSON.stringify(newTabs))
        if(activeTab === tabId){
            dispatch(updateActiveRequest(newTabs[newTabs.length -1]))
        }
    }

    return (
        <Box h="100vh">
            <Modal opened={opened} onClose={close} title={t("settings")} centered size="xl">
                <Settings closeModal={close}/>
            </Modal>
            <Notifications/>
            <PanelGroup direction="horizontal">
                <Panel defaultSize={15} minSize={15} className={colorScheme === "dark" ? classes.fileTreeDark : classes.fileTreeLight}>
                    <Stack h="100%" justify="space-between">
                        <FileTree files={files} />
                        <Group justify="space-between" align="baseline" m="xs">
                            <ActionIcon variant="default" color="gray" aria-label="Settings" onClick={open}>
                                <IconSettings style={{ width: '70%', height: '70%' }} stroke={1.5} />
                            </ActionIcon>
                            <Text size="xs">{t("yuubin")} v0.1</Text>
                        </Group>
                    </Stack>
                </Panel>
                <PanelResizeHandle className={classes.handle}/>
                <Panel defaultSize={80} minSize={70}>
                    {activeRequests.length > 0 ?
                        <Tabs variant="outline" value={activeTab} onChange={(val) => onChangeHandler(val!)} mx="xs" mt="xs" >
                            <Tabs.List h='5vh'>
                                {activeRequests.map(activeRequestId => 
                                    files.flatMap(collection => 
                                        collection.requests
                                        .filter(request => request.meta.id === activeRequestId)
                                        .map(request => (
                                            <Tabs.Tab key={request.meta.id} value={request.meta.id} p="xs">
                                                <Flex align="center" gap="4px" maw={175}>
                                                    <Text className={classes.truncate} size="sm"><MethodIcon method={request.method}/> {request.meta.name}</Text>
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
                                        <Tabs.Panel value={request.meta.id} mt="xs" key={request.meta.id} h='95vh'>
                                            <Client request={request} collectionName={collection.name}/>
                                        </Tabs.Panel>
                                    ))
                                )
                            )
                            }
                        </Tabs>
                        :<Title order={2} m="xs">Introduction Page</Title>
                    }

                </Panel>
            </PanelGroup>
        </Box>
    )
}

export default App
