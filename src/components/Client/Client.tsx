import QueryParams from "../QueryParams/QueryParams"
import RequestBody from "../RequestBody/RequestBody"
import ResponseBody from "../ResponseBody/ResponseBody"
import SearchBar from "../SearchBar/SearchBar"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store/store"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Box, Button, Flex, Loader, Tabs, Text } from "@mantine/core"
import Headers from "../Headers/Headers"
import Authentication from "../Authentication/Authentication"
import { useState } from "react"
import useSendRequest from "../../hooks/useSendRequest"
import { HttpStatusCode } from "axios"
import { invoke } from "@tauri-apps/api/tauri"
import { notifications } from "@mantine/notifications"
import { deepIsEqual } from "../../utils/utils"
import { updatefiles } from "../../requestSlice"

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

const Client = ({request, collectionName}: Props): JSX.Element => {
    const dispatch = useDispatch();
    const files = useSelector((state: RootState) => state.request.files)

    const [url, setUrl] = useState(request.url);
    const [method, setMethod] = useState(request.method);
    const [params, setParams] = useState<KeyValuePair[]>(request.params);
    const [body, setBody] = useState(request.body);
    const [headers, setHeaders] = useState<KeyValuePair[]>(request.headers);
    const [auth, setAuth] = useState<string | undefined>(request.auth);

    const hasChanged = url !== request.url 
        || method !== request.method 
        || auth !== request.auth
        || body !== request.body
        || !deepIsEqual(params, request.params)
        || !deepIsEqual(headers, request.headers);

    const [response, setResponse] = useState<Response | undefined>(undefined);
    const [error, setError] = useState<{message: string, status?: number} | undefined>(undefined)
    const [loading, setLoading] = useState(false);

    const sendRequest = useSendRequest(params, headers, url, method, body, auth);

    const onSaveHandler = () => {
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

        const newFiles = files.map(col => {
            if (col.name === collectionName) {
                return {
                    ...col,
                    requests: col.requests.map(req => {

                        if (req.meta.id === updatedRequest.meta.id) {
                            return updatedRequest; 
                        }
                        return req; 
                    })
                };
            }
            return col;         
        });

        invoke('edit_file', {data: JSON.stringify(updatedRequest), collection: collectionName})
            .then((res) => {
                if(!res.error){
                    dispatch(updatefiles(newFiles)) 
                    notifications.show({
                        title: 'Success',
                        message: res.message,
                        color: 'green'
                    })

                }else{
                    notifications.show({
                        title: 'Error',
                        message: res.message,
                        color: 'red'
                    })
                }
            }).catch((error) => 
                notifications.show({
                    title: 'Unexpected Error',
                    message: error,
                    color: 'red'
                })
            )
    }

    const onSubmitHandler = async(event) => {
        event.preventDefault();
        setLoading(true)
        try {
            const response = await sendRequest()
            console.log(response)
            setResponse(response)
            setError(undefined) 
        } catch (error) {
            console.log(error)
            //Perform type checking
            setResponse(undefined);
            setError({
                message: error.message,
                status: error.status
            });
        } finally{
            setLoading(false)
        }
    }

    return(
        <Box>
            <form onSubmit={(event) => onSubmitHandler(event)}>
                <Flex bg="#F5F5F5" align="center" p="xs" gap={10}>
                    <SearchBar url={url} method={method} onUrlChange={setUrl} onMethodChange={setMethod} onSave={onSaveHandler} saveVisible={hasChanged}/>
                    <Button type="submit" w={100} variant="default" color="gray">Send</Button>
                </Flex>
            </form>

            <Box>
                <PanelGroup direction="horizontal" style={{height: "85vh"}}>
                    <Panel defaultSize={50} minSize={30} >
                        <Tabs variant="outline" defaultValue="query" mt="xs">
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
                    </Panel>
                    <PanelResizeHandle style={{backgroundColor: "#DEE2E6", width: "1px"}}/>
                    <Panel defaultSize={50} minSize={30}>
                        <div>
                            {loading 
                                ? <Loader color="blue" type="dots" size="xl" m="auto" mt={100}/> 
                                : response || error 
                                    ? <ResponseBody response={response} error={error}/> 
                                    : <Text ta="center">Make a request using the URL bar above</Text>}
                        </div>
                    </Panel>
                </PanelGroup>
            </Box>
        </Box>
    )
}

export default Client
