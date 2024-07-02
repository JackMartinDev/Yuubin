use crate::types::{Config, Data, Collection, Request};
use dirs::config_dir;
use std::{fs::{self},path::PathBuf};
use anyhow::{Context, Result, anyhow};
use walkdir::WalkDir;


pub fn get_config_path() -> Result<PathBuf> {
    if let Some(dir) = config_dir() {
        Ok(dir.join("yuubin").join("config").with_extension("toml"))
    } else {
        Err(anyhow!("Failed to find config directory"))
    }
}

pub fn get_data_path() -> Result<PathBuf> {
    let config_path = get_config_path()?;

    let file_content = fs::read_to_string(config_path)
        .context("Failed to read the file contents")?;

    let config: Config = toml::from_str(&file_content)
        .context("Failed to parse config")?;
    Ok(PathBuf::from(config.data_path))
}

pub fn parse_object(path: &PathBuf) -> Result<String> {
    let mut data = Data {
        collections: Vec::new(),
    };

    for entry in WalkDir::new(path).max_depth(1) {
        let entry = entry.context("Failed to read directory entry")?;

        // Skip root path to prevent it being parsed as a collection.
        if entry.path() == path {
            println!("This is the root");
            continue;
        }

        if entry.file_type().is_dir() {
            let mut collection = Collection {
                name: entry.file_name().to_string_lossy().to_string(),
                requests: Vec::new(),
            };

            // Iterate over request files within the collection folder
            for request_entry in WalkDir::new(entry.path()).max_depth(1) {
                let request_entry = request_entry.context("Failed to read request entry")?;
                if request_entry.file_type().is_file()
                && request_entry.path().extension().map(|e| e == "toml").unwrap_or(false)
                {
                    let file_content = fs::read_to_string(request_entry.path())
                        .context("Failed to read request file")?;
                    let request: Request = toml::from_str(&file_content)
                        .context("Failed to parse request file")?;
                    collection.requests.push(request);
                }
            }
            data.collections.push(collection);
        }
    }

    let json = serde_json::to_string(&data.collections)
        .context("Failed to serialize collections to JSON")?;

    Ok(json)
}

