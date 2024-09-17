import QueryParams from "../QueryParams/QueryParams";
import RequestBody from "../RequestBody/RequestBody";
import ResponseBody from "../ResponseBody/ResponseBody";
import SearchBar from "../SearchBar/SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Box, Button, Flex, Loader, Tabs, Text } from "@mantine/core";
import Headers from "../Headers/Headers";
import Authentication from "../Authentication/Authentication";
import { useState } from "react";
import useSendRequest from "../../hooks/useSendRequest";
import { AxiosError, HttpStatusCode } from "axios";
import { invoke } from "@tauri-apps/api/tauri";
import { notifications } from "@mantine/notifications";
import { deepIsEqual } from "../../utils/utils";
import { updatefiles } from "../../redux/slice/requestSlice";
import { useTranslation } from "react-i18next";

interface Props {
  request: YuubinRequest;
  collectionName: String;
}

type Response = {
  data: {};
  duration: number;
  size: string;
  status: HttpStatusCode;
};

const Client = ({ request, collectionName }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const files = useSelector((state: RootState) => state.request.files);

  const [url, setUrl] = useState(request.url);
  const [method, setMethod] = useState(request.method);
  const [params, setParams] = useState<KeyValuePair[]>(request.params);
  const [body, setBody] = useState(request.body);
  const [headers, setHeaders] = useState<KeyValuePair[]>(request.headers);
  const [auth, setAuth] = useState<string | undefined>(request.auth);

  const hasChanged =
    url !== request.url ||
    method !== request.method ||
    auth !== request.auth ||
    body !== request.body ||
    !deepIsEqual(params, request.params) ||
    !deepIsEqual(headers, request.headers);

  const [response, setResponse] = useState<Response | undefined>(undefined);
  const [error, setError] = useState<
    { message: string; status?: number } | undefined
  >(undefined);
  const [loading, setLoading] = useState(false);

  const sendRequest = useSendRequest(params, headers, url, method, body, auth);

  const onSaveHandler = () => {
    const meta = request.meta;
    const updatedRequest: YuubinRequest = {
      method,
      url,
      body,
      headers,
      params,
      auth,
      meta,
    };

    const newFiles = files.map((col) => {
      if (col.name === collectionName) {
        return {
          ...col,
          requests: col.requests.map((req) => {
            if (req.meta.id === updatedRequest.meta.id) {
              return updatedRequest;
            }
            return req;
          }),
        };
      }
      return col;
    });
    //Create and delete use success messages set on the front end,
    //but here it is using a message from the backend
    //CHECK THIS LATER
    invoke<TauriResponse>("edit_file", {
      data: JSON.stringify(updatedRequest),
      collection: collectionName,
    })
      .then((response) => {
        if (response.success) {
          dispatch(updatefiles(newFiles));
          notifications.show({
            title: t("success"),
            message: response.message,
            color: "green",
          });
        } else {
          notifications.show({
            title: t("error"),
            message: response.message,
            color: "red",
          });
        }
      })
      .catch((error) =>
        notifications.show({
          title: t("unexpected_error"),
          message: error,
          color: "red",
        }),
      );
  };

  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await sendRequest();
      console.log(response);
      setResponse(response);
      setError(undefined);
    } catch (err) {
      const error = err as AxiosError;
      console.log(error);
      setResponse(undefined);
      setError({
        message: error.message,
        status: error.status,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <form onSubmit={(event) => onSubmitHandler(event)}>
        <Flex align="center" gap={10} style={{ borderRadius: 4 }}>
          <SearchBar
            url={url}
            method={method}
            onUrlChange={setUrl}
            onMethodChange={setMethod}
            onSave={onSaveHandler}
            saveVisible={hasChanged}
          />
          <Button type="submit" w={100} variant="default" color="gray">
            {t("send")}
          </Button>
        </Flex>
      </form>

      <Box>
        <PanelGroup direction="horizontal" style={{ height: "90vh" }}>
          <Panel defaultSize={50} minSize={30}>
            <Tabs variant="outline" defaultValue="query" mt="xs">
              <Tabs.List>
                <Tabs.Tab value="query">{t("query")}</Tabs.Tab>
                <Tabs.Tab value="body">{t("body")}</Tabs.Tab>
                <Tabs.Tab value="headers">{t("headers")}</Tabs.Tab>
                <Tabs.Tab value="auth">{t("auth")}</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="query" mt="sm">
                <QueryParams queryParams={params} onParamsChange={setParams} />
              </Tabs.Panel>

              <Tabs.Panel value="body" mt="sm">
                <RequestBody body={body} onBodyChange={setBody} />
              </Tabs.Panel>

              <Tabs.Panel value="headers" mt="sm">
                <Headers header={headers} onHeaderChange={setHeaders} />
              </Tabs.Panel>

              <Tabs.Panel value="auth" mt="sm">
                <Authentication auth={auth} onAuthChange={setAuth} />
              </Tabs.Panel>
            </Tabs>
          </Panel>
          <PanelResizeHandle
            style={{ backgroundColor: "#DEE2E6", width: "1px" }}
          />
          <Panel defaultSize={50} minSize={30}>
            <div>
              {loading ? (
                <Loader color="blue" type="dots" size="xl" m="auto" mt={100} />
              ) : response || error ? (
                <ResponseBody response={response} error={error} />
              ) : (
                <Text ta="center">{t("pre_request_message")}</Text>
              )}
            </div>
          </Panel>
        </PanelGroup>
      </Box>
    </Box>
  );
};

export default Client;
