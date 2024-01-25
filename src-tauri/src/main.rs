// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use notify::{event::RemoveKind, EventKind, INotifyWatcher, RecursiveMode, Result as NotifyResult, Watcher};
use std::path::Path;
use std::fs;
use walkdir::WalkDir;
use serde_json::Result;
use serde::{Deserialize, Serialize};

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
struct MetaData {
    name: String,
    sequence: u8,
}

#[derive(Serialize, Deserialize, Debug)]
struct Request {
    method: String,
    url: String,
    body: Option<String>,
    auth: Option<String>,
    meta: MetaData,
}

#[derive(Serialize, Deserialize)]
struct Collection {
    name: String,
    requests: Vec<Request>
}

#[derive(Serialize, Deserialize)]
struct Data {
    collections: Vec<Collection>
}


// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    //TODO: Get this path from the frontend user input
    let path = "../../data/";

    //Handler unwrap
    parse_object(Path::new(path)).unwrap();

    for entry in WalkDir::new(path).into_iter().filter_map(|e| e.ok()) {
        
        //Handle unwrap
        let md = fs::metadata(entry.path()).unwrap();
        
        if md.is_file() {
            println!("file: {}", entry.path().display());
            let contents = fs::read_to_string(entry.path())
                .expect("Should have been able to read the file");

            println!("{}",contents);
        }else if md.is_dir() {
            println!("dir: {}", entry.path().display());
        };
        

    }

    let mut watcher = create_file_watcher();

    watcher
        .watch(Path::new(path), RecursiveMode::Recursive)
        .expect("error watching folder");

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn create_file_watcher() -> INotifyWatcher {
    let watcher = notify::recommended_watcher(move |res: NotifyResult<notify::event::Event>| match res {
        Ok(event) => {
            // TODO: Track anytime there is a change/delete in the file system
            // and send that information to the front end to update the UI
            match event.kind {
                EventKind::Remove(RemoveKind::File) => println!("Removed file!"),
                EventKind::Remove(RemoveKind::Folder) => println!("Removed folder!"),
                _ => println!("Changed: {:?}", {event})
            }
        }
        Err(e) => println!("watch error: {:?}", e),
    })
        .expect("error creating file watcher");

    return watcher;
}

//TODO: Recursively read all of the contents of the data folder and serialise to a JSON object
fn read_data() {

}

fn parse_object(path: &Path) -> Result<String> {
    let contents = fs::read_to_string("../../Projects/data/col/req.txt")
        .expect("Should have been able to read the file");

    let contents2 = fs::read_to_string("../../Projects/data/col1/req.txt")
        .expect("Should have been able to read the file");

    //    //unwrap
    let config: Request  = {toml::from_str(&contents).unwrap()};
    let config2: Request  = toml::from_str(&contents2).unwrap();


    let col1 = Collection {
        name: "collection 1".to_owned(),
        requests: vec![config, config2],
    };

    let data = Data {
        collections: vec![col1]
    };

    let json = serde_json::to_string(&data)?;

    println!("{}", json);
    //println!("{:?}", config);

    Ok(json)
}
