import QueryParams from "../QueryParams/QueryParams"
import RequestBody from "../RequestBody/RequestBody"
import ResponseBody from "../ResponseBody/ResponseBody"
import SearchBar from "../SearchBar/SearchBar"
import { useSelector } from "react-redux"
import { RootState } from "../../store/store"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Box, Paper, Tabs } from "@mantine/core"
import Headers from "../Headers/Headers"
import Authentication from "../Authentication/Authentication"

interface Props {
    request: YuubinRequest
}

const Client = ({request}: Props): JSX.Element => {
    const status = useSelector((state:RootState) => state.response.status)
    const loading = useSelector((state:RootState) => state.response.loading)

    return(
        <Box>
            <SearchBar url={request.url} method={request.method}/>
            <Box>
                <PanelGroup direction="horizontal" style={{height: "85vh"}}>
                    <Panel defaultSize={50} minSize={30}>
                        <Paper mih="100%">
                            <Tabs variant="outline" defaultValue="query" mt="sm">
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

                                <Tabs.Panel value="query" mt="sm">
                                    <QueryParams/>
                                </Tabs.Panel>

                                <Tabs.Panel value="body" mt="sm">
                                    <RequestBody body={request.body}/>
                                </Tabs.Panel>

                                <Tabs.Panel value="headers" mt="sm">
                                    <Headers/>
                                </Tabs.Panel>

                                <Tabs.Panel value="auth" mt="sm">
                                    <Authentication token={request.auth}/>
                                </Tabs.Panel>
                            </Tabs>
                        </Paper>
                    </Panel>
                    <PanelResizeHandle style={{backgroundColor: "#DEE2E6", width: "1px"}}/>
                    <Panel defaultSize={50} minSize={30}>
                        <Paper mih="100%" >

                            <div>
                                {loading ? <p>Loading...</p> : status ? <ResponseBody/> : <p style={{textAlign: 'center'}}>Make a request using the URL bar above</p>}
                            </div>
                        </Paper>
                    </Panel>
                </PanelGroup>
            </Box>
        </Box>
    )
}

export default Client
