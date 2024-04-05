import QueryParams from "../QueryParams/QueryParams"
import RequestBody from "../RequestBody/RequestBody"
import ResponseBody from "../ResponseBody/ResponseBody"
import SearchBar from "../SearchBar/SearchBar"
import { useSelector } from "react-redux"
import { RootState } from "../../store/store"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Box, Button, Flex, Paper, Tabs } from "@mantine/core"
import Headers from "../Headers/Headers"
import Authentication from "../Authentication/Authentication"
import { useState } from "react"
import useSendRequest from "../../hooks/useSendRequest"

interface Props {
    request: YuubinRequest
}

const Client = ({request}: Props): JSX.Element => {
    const status = useSelector((state:RootState) => state.response.status)
    const loading = useSelector((state:RootState) => state.response.loading)

    const [url, setUrl] = useState(request.url);
    const [method, setMethod] = useState(request.method);
    const [queryParams, setQueryParams] = useState(request.queryParams);
    const [body, setBody] = useState(request.body);
    const [headers, setHeaders] = useState(request.headers);
    const [auth, setAuth] = useState(request.auth);

    const [response, setResponse] = useState();

    const sendRequest = useSendRequest(queryParams, url, method, body);

    const onSubmitHandler = () => {
        console.log("yo")
        console.log(url)
        console.log(method)
        console.log(auth)
        console.log(body)
        console.log(queryParams)
        console.log(headers)
        sendRequest()
    }

    return(
        <Box>
            <Flex bg="#F5F5F5" align="center" p="0.5rem" gap={10}>
                <SearchBar url={url} method={method} onUrlChange={setUrl} onMethodChange={setMethod}/>
                <Button type="submit" w={100} variant="default" color="gray" onClick={onSubmitHandler}>Send</Button>
            </Flex>

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
                                    <QueryParams queryParams={queryParams} onParamsChange={setQueryParams}/>
                                </Tabs.Panel>

                                <Tabs.Panel value="body" mt="sm">
                                    <RequestBody body={body} onBodyChange={setBody}/>
                                </Tabs.Panel>

                                <Tabs.Panel value="headers" mt="sm">
                                    <Headers header={headers} onHeaderChange={setHeaders}/>
                                </Tabs.Panel>

                                <Tabs.Panel value="auth" mt="sm">
                                    <Authentication auth={auth} onAuthChange={setAuth}/>
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
