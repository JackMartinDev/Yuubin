import Client from "./components/Client/Client"
import FileTree from "./components/FileTree/FileTree";
import classes from "./App.module.css"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { CloseButton, Flex, Tabs, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";

const testFiles: Data = {"collections":[{"name":"col5","requests":[{"method":"POST","url":"https://jsonplaceholder.typicode.com/todos","body":"{name:Jack}","auth":undefined,"meta":{"name":"req2","sequence":1, "id": "1"}}]},{"name":"col","requests":[{"method":"GET","url":"www.facebook.com","body":undefined,"auth":undefined,"meta":{"name":"req2","sequence":2, "id": "2"}},{"method":"GET","url":"https://jsonplaceholder.typicode.com/todos/1","body":undefined,"auth":undefined,"meta":{"name":"req","sequence":3, id:"3"}}]}]}

const testRequests: YuubinRequest[] = [{"method":"POST","url":"https://jsonplaceholder.typicode.com/todos","body":'{"name":"Jack"}',"auth":undefined,"meta":{"name":"req2","sequence":1, "id": "1"}},{"method":"GET","url":"www.facebook.com","body":undefined,"auth":undefined,"meta":{"name":"req2","sequence":2, "id": "2"}},{"method":"GET","url":"https://jsonplaceholder.typicode.com/todos/1","body":undefined,"auth":"Bearer 12345","meta":{"name":"req","sequence":3, "id": "3"}}]

function App(): JSX.Element {
    const [files, setFiles] = useState<Data>();
    const [tabbedRequests, setTabbedRequests] = useState<YuubinRequest[]>( testRequests);
    const [activeTab, setActiveTab] = useState<string | null>(tabbedRequests[0].meta.id);

    const syncFileSystem = () => {
        invoke('sync_files').then((files) => setFiles(JSON.parse(files as string)))
    }
    //console.log(JSON.stringify(files))

    useEffect(() => {
        syncFileSystem()
    },[]);

    //Currently passing this function through 3 children, consider making this into a redux variable to reduce this
    const onChangeHandler = (tabId: string | null) => {
        setActiveTab(tabId)
    }

    //Have the default tab
    return (
        <div  className={classes.container}>
            <PanelGroup direction="horizontal">
                <Panel defaultSize={15} minSize={10}>
                    <div className={classes.file}>
                        <FileTree files={files ? files : testFiles} onChange={onChangeHandler}/>
                    </div>
                </Panel>
                <PanelResizeHandle />
                <Panel defaultSize={90} minSize={70}>
                    <Tabs variant="outline" value={activeTab} onChange={(val) => onChangeHandler(val)} mx="md" mt="md" >
                        <Tabs.List>
                            {tabbedRequests.map(request => (
                                <Tabs.Tab value={request.meta.id} p="xs">
                                    <Flex align="center" gap="xs">
                                        <Text>{request.method}{request.meta.name}</Text> 
                                        <CloseButton size="sm"/>
                                    </Flex>
                                </Tabs.Tab>
                            ))}
                        </Tabs.List>


                        {tabbedRequests.map(request => (
                            <Tabs.Panel value={request.meta.id} mt="sm">
                                <Client request={request}/>
                            </Tabs.Panel>
                        ))}

                    </Tabs>

                </Panel>
            </PanelGroup>
        </div>
    )
}

export default App
