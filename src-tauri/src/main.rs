// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use yuubin::types::Config;
use yuubin::tauri_commands::{__cmd__sync_files, __cmd__sync_config, __cmd__edit_config, __cmd__delete_file, __cmd__create_file, __cmd__edit_file, __cmd__rename_file, __cmd__delete_directory, __cmd__create_directory, __cmd__rename_directory};
use yuubin::tauri_commands::{sync_files, sync_config, edit_config, delete_file, create_file, edit_file, rename_file, delete_directory, create_directory, rename_directory};

use dirs::{config_dir, data_dir};
use std::{fs::{create_dir, metadata, File}, io::Write, path::PathBuf};

fn init_config(config_path: &PathBuf, data_path: &PathBuf) {
    let init_config = Config {
        preserve_open_tabs: false,
        language: "en".to_owned(),
        theme: "dark".to_owned(),
        data_path: data_path.join("collections").to_string_lossy().into_owned(),
    };

    let toml = toml::to_string(&init_config).unwrap();

    let path = config_path.join("config").with_extension("toml");

    let mut file = File::create(&path).unwrap();

    file.write_all(toml.as_bytes()).unwrap();
}

fn main() {
    tauri::Builder::default()
        .setup(|_app| {
            let config_path = config_dir().unwrap().join("yuubin");
            let data_path = data_dir().unwrap().join("yuubin");

            //Create config directory and toml file if it does not exist
            if metadata(&config_path).is_err(){
                create_dir(&config_path).unwrap();
                init_config(&config_path, &data_path);
            }else {
                if metadata(&config_path.join("config").with_extension("toml")).is_err(){
                    init_config(&config_path, &data_path);
                }
            }

            //Create data directory if it does not exist
            if metadata(&data_path).is_err(){
                create_dir(&data_path).unwrap();
                create_dir(&data_path.join("collections")).unwrap();
            }else {
                if metadata(&data_path.join("collections")).is_err(){
                    create_dir(&data_path.join("collections")).unwrap();
                }
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![sync_files, sync_config, edit_config, delete_file, create_file, edit_file, rename_file, delete_directory, create_directory, rename_directory])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

