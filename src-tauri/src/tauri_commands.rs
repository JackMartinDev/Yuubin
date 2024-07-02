use crate::types::{Request, Config, Response};
use crate::utils::{get_data_path, get_config_path, parse_object};
use dirs::config_dir;
use std::{fs::{self, create_dir, metadata, remove_dir_all, File}, io::Write, path::Path};
use anyhow::{Context, Result};

#[tauri::command]
pub fn sync_files() -> Response {
    let result = || -> Result<String> {
        let data_path = get_data_path().context("Failed to get data path")?;
        let data = parse_object(&data_path).context("Failed to parse collections")?;
        Ok(data)
    }();

    Response::from_result_with_message(result)
}

#[tauri::command]
pub fn sync_config() -> Response {
    let result = || -> Result<String> {
        let config_path = get_config_path()?;

        let file_content = fs::read_to_string(&config_path).context("Failed to read file")?;
        let config: Config = toml::from_str(&file_content).context("Failed to parse from TOML")?;
        let json = serde_json::to_string(&config).context("Failed to parse to JSON")?;

        println!("{json}");
        Ok(json)
    }();

    Response::from_result_with_message(result)
}

#[tauri::command]
pub fn edit_config(data: String) -> Response{
    let config:Config = match serde_json::from_str(&data){
        Ok(config) => config,
        Err(e) => return Response{
            error: true,
            message: format!("Failed to parse JSON: {}", e) 
        }
    };
    println!("{:?}", config);

    let toml =  match toml::to_string(&config){
        Ok(toml) => toml,
        Err(e) => return Response{
            error: true,
            message: format!("Failed to serialise TOML: {}", e)
        }
    };

    println!("{:?}", toml);

    let config_dir = match config_dir() {
        Some(dir) => dir,
        None => {
            return Response{
                error: true,
                message: "Failed to find config directory".to_string()
            };
        }
    };

    let path = Path::new(&config_dir).join("yuubin").join("config").with_extension("toml");

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
            message: "Succesfully updated config".to_owned()
        },
        Err(e) => Response{
            error: true, 
            message: format!("Failed to write to file: {}", e)
        }
    }
}


#[tauri::command]
pub fn delete_file(collection: String, request: String) -> Response{
    let result = || -> Result<()> {
        let data_path = get_data_path().context("Failed to get data path")?;
        let path = data_path.join(collection).join(request).with_extension("toml");

        println!("Attempting to delete file at path: {:?}", path);

        fs::remove_file(path).context("Failed to delete file")?;
        Ok(())
    }();

    match result {
        Ok(_) => Response {
            error: false,
            message: "Successfully deleted file".to_string(),
        },
        Err(e) => Response {
            error: true,
            message: e.to_string(),
        },
    }
}

#[tauri::command]
pub fn create_file(data: String, collection: String) -> Response{
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

    let data_path = get_data_path().unwrap();
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
pub fn edit_file(data: String, collection: String) -> Response{
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

    let data_path = get_data_path().unwrap();
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
pub fn rename_file(data:String, collection:String, old_request_name: String) -> Response{
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

    let data_path = get_data_path().unwrap();
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
pub fn delete_directory(collection: String) -> Response{
    let data_path = get_data_path().unwrap();
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
pub fn create_directory(collection: String) -> Response{
    let data_path = get_data_path().unwrap();
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
pub fn rename_directory(collection: String, new_collection: String) -> Response{
    let data_path = get_data_path().unwrap();
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
