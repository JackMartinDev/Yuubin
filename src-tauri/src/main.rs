// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{api::path::config_dir, Manager};
use std::{fs::{self, create_dir, metadata, remove_dir_all, File}, io::{Error, ErrorKind, Write}, path::Path, u8};
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
    id: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct KeyValuePair {
    key: String,
    value: String
}

#[derive(Serialize, Deserialize, Debug)]
struct Request {
    method: String,
    url: String,
    body: String,
    auth: Option<String>,
    headers: Vec<KeyValuePair>,
    params: Vec<KeyValuePair>,
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

#[derive(Serialize, Deserialize, Debug)]
struct Config {
    save_on_quit: bool,
    preserve_open_tabs: bool,
    active_tabs: Vec<String>,
    language: String,
    theme: String,
    data_path: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct Response {
    error: bool,
    message: String
}

#[tauri::command]
fn sync_files() -> String {
    let data_path = get_data_path();
    let path = Path::new(&data_path);

    //Handle unwrap
    parse_object(path).unwrap()
}

#[tauri::command]
fn sync_config() -> String {
    let config_dir = config_dir().unwrap();
    let path = Path::new(&config_dir).join("yuubin").join("config").with_extension("toml");

    let file_content = fs::read_to_string(&path).unwrap();
    //handle unwrap
    let config: Config = toml::from_str(&file_content).unwrap();

    let json = serde_json::to_string(&config).unwrap();
    println!("{json}");

    return json
}

fn get_data_path() -> String {
    let config_dir = config_dir().unwrap();
    let path = Path::new(&config_dir).join("yuubin").join("config").with_extension("toml");

    let file_content = fs::read_to_string(&path).unwrap();
    //handle unwrap
    let config: Config = toml::from_str(&file_content).unwrap();

    config.data_path
}

#[tauri::command]
fn delete_file(collection: String, request: String) -> Response{
    let data_path = get_data_path();
    let path = Path::new(&data_path).join(collection).join(request).with_extension("toml");

    println!("Attempting to delete file at path: {:?}", path);
    
    match fs::remove_file(path){
        Ok(()) => Response{
            error:false, 
            message:"Successfully deleted file".to_string()
        },
        Err(error) => handle_delete_file_error(error)
    }
}

fn handle_delete_file_error(error: std::io::Error) -> Response{
    match error.kind(){
        ErrorKind::NotFound => Response{
            error:true, 
            message:"File not found".to_string()
        },
        ErrorKind::PermissionDenied => Response{
            error:true, 
            message:"Permission denied".to_string()
        },
        _ => Response{
            error:true, 
            message: format!("An error occured: {}", error)}
    }
}

#[tauri::command]
fn create_file(data: String, collection: String) -> Response{
    let request:Request = match serde_json::from_str(&data){
        Ok(req) => req,
        Err(e) => return Response{
            error: true,
            message: format!("Failed to parse JSON: {}", e) 
        }
    };
    println!("{:?}", request);
    
    let toml =  match toml::to_string(&request){
        Ok(toml) => toml,
        Err(e) => return Response{
            error: true,
            message: format!("Failed to serialise TOML: {}", e)
        }
    };

    println!("{:?}", toml);

    let data_path = get_data_path();
    let path = Path::new(&data_path).join(collection).join(request.meta.name).with_extension("toml");

    if !metadata(&path).is_err(){
        return Response {
            error: true,
            message: "File already exists".to_string(),
        };
    }

    let mut file = match File::create(&path){
        Ok(file) => file,
        Err(e) => return Response{
            error: true,
            message: format!("Failed to create file: {}", e)
        }
    };

    match file.write_all(toml.as_bytes()){
        Ok(()) => Response{
            error: false, 
            message: "Succesfully created file".to_owned()
        },
        Err(e) => Response{
            error: true, 
            message: format!("Failed to write to file: {}", e)
        }
    }
}

#[tauri::command]
fn edit_file(data: String, collection: String) -> Response{
    let request:Request = match serde_json::from_str(&data){
        Ok(req) => req,
        Err(e) => return Response{
            error: true,
            message: format!("Failed to parse JSON: {}", e) 
        }
    };
    println!("{:?}", request);
    
    let toml =  match toml::to_string(&request){
        Ok(toml) => toml,
        Err(e) => return Response{
            error: true,
            message: format!("Failed to serialise TOML: {}", e)
        }
    };

    println!("{:?}", toml);

    let data_path = get_data_path();
    let path = Path::new(&data_path).join(collection).join(request.meta.name).with_extension("toml");

    if metadata(&path).is_err(){
        return Response {
            error: true,
            message: "File does not exist".to_string(),
        };
    }

    let mut file = match File::create(&path){
        Ok(file) => file,
        Err(e) => return Response{
            error: true,
            message: format!("Failed to update file: {}", e)
        }
    };

    match file.write_all(toml.as_bytes()){
        Ok(()) => Response{
            error: false, 
            message: "Succesfully updated file".to_owned()
        },
        Err(e) => Response{
            error: true, 
            message: format!("Failed to write to file: {}", e)
        }
    }
}

#[tauri::command]
fn rename_file(data:String, collection:String, old_request_name: String) -> Response{
    let request:Request = match serde_json::from_str(&data){
        Ok(req) => req,
        Err(e) => return Response{
            error: true,
            message: format!("Failed to parse JSON: {}", e) 
        }
    };
    println!("{:?}", request);
    
    let toml =  match toml::to_string(&request){
        Ok(toml) => toml,
        Err(e) => return Response{
            error: true,
            message: format!("Failed to serialise TOML: {}", e)
        }
    };

    println!("{:?}", toml);

    let data_path = get_data_path();
    let path = Path::new(&data_path).join(&collection).join(old_request_name).with_extension("toml");
    let new_path = Path::new(&data_path).join(&collection).join(request.meta.name).with_extension("toml");

    if !metadata(&new_path).is_err(){
        return Response {
            error: true,
            message: "New file already exists".to_string(),
        };
    }

    match fs::rename(path, &new_path){
        Ok(()) => match fs::write(&new_path, toml){
            Ok(()) => Response{
                error: false, 
                message: "File renamed succesfully".to_owned()
            },
            Err(e) => Response{
                error: true,
                message: format!("Failed up update file: {}",e)
            }
        }, 
        Err(e) => Response{
            error: true,
            message: format!("Failed to rename file: {}", e)
        }   
    }
}

#[tauri::command]
fn delete_directory(collection: String) -> Response{
    let data_path = get_data_path();
    let path = Path::new(&data_path).join(collection);
    println!("{:?}", path);
    match remove_dir_all(path){
        Ok(()) => Response{
            error: false,
            message: "Directory removed succesfully".to_owned()
        },
        Err(e) => Response{
            error: true,
            message: format!("Failed to remove directory: {}", e)
        }
    }
}

#[tauri::command]
fn create_directory(collection: String) -> Response{
    let data_path = get_data_path();
    let path = Path::new(&data_path).join(collection);
    println!("{:?}", path);
    match create_dir(path){
        Ok(()) => Response{
            error: false,
            message: "Directory created succesfully".to_owned()
        },
        Err(e) => Response{
            error: true,
            message: format!("Failed to create directory: {}", e)
        }
    }
}

//TODO test
#[tauri::command]
fn rename_directory(collection: String, new_collection: String) -> Response{
    let data_path = get_data_path();
    let path = Path::new(&data_path).join(&collection);
    let new_path = Path::new(&data_path).join(&new_collection);

    if !metadata(&new_path).is_err() {
        return Response {
            error: true,
            message: "New directory already exists".to_string(),
        };
    }

    match fs::rename(path, &new_path){
        Ok(()) => Response{
            error: false, 
            message: "File renamed succesfully".to_owned()
        },
        Err(e) => Response{
            error: true,
            message: format!("Failed up update file: {}",e)
        }
    }
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let splashscreen_window = app.get_window("splashscreen").unwrap();
            let main_window = app.get_window("main").unwrap();
            // we perform the initialization code on a new task so the app doesn't freeze
            tauri::async_runtime::spawn(async move {
                // initialize your app here instead of sleeping :)
                println!("Initializing...");
                //TODO: Get this path from the frontend user settings then save in config.toml
                let path = Path::new("../data/");

                //Handler unwrap
                let data = parse_object(path).unwrap();
                println!("{}", data);
                std::thread::sleep(std::time::Duration::from_secs(2));
                println!("Done initializing.");
                // After it's done, close the splashscreen and display the main window
                splashscreen_window.close().unwrap();
                main_window.emit("event-name", Payload { message: data }).unwrap();
                main_window.show().unwrap();
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![sync_files, sync_config, delete_file, create_file, edit_file, rename_file, delete_directory, create_directory, rename_directory])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
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
    let json = serde_json::to_string(&data.collections).unwrap();

    Ok(json)
}
