import Client from "./components/Client/Client"
import FileTree from "./components/FileTree/FileTree";
import classes from "./App.module.css"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { CloseButton, Flex, Tabs, Text } from "@mantine/core";
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
    //Add fallback for if activeRequests.length === 0
    const activeRequests = useSelector((state: RootState) => state.request.activeRequests)
    console.log("Active tab: " + activeRequests)

    const syncFileSystem = () => {
        invoke('sync_files').then((files) => setFiles(JSON.parse(files as string)))
    }

    useEffect(() => {
        syncFileSystem() //For desktop
                        //Web site
    },[]);

    const onChangeHandler = (tabId: string) => {
        dispatch(updateActiveRequest(tabId));
    }

    const onCloseHandler = (event:React.MouseEvent,tabId: string) => {
        event.stopPropagation();
        const newTabs = activeRequests.filter(id => id!== tabId)
        dispatch(updateRequests(newTabs))
        if(activeTab === tabId){
            dispatch(updateActiveRequest(newTabs[newTabs.length -1]))
        }
    }

    //TODO: Instead of mapping over the files and rendering by the id, loop over the id array and then find that id in the collection
    //Currently the order of the tabs is determined by the order of the files data which means closing and opening a tab will always
    //keep it in the same place
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
                    <Tabs variant="outline" value={activeTab} onChange={(val) => onChangeHandler(val!)} mx="md" mt="md" >
                        <Tabs.List>
                            {testingFiles.map(collection => 
                                collection.requests.filter(request => activeRequests.includes(request.meta.id)).map(request => (
                                    <Tabs.Tab value={request.meta.id} p="xs" key={request.meta.id}>
                                        <Flex align="center" gap="xs">
                                            <Text>{request.method}{request.meta.name}</Text> 
                                            <CloseButton onClick={(event) => onCloseHandler(event, request.meta.id)} size="sm"/>
                                        </Flex>
                                    </Tabs.Tab>
                                ))
                            )}
                        </Tabs.List>

                        {testingFiles.map(collection =>
                            collection.requests.filter(request => activeRequests.includes(request.meta.id)).map(request => (
                                <Tabs.Panel value={request.meta.id} mt="sm" key={request.meta.id}>
                                    <Client request={request}/>
                                </Tabs.Panel>
                            ))
                        )}

                    </Tabs>

                </Panel>
            </PanelGroup>
        </div>
    )
}

export default App
