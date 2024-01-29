// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use notify::{event::RemoveKind, EventKind, INotifyWatcher, RecursiveMode, Result as NotifyResult, Watcher};
use std::{fs, io::Error, path::Path};
use walkdir::WalkDir;
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

#[derive(Serialize, Deserialize, Debug)]
struct Collection {
    name: String,
    requests: Vec<Request>
}

#[derive(Serialize, Deserialize, Debug)]
struct Data {
    collections: Vec<Collection>
}

#[derive(Clone, serde::Serialize)]
struct Payload {
    message: String,
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn sync_files() -> String {
    let path = Path::new("../../data/");

    //Handler unwrap
    parse_object(path).unwrap()
}

fn edit_file(path: String, contents: String) -> String{
    //Read path from the front end
    let path = Path::new(&path);

    //Parse json into a struct
    
    //Parse struct into toml
    
    //Rewrite the file

    //Return the new state of the file system

    "temp".to_owned()
}

fn delete_file(path: String) -> String {
    //Read path from the front end
    let path = Path::new(&path);

    //Delete file/folder
    
    //Return the new state of the file system
    "temp".to_owned()
}
fn main() {
    let path = Path::new("../../data/");
    let mut watcher = create_file_watcher();

    watcher
        .watch(Path::new(path), RecursiveMode::Recursive)
        .expect("error watching folder");

    tauri::Builder::default()
        .setup(|app| {
            let splashscreen_window = app.get_window("splashscreen").unwrap();
            let main_window = app.get_window("main").unwrap();
            // we perform the initialization code on a new task so the app doesn't freeze
            tauri::async_runtime::spawn(async move {
                // initialize your app here instead of sleeping :)
                println!("Initializing...");
                //TODO: Get this path from the frontend user input
                let path = Path::new("../../data/");

                //Handler unwrap
                let data = parse_object(path).unwrap();
                println!("{}", data);
                std::thread::sleep(std::time::Duration::from_secs(2));
                println!("Done initializing.");
                main_window.emit("event-name", Payload { message: data }).unwrap();
                // After it's done, close the splashscreen and display the main window
                splashscreen_window.close().unwrap();
                main_window.show().unwrap();
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![sync_files])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn create_file_watcher() -> INotifyWatcher {
    let watcher = notify::recommended_watcher(move |res: NotifyResult<notify::event::Event>| match res {
        Ok(event) => {
            // TODO: Track anytime there is a change/delete in the file system
            // and send that information to the front end to update the UI
            match event.kind {
                EventKind::Remove(RemoveKind::File) => {
                    println!("Removed file!");
                },
                EventKind::Remove(RemoveKind::Folder) => println!("Removed folder!"),
                _ => println!("Changed: {:?}", {event})
            }
        }
        Err(e) => println!("watch error: {:?}", e),
    })
        .expect("error creating file watcher");

    return watcher;
}

fn parse_object(path: &Path) -> Result<String, Error> {
    let mut data = Data {
        collections: Vec::new(),
    };

    for entry in WalkDir::new(path).max_depth(1) {
        match entry {
            Ok(entry) => {
                //Skip root path to prevent it being parsed as a collection.
                if entry.path() == path {
                    println!("This is the root");
                    continue;
                };
                if entry.file_type().is_dir() {
                    let mut collection = Collection {
                        name: entry.file_name().to_string_lossy().to_string(),
                        requests: Vec::new(),
                    };

                    // Iterate over request files within the collection folder
                    for request_entry in WalkDir::new(entry.path()).max_depth(1) {
                        match request_entry {
                            Ok(request_entry) => {
                                if request_entry.file_type().is_file()
                                    && request_entry.path().extension().map(|e| e == "toml").unwrap_or(false)
                                {
                                    //handle unwrap
                                    let file_content =
                                        fs::read_to_string(request_entry.path()).unwrap();
                                    //handle unwrap
                                    let request: Request =
                                        toml::from_str(&file_content).unwrap();
                                    collection.requests.push(request);
                                }
                            }
                            Err(err) => eprintln!("Error accessing request entry: {}", err),
                        }
                    }
                    data.collections.push(collection);
                }
            }
            Err(err) => eprintln!("Error accessing entry: {}", err),
        }
    }
    //Unwrap
    let json = serde_json::to_string(&data).unwrap();

    Ok(json)
}
