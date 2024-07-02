use serde::{Deserialize, Serialize};
use anyhow::Result;

#[derive(Serialize, Deserialize)]
enum HttpMethod {
    GET,
    POST,
    PUT,
    PATCH,
    DELETE,
    OPTIONS,
    HEAD
}

#[derive(Serialize, Deserialize, Debug)]
pub struct MetaData {
    pub name: String,
    pub id: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct KeyValuePair {
    pub key: String,
    pub value: String,
    pub checked: bool
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Request {
    pub method: String,
    pub url: String,
    pub body: String,
    pub auth: Option<String>,
    pub headers: Vec<KeyValuePair>,
    pub params: Vec<KeyValuePair>,
    pub meta: MetaData,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Collection {
    pub name: String,
    pub requests: Vec<Request>
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Data {
    pub collections: Vec<Collection>
}

#[derive(Clone, serde::Serialize)]
pub struct Payload {
    pub message: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Config {
    pub preserve_open_tabs: bool,
    pub language: String,
    pub theme: String,
    pub data_path: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Response {
    pub error: bool,
    pub message: String
}

impl Response {
    pub fn from_result<T>(result: Result<T>) -> Self {
        match result {
            Ok(_) => Response {
                error: false,
                message: "Success".to_string(),
            },
            Err(e) => Response {
                error: true,
                message: e.to_string(),
            },
        }
    }

    pub fn from_result_with_message(result: Result<String>) -> Self {
        match result {
            Ok(message) => Response {
                error: false,
                message,
            },
            Err(e) => Response {
                error: true,
                message: e.to_string(),
            },
        }
    }
}

