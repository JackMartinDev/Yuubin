type MetaData = {
    name: string,
    sequence: number,
}

type YuubinRequest = {
    method: string
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

