type MetaData = {
    name: string,
    sequence: number,
    id: string
}

type YuubinRequest = {
    method: HttpVerb,
    url: string,
    body?: string,
    headers?: KeyValuePair[],
    queryParams?: KeyValuePair[],
    auth?: string,
    meta: MetaData,
}

type Collection = {
    name: string,
    requests: YuubinRequest[]
}

type Data = {
    collections: Collection[]
}

type KeyValuePair = {
    key: string, 
    value: string
}

type HttpVerb = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"  | "OPTIONS" | "HEAD"

