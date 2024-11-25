use std::{env, fs::File, io::Write};

pub mod idl;
pub mod idl_loader;
pub mod idl_processor;

fn main() {
    let mut args = env::args().skip(1);
    let path = args.next();
    if path.is_none() || path.as_ref().unwrap().is_empty() {
        println!("Please provide a path to the IDL file.");
        return;
    }
    println!("Input file: '{}'", path.as_ref().unwrap());
    let output = args.next().unwrap_or("openapi.json".to_string());
    let idl = idl_loader::load_idl(path.as_ref().unwrap()).unwrap();
    println!("IDL loaded");
    let openapi = idl_processor::process_into_openapi(idl).unwrap();
    println!("OpenAPI generated.");
    let mut file = File::create(&output).unwrap();
    file.write_all(serde_json::to_string_pretty(&openapi).unwrap().as_bytes())
        .unwrap();
    println!("OpenAPI written to '{output}'");
}
