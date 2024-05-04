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
import { HttpStatusCode } from "axios"
import { invoke } from "@tauri-apps/api/tauri"
import { notifications } from "@mantine/notifications"
import { deepIsEqual } from "../../utils/utils"

interface Props {
    request: YuubinRequest,
    collectionName: String
}

type Response = {
    data: {},
    duration: number,
    size: string,
    status: HttpStatusCode
}

type ResponseError = {
    message: string,
    status?: number
}

const Client = ({request, collectionName}: Props): JSX.Element => {
    const status = useSelector((state:RootState) => state.response.status)
    const loading = useSelector((state:RootState) => state.response.loading)

    const testParams = [{key: "Key 1", value: "Value 1"}, {key: "Key 2", value: "Value 2"}]
    const testHeaders = [{key: "Key 1", value: "Value 1"}, {key: "Key 2", value: "Value 2"}]

    const [url, setUrl] = useState(request.url);
    const [method, setMethod] = useState(request.method);
    const [params, setParams] = useState<KeyValuePair[]>(request.params);
    const [body, setBody] = useState(request.body);
    const [headers, setHeaders] = useState<KeyValuePair[]>(request.headers);
    const [auth, setAuth] = useState<string | undefined>(request.auth);

    //Deep compare params and headers
    //TODO Think about how they should be treated when empty. undefined? empty array?
    const hasChanged = url !== request.url 
        || method !== request.method 
        || auth !== request.auth
        || body !== request.body
        || !deepIsEqual(params, request.params)
        || !deepIsEqual(headers, request.headers);

    const [response, setResponse] = useState<Response | undefined>(undefined);
    const [error, setError] = useState<{message: string, status?: number} | undefined>(undefined)

    const sendRequest = useSendRequest(params, url, method, body);

    const onTest = () => {
        const meta = request.meta
        const updatedRequest: YuubinRequest = {
            method,
            url,
            body,
            headers,
            params,
            auth,
            meta
        }
        console.log(updatedRequest)

        invoke('edit_file', {data: JSON.stringify(updatedRequest), collection: collectionName})
            .then((res) => {
                if(!res.error){
                    console.log(res.message)
                }else{
                    notifications.show({
                        title: 'Error',
                        message: res.message,
                        color: 'red'
                    })
                }
            })
    }

    const onSubmitHandler = async() => {
        try {
            const response = await sendRequest()
            console.log(response)
            setResponse(response)
            setError(undefined) 
        } catch (error) {
            console.log(error)
            //Perform type checking
                setError({
                    message: error.message,
                    status: error.status
                });
            setResponse(undefined);
        }
    }

    return(
        <Box>
            {hasChanged && <Button onClick={onTest}>Test update</Button>}
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
                                    <QueryParams queryParams={params} onParamsChange={setParams}/>
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
                                {loading 
                                    ? <p>Loading...</p> 
                                    : response || error 
                                        ? <ResponseBody response={response} error={error}/> 
                                        : <p style={{textAlign: 'center'}}>Make a request using the URL bar above</p>}
                            </div>
                        </Paper>
                    </Panel>
                </PanelGroup>
            </Box>
        </Box>
    )
}

export default Client
