use std::{env, fs::File, io::Write};

pub mod idl;
pub mod idl_loader;
pub mod idl_processor;

fn main() {
    let path = env::args().skip(1).next();
    if path.is_none() || path.as_ref().unwrap().is_empty() {
        println!("Please provide a path to the IDL file.");
        return;
    }
    println!("arg: '{}'", path.as_ref().unwrap());
    let idl = idl_loader::load_idl(path.as_ref().unwrap()).unwrap();
    println!("IDL loaded");
    let openapi = idl_processor::process_into_openapi(idl).unwrap();
    println!("OpenAPI generated.");
    let mut file = File::create("openapi.json").unwrap();
    file.write_all(serde_json::to_string_pretty(&openapi).unwrap().as_bytes())
        .unwrap();
    println!("OpenAPI written to openapi.json");
}
