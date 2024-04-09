// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use rfd::FileDialog;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

#[tauri::command]
fn select_file() -> String {
    let file = FileDialog::new()
        .add_filter("images", &["avif", "bmp", "gif", "ico", "jpg", "png"])
        .set_directory("/")
        .pick_file();

    let string_path = file.unwrap_or_default().to_string_lossy().to_string();

    string_path
}

#[tauri::command]
fn select_directory() -> String {
    let file = FileDialog::new()
        .set_directory("/")
        .pick_folder();

    let string_path = file.unwrap_or_default().to_string_lossy().to_string();

    string_path
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![select_file, select_directory])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
