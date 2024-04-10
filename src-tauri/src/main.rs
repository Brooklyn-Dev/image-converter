// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::path::Path;

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

#[tauri::command]
fn convert_image_file(img_path: &str, out_dir: &str, out_name: &str, out_type: &str) -> (String, bool) {
    let img_path = Path::new(img_path);
    let out_dir = Path::new(out_dir);

    print!("Success! {}.{} was created.", out_name, out_type.to_lowercase());
    
    if !img_path.is_file() {
        return ("The path of the target file is invalid.".to_string(), false);
    }
    else if !out_dir.is_dir() {
        return ("The path of the output directory is invalid.".to_string(), false);
    }
    
    let result_message: String = format!("(testing) Success! {}.{} was created.", out_name, out_type.to_lowercase()).to_string();

    return (result_message, true);
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![select_file, select_directory, convert_image_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
