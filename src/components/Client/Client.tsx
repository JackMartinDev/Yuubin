import QueryParams from "../QueryParams/QueryParams"
import RequestBody from "../RequestBody/RequestBody"
import ResponseBody from "../ResponseBody/ResponseBody"
import SearchBar from "../SearchBar/SearchBar"
import { useSelector } from "react-redux"
import { RootState } from "../../store/store"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Paper, Tabs } from "@mantine/core"

const Client = (): JSX.Element => {
    const status = useSelector((state:RootState) => state.response.status)
    const loading = useSelector((state:RootState) => state.response.loading)

    return(
        <>
            <SearchBar/>
            <div >
                <PanelGroup direction="horizontal">
                    <Panel defaultSize={50} minSize={30}>
                        <Paper  mih="100%"  >

                            <Tabs variant="outline" defaultValue="query">
                                <Tabs.List>
                                    <Tabs.Tab value="query">
                                        Query
                                    </Tabs.Tab>
                                    <Tabs.Tab value="body">
                                        Body
                                    </Tabs.Tab>
                                    <Tabs.Tab value="headers">
                                        Headers
                                    </Tabs.Tab>
                                    <Tabs.Tab value="auth">
                                        Auth
                                    </Tabs.Tab>
                                </Tabs.List>

                                <Tabs.Panel value="query">
                                    <QueryParams/>
                                </Tabs.Panel>

                                <Tabs.Panel value="body">
                                    <RequestBody/>
                                </Tabs.Panel>

                                <Tabs.Panel value="headers">
                                    Headers
                                </Tabs.Panel>

                                <Tabs.Panel value="auth">
                                    Auth
                                </Tabs.Panel>
                            </Tabs>
                        </Paper>
                    </Panel>
                    <PanelResizeHandle />
                    <Panel defaultSize={50} minSize={30}>
                        <Paper mih="100%" >

                            <div>
                                {loading ? <p>Loading...</p> : status ? <ResponseBody/> : <p style={{textAlign: 'center'}}>Make a request using the URL bar above</p>}
                            </div>
                        </Paper>
                    </Panel>
                </PanelGroup>
            </div>
        </>
    )
}

export default Client
