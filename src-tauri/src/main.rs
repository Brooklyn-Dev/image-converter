// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::path::Path;

use image::{imageops::FilterType, io::Reader as ImageReader, DynamicImage, GenericImageView};
use rfd::FileDialog;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

#[tauri::command]
fn select_file() -> String {
    let file = FileDialog::new()
        .add_filter("avif", &["avif", "AVIF"])
        .add_filter("bmp", &["bmp", "BMP"])
        .add_filter("ico", &["ico", "ICO", "cur", "CUR"])
        .add_filter("jpg", &["jpg", "jpeg", "jfif", "pjpeg", "pjp", "JPG", "JPEG", "JFIF", "PJPEG", "PJP"])
        .add_filter("png", &["png", "PNG"])
        .add_filter("qoi", &["qoi", "QOI"])
        .add_filter("tiff", &["tif", "TIF", "tiff", "TIFF"])
        .add_filter("tga", &["tga", "icb", "vda", "vst", "TGA", "ICB", "VDA", "VST"])
        .add_filter("webp", &["webp", "WEBP"])
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
fn convert_image_file(init_file_path: &str, out_file_path: &str) -> (String, bool) {
	let init_path = Path::new(init_file_path);
	let out_path = Path::new(out_file_path);
	
    let file_name = out_file_path.split("\\").last().unwrap();
    let file_type = file_name.split(".").last().unwrap();

    let img = match ImageReader::open(init_path) {
        Ok(img) => img,
        Err(err) => return (format!("{err}"), false)
    };
    
    let mut img = match img.decode() {
        Ok(img) => img,
        Err(err) => return (format!("{err}"), false)
    };

    let img = match file_type.to_lowercase().as_str() {
        "ico" | "cur" => {
            let (width, height) = img.dimensions();
            if width > 256 || height > 256 {
                img = img.resize(256, 256, FilterType::Nearest);
            } 
            
            img
        },
        "jpg" | "jpeg" | "jfif" | "pjpeg" | "pjp" => {
            img = DynamicImage::ImageRgb8(img.into_rgb8());
            img
        }
        _ => img
    };

	match img.save(out_path) {
		Ok(_) => img,
		Err(err) => return (format!("{err}"), false)
	};

    let result_message: String = format!("{file_name} was created.");

    return (result_message, true);
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![select_file, select_directory, convert_image_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
