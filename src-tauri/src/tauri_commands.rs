use crate::types::{Request, Config, Response};
use crate::utils::{get_data_path, get_config_path, parse_object};
use dirs::config_dir;
use std::{fs::{self, create_dir, metadata, remove_dir_all, File}, io::Write, path::Path};
use anyhow::{anyhow, Context, Result};

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
        let config_path = get_config_path().context("Failed to get config path")?;
        let file_content = fs::read_to_string(&config_path).context("Failed to read file")?;
        let config: Config = toml::from_str(&file_content).context("Failed to parse from TOML")?;
        let json = serde_json::to_string(&config).context("Failed to parse to JSON")?;

        Ok(json)
    }();

    Response::from_result_with_message(result)
}

#[tauri::command]
pub fn edit_config(data: String) -> Response{
    let result = || -> Result<()> {
        let config: Config = serde_json::from_str(&data).context("Failed to parse Config")?;
        let toml =  toml::to_string(&config).context("Failed to serialize TOML")?;
        let config_dir = config_dir().context("Failed to find config directory")?;
        let path = Path::new(&config_dir).join("yuubin").join("config").with_extension("toml");

        if metadata(&path).is_err(){
            return Err(anyhow!("File does not exist"));
        }

        let mut file = File::create(&path).context("Failed to update file")?;
        file.write_all(toml.as_bytes()).context("Failed to write to file")?;

        Ok(())
    }();

    Response::from_result(result)
}


#[tauri::command]
pub fn delete_file(collection: String, request: String) -> Response{
    let result = || -> Result<()> {
        let data_path = get_data_path().context("Failed to get data path")?;
        let path = data_path.join(collection).join(request).with_extension("toml");

        //Maybe add some logging
        println!("Attempting to delete file at path: {:?}", path);

        fs::remove_file(path).context("Failed to delete file")?;

        Ok(())
    }();

    Response::from_result(result)
}

#[tauri::command]
pub fn create_file(data: String, collection: String) -> Response{
    let result = || -> Result<()> {
        let request: Request = serde_json::from_str(&data).context("Failed to parse JSON")?;
        let toml = toml::to_string(&request).context("Failed to serialise TOML")?;
        let data_path = get_data_path().context("Failed to get data path")?;
        let path = Path::new(&data_path).join(collection).join(request.meta.name).with_extension("toml");

        if metadata(&path).is_ok(){
            return Err(anyhow!("File already exists"));
        }

        let mut file = File::create(&path).context("Failed to create file")?;
        file.write_all(toml.as_bytes()).context("Failed to write to file")?;

        Ok(())
    }();

    Response::from_result(result)
} 

#[tauri::command]
pub fn edit_file(data: String, collection: String) -> Response{
    let result = || -> Result<()> {
        let request: Request = serde_json::from_str(&data).context("Failed to parse JSON")?;
        let toml = toml::to_string(&request).context("Failed to parse TOML")?;
        let data_path = get_data_path().context("Failed to get data path")?;
        let path = Path::new(&data_path).join(collection).join(request.meta.name).with_extension("toml");

        if metadata(&path).is_err(){
            return Err(anyhow!("File does not exist"));
        }

        let mut file = File::create(&path).context("Failed to update file")?;
        file.write_all(toml.as_bytes()).context("Failed to write to file")?;

        Ok(())
    }();

    Response::from_result(result)
}

#[tauri::command]
pub fn rename_file(data:String, collection:String, old_request_name: String) -> Response{
    let result = || -> Result<()> {
        let request: Request = serde_json::from_str(&data).context("Failed to parse JSON")?;
        let toml = toml::to_string(&request).context("Failed to parse TOML")?;
        let data_path = get_data_path().context("Failed to get data path")?;

        let path = Path::new(&data_path).join(&collection).join(old_request_name).with_extension("toml");
        let new_path = Path::new(&data_path).join(&collection).join(request.meta.name).with_extension("toml");

        if metadata(&new_path).is_ok(){
            return Err(anyhow!("New file already exists"));
        }

        fs::rename(path, &new_path).context("Failed to rename file")?;
        fs::write(&new_path, toml).context("Failed to write to file")?;

        Ok(())
    }();

    Response::from_result(result)
}

#[tauri::command]
pub fn delete_directory(collection: String) -> Response{
    let result = || -> Result<()> {
        let data_path = get_data_path().context("Failed to get data path")?;
        let path = Path::new(&data_path).join(collection);
        remove_dir_all(path).context("Failed to delete directory")?;

        Ok(())
    }();

    Response::from_result(result)
}

#[tauri::command]
pub fn create_directory(collection: String) -> Response{
    let result = || -> Result<()> {
        let data_path = get_data_path().context("Failed to get data path")?;
        let path = Path::new(&data_path).join(collection);
        create_dir(path).context("Failed to create directory")?;
        
        Ok(())
    }();

    Response::from_result(result)
}

//TODO test
#[tauri::command]
pub fn rename_directory(collection: String, new_collection: String) -> Response{
    let result = || -> Result<()> {
        let data_path = get_data_path().context("Failed to get data path")?;
        let path = Path::new(&data_path).join(&collection);
        let new_path = Path::new(&data_path).join(&new_collection);

        if metadata(&new_path).is_ok() {
            return Err(anyhow!("New directory already exists"));
        }

        fs::rename(path, &new_path).context("Failed to rename directory")?;

        Ok(())
    }();

    Response::from_result(result)
}
