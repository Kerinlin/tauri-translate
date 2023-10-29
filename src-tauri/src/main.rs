#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::fs;
use std::path::PathBuf;
use tauri::{CustomMenuItem, SystemTray, SystemTrayEvent, SystemTrayMenu};

#[tauri::command]
fn is_directory(path: &str) -> bool {
    let path_buf = PathBuf::from(path);
    if let Ok(metadata) = fs::metadata(&path_buf) {
        metadata.is_dir()
    } else {
        false
    }
}

fn main() {
    let opt_quit = CustomMenuItem::new("quit", "Quit");

    let tray_menu = SystemTrayMenu::new().add_item(opt_quit);
    let system_tray = SystemTray::new().with_menu(tray_menu);

    tauri::Builder::default()
        .system_tray(system_tray)
        .on_system_tray_event(|_app, event| match event {
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "quit" => std::process::exit(0),
                _ => {}
            },
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![is_directory])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
