import Client from "./components/Client/Client"
import FileTree from "./components/FileTree/FileTree";
import classes from "./App.module.css"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { CloseButton, Flex, Tabs, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store/store";
import { updateActiveRequest, updateActiveTabs } from "./requestSlice";

const testFiles: Data = {"collections":[{"name":"col5","requests":[{"method":"POST","url":"https://jsonplaceholder.typicode.com/todos","body":"{name:Jack}","auth":undefined,"meta":{"name":"req2","sequence":1, "id": "3"}}]},{"name":"col","requests":[{"method":"GET","url":"www.facebook.com","body":undefined,"auth":undefined,"meta":{"name":"req2","sequence":2, "id": "2"}},{"method":"GET","url":"https://jsonplaceholder.typicode.com/todos/1","body":undefined,"auth":undefined,"meta":{"name":"req","sequence":3, id:"1"}}]}]}

function App(): JSX.Element {
    const dispatch = useDispatch()
    const [files, setFiles] = useState<Data>();

    const activeTab = useSelector((state: RootState) => state.request.activeRequest)
    //Add fallback for if tabbedRequests.length === 0
    const tabbedRequests = useSelector((state: RootState) => state.request.activeTabs)

    const syncFileSystem = () => {
        invoke('sync_files').then((files) => setFiles(JSON.parse(files as string)))
    }
    //console.log(JSON.stringify(files))

    useEffect(() => {
        syncFileSystem()
    },[]);

    const onChangeHandler = (tabId: string) => {
        dispatch(updateActiveRequest(tabId));
    }

    const onCloseHandler = (tabId: string) => {
        const newTabs = tabbedRequests.filter((request) => request.meta.id !== tabId)
        dispatch(updateActiveTabs(newTabs))
    }

    return (
        <div className={classes.container}>
            <PanelGroup direction="horizontal">
                <Panel defaultSize={15} minSize={10}>
                    <div className={classes.file}>
                        <FileTree files={ files ? files : testFiles} />
                    </div>
                </Panel>
                <PanelResizeHandle />
                <Panel defaultSize={90} minSize={70}>
                    <Tabs variant="outline" value={activeTab} onChange={(val) => onChangeHandler(val!)} mx="md" mt="md" >
                        <Tabs.List>
                            {tabbedRequests.map(request => (
                                <Tabs.Tab value={request.meta.id} p="xs">
                                    <Flex align="center" gap="xs">
                                        <Text>{request.method}{request.meta.name}</Text> 
                                        <CloseButton onClick={() => onCloseHandler(request.meta.id)} size="sm"/>
                                    </Flex>
                                </Tabs.Tab>
                            ))}
                        </Tabs.List>

                        {tabbedRequests.map(request => (
                            <Tabs.Panel value={request.meta.id} mt="sm">
                                <Client key={request.meta.id} request={request}/>
                            </Tabs.Panel>
                        ))}

                    </Tabs>

                </Panel>
            </PanelGroup>
        </div>
    )
}

export default App
