import Client from "./components/Client/Client"
import FileTree from "./components/FileTree/FileTree";
import classes from "./App.module.css"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { CloseButton, Flex, Tabs, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store/store";
import { updateActiveRequest, updateRequests } from "./requestSlice";

function App(): JSX.Element {
    const dispatch = useDispatch()
    const [files, setFiles] = useState<Data>();

    const activeTab = useSelector((state: RootState) => state.request.activeRequest)

    const testingFiles = useSelector((state: RootState) => state.request.files)
    const activeRequests = useSelector((state: RootState) => state.request.activeRequests)

    const syncFileSystem = () => {
        invoke('sync_files').then((files) => setFiles(JSON.parse(files as string)))
    }

    useEffect(() => {
        syncFileSystem() //For desktop
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
            <PanelGroup direction="horizontal">
                <Panel defaultSize={15} minSize={10}>
                    <div className={classes.file}>
                        <FileTree files={testingFiles} />
                    </div>
                </Panel>
                <PanelResizeHandle />
                <Panel defaultSize={90} minSize={70}>
                    {activeRequests.length > 0 ?
                        <Tabs variant="outline" value={activeTab} onChange={(val) => onChangeHandler(val!)} mx="md" mt="md" >
                            <Tabs.List>
                                {activeRequests.map(activeRequestId => 
                                    testingFiles.flatMap(collection => 
                                        collection.requests
                                        .filter(request => request.meta.id === activeRequestId)
                                        .map(request => (
                                            <Tabs.Tab key={request.meta.id} value={request.meta.id} p="xs">
                                                <Flex align="center" gap="xs">
                                                    <Text>{request.method} {request.meta.name}</Text>
                                                    <CloseButton onClick={(event) => onCloseHandler(event, request.meta.id)} size="sm"/>
                                                </Flex>
                                            </Tabs.Tab>
                                        ))
                                    )
                                )}
                            </Tabs.List>

                            {activeRequests.map(activeRequestId =>
                                testingFiles.flatMap(collection =>
                                    collection.requests
                                    .filter(request => activeRequestId === request.meta.id)
                                    .map(request => (
                                        <Tabs.Panel value={request.meta.id} mt="sm" key={request.meta.id}>
                                            <Client request={request}/>
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
