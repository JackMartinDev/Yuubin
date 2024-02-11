type MetaData = {
    name: string,
    sequence: number,
}

type YuubinRequest = {
    method: HttpVerb,
    url: string,
    body?: string,
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

type HttpVerb = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"  | "OPTIONS" | "HEAD"

