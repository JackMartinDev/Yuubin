// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use notify::{event::RemoveKind, EventKind, INotifyWatcher, RecursiveMode, Result, Watcher};
use std::path::Path;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    //TODO: Get this path from the frontend user input
    let path = "../../data/";
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
    let watcher = notify::recommended_watcher(move |res: Result<notify::event::Event>| match res {
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
