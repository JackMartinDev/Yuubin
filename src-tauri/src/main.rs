// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use yuubin::types::Config;
use yuubin::utils::get_data_path;
use yuubin::tauri_commands::{
    __cmd__sync_files, __cmd__sync_config, __cmd__edit_config, __cmd__delete_file, __cmd__create_file,
    __cmd__edit_file, __cmd__rename_file, __cmd__delete_directory, __cmd__create_directory, __cmd__rename_directory,
};

use yuubin::tauri_commands::{
    sync_files, sync_config, edit_config, delete_file, create_file, edit_file, rename_file,
    delete_directory, create_directory, rename_directory,
};

use dirs::{config_dir, data_dir};
use std::path::PathBuf;
use std::{fs::{create_dir, metadata, File}, io::Write};
use anyhow::{Context, Result};

fn init_config(config_path: &PathBuf) -> Result<()> {
    let data_path = data_dir()
        .context("Failed to get data directory")?
        .join("yuubin");

    let init_config = Config {
        preserve_open_tabs: false,
        language: "en".to_owned(),
        theme: "dark".to_owned(),
        data_path: data_path.join("collections").to_string_lossy().into_owned(),
    };

    let toml = toml::to_string(&init_config)
        .context("Failed to serialize initial confito TOML")?;

    let path = config_path.join("config").with_extension("toml");

    let mut file = File::create(&path)
        .context("Failed to create config file")?;

    file.write_all(toml.as_bytes())
        .context("Failed to write to config file")?;

    Ok(())
}

fn main() {
    tauri::Builder::default()
        .setup(|_app| {
            //Create config directory and toml file if it does not exist
            let config_path = config_dir()
                .context("Failed to get config directory")?
                .join("yuubin");

            if metadata(&config_path).is_err(){
                create_dir(&config_path).context("Failed to create config directory")?;
            }
            if metadata(&config_path.join("config").with_extension("toml")).is_err(){
                init_config(&config_path).context("Failed to initialize config")?;
            }

            //Create data directory if it does not exist
            let data_path = get_data_path()
                .context("Failed to get data directory")?; 

            if metadata(&data_path).is_err(){
                create_dir(&data_path).context("Failed to create data directory")?;
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![sync_files, sync_config, edit_config, delete_file, create_file, edit_file, rename_file, delete_directory, create_directory, rename_directory])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
