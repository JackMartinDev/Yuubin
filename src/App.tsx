import Client from "./components/Client/Client"
import FileTree from "./components/FileTree/FileTree";
import classes from "./App.module.css"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { CloseButton, Flex, Tabs, Text } from "@mantine/core";

function App(): JSX.Element {
    return (
        <div  className={classes.container}>

            <PanelGroup direction="horizontal">
                <Panel defaultSize={15} minSize={10}>
                    <div className={classes.file}>
                        <FileTree />
                    </div>
                </Panel>
                <PanelResizeHandle />
                <Panel defaultSize={90} minSize={70}>
                    <Tabs variant="outline" defaultValue="tab 1" mx="md" mt="md" >
                        <Tabs.List>
                            <Tabs.Tab value="tab 1" p="xs">
                                <Flex align="center" gap="xs">
                                    <Text>Tab 1</Text> 
                                    <CloseButton size="sm"/>
                                </Flex>
                            </Tabs.Tab>
                            <Tabs.Tab value="tab 2" p="xs">
                                <Flex align="center" gap="xs">
                                    <Text>Tab 2</Text> 
                                    <CloseButton size="sm"/>
                                </Flex>

                            </Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value="tab 1" mt="sm">
                            <Client/>
                        </Tabs.Panel>

                        <Tabs.Panel value="tab 2" mt="sm">
                            <Client/>
                        </Tabs.Panel>

                    </Tabs>

                </Panel>
            </PanelGroup>
        </div>
    )
}

export default App
