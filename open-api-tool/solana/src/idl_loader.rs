use anyhow::anyhow;
use serde_json::Map;
use std::{fs::File, io::Read};

use crate::idl::Idl;

pub fn load_idl(filename: &str) -> anyhow::Result<Idl> {
    let mut f = File::open(filename).unwrap();
    let mut string = String::new();
    let read = f.read_to_string(&mut string);
    if read.is_ok() {
        println!("Read file successfully");
        let json = pre_process_json(&string)?;
        let idl: Idl = serde_json::from_str(&json).unwrap();
        return Ok(idl);
    } else {
        return Err(anyhow!("Failed to read file"));
    }
}

fn pre_process_json(json: &str) -> anyhow::Result<String> {
    let json = json.to_string();

    // 2. Load as Value
    let mut value: serde_json::Value = serde_json::from_str(&json)?;

    // 3. Process all values with "defined" key and replace value with object
    replace_defined_values(&mut value)?;
    let replaced_json = value.to_string().replace("publicKey", "pubkey");
    Ok(replaced_json)
}

pub fn replace_defined_values(value: &mut serde_json::Value) -> anyhow::Result<()> {
    // Call recursively for all array elements and object fields
    match value {
        serde_json::Value::Array(arr) => {
            for i in 0..arr.len() {
                replace_defined_values(&mut arr[i])?;
            }
        }
        serde_json::Value::Object(obj) => {
            for (k, v) in obj.iter_mut() {
                if k == "defined" {
                    let defined = v.as_str();
                    if defined.is_none() {
                        println!("WARN: This defined value is not included: {}", &v);
                        continue;
                    }
                    let defined = defined.unwrap().to_string();
                    let mut map = Map::new();
                    map.insert(
                        "name".to_string(),
                        serde_json::Value::String(defined.to_string()),
                    );
                    *v = serde_json::value::Value::Object(map);
                    println!("Replaced defined value: {}", defined);
                }
                replace_defined_values(v)?;
            }
        }
        _ => {}
    }
    Ok(())
}
