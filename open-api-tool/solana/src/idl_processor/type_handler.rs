use core::panic;

use indexmap::IndexMap;
use openapiv3::{
    ArrayType, BooleanType, NumberType, ParameterSchemaOrContent, ReferenceOr, Schema, SchemaData,
    StringType, Type,
};
use serde_json::Number;

use crate::idl::{IdlArrayLen, IdlField, IdlType};

pub fn handle_type(arg: &IdlField) -> openapiv3::ParameterSchemaOrContent {
    match &arg.ty {
        &IdlType::I128 => handle_int(arg),
        &IdlType::I256 => handle_int(arg),
        &IdlType::I64 => handle_int(arg),
        &IdlType::I32 => handle_int(arg),
        &IdlType::I16 => handle_int(arg),
        &IdlType::I8 => handle_int(arg),
        &IdlType::U128 => handle_int(arg),
        &IdlType::U256 => handle_int(arg),
        &IdlType::U64 => handle_int(arg),
        &IdlType::U32 => handle_int(arg),
        &IdlType::U16 => handle_int(arg),
        &IdlType::U8 => handle_int(arg),
        IdlType::Array(arr, len) => handle_array(arg, &arr, &len),
        &IdlType::Pubkey => handle_pubkey(arg),
        &IdlType::String => handle_string(arg),

        // TODO: Handle all possible Solana tyypes properly
        _ => handle_bool(arg),
    }
}

fn handle_array(arg: &IdlField, arr: &Box<IdlType>, len: &IdlArrayLen) -> ParameterSchemaOrContent {
    let ty = *arr.to_owned();
    let field = IdlField {
        // TODO: Simplify
        name: "item".to_string(),
        docs: Vec::new(),
        ty,
    };
    let inner_ty = handle_type(&field);
    let len = match len {
        IdlArrayLen::Generic(x) => None,
        IdlArrayLen::Value(x) => Some(x.clone()),
    };
    if let ParameterSchemaOrContent::Schema(ReferenceOr::Item(inner_ty)) = inner_ty {
        openapiv3::ParameterSchemaOrContent::Schema(ReferenceOr::Item(Schema {
            schema_data: SchemaData {
                title: Some(format!("{}", arg.ty)),
                description: Some(arg.docs.join(
                    r#"
"#,
                )),
                discriminator: None,
                default: None,
                nullable: false,
                read_only: false,
                write_only: false,
                deprecated: false,
                external_docs: None,
                example: Some(serde_json::Value::Number(Number::from_i128(0i128).unwrap())),
                extensions: IndexMap::new(),
            },
            schema_kind: openapiv3::SchemaKind::Type(Type::Array(ArrayType {
                items: Some(ReferenceOr::Item(Box::new(inner_ty))),
                max_items: len,
                min_items: len,
                unique_items: false,
            })),
        }))
    } else {
        panic!("Not possible.");
    }
}

fn handle_int(arg: &IdlField) -> ParameterSchemaOrContent {
    openapiv3::ParameterSchemaOrContent::Schema(ReferenceOr::Item(Schema {
        schema_data: SchemaData {
            title: Some(format!("{}", arg.ty)),
            description: Some(arg.docs.join(
                r#"
"#,
            )),
            discriminator: None,
            default: None,
            nullable: false,
            read_only: false,
            write_only: false,
            deprecated: false,
            external_docs: None,
            example: Some(serde_json::Value::Number(Number::from_i128(0i128).unwrap())),
            extensions: IndexMap::new(),
        },
        schema_kind: openapiv3::SchemaKind::Type(Type::Number(NumberType {
            ..Default::default()
        })),
    }))
}

fn handle_pubkey(arg: &IdlField) -> ParameterSchemaOrContent {
    openapiv3::ParameterSchemaOrContent::Schema(ReferenceOr::Item(Schema {
        schema_data: SchemaData {
            title: Some(format!("{}", arg.ty)),
            description: Some(arg.docs.join(
                r#"
"#,
            )),
            discriminator: None,
            default: None,
            nullable: false,
            read_only: false,
            write_only: false,
            deprecated: false,
            external_docs: None,
            example: Some(serde_json::Value::String(
                "11111111111111111111111111111111".to_string(),
            )),
            extensions: IndexMap::new(),
        },
        schema_kind: openapiv3::SchemaKind::Type(Type::String(StringType {
            min_length: Some(32),
            max_length: Some(32),
            ..Default::default()
        })),
    }))
}

fn handle_string(arg: &IdlField) -> ParameterSchemaOrContent {
    openapiv3::ParameterSchemaOrContent::Schema(ReferenceOr::Item(Schema {
        schema_data: SchemaData {
            title: Some(format!("{}", arg.ty)),
            description: Some(arg.docs.join(
                r#"
"#,
            )),
            discriminator: None,
            default: None,
            nullable: false,
            read_only: false,
            write_only: false,
            deprecated: false,
            external_docs: None,
            example: None,
            extensions: IndexMap::new(),
        },
        schema_kind: openapiv3::SchemaKind::Type(Type::String(StringType {
            ..Default::default()
        })),
    }))
}

fn handle_bool(arg: &IdlField) -> ParameterSchemaOrContent {
    openapiv3::ParameterSchemaOrContent::Schema(ReferenceOr::Item(Schema {
        schema_data: SchemaData {
            title: Some(format!("{}", arg.ty)),
            description: Some(arg.docs.join(
                r#"
"#,
            )),
            discriminator: None,
            default: None,
            nullable: false,
            read_only: false,
            write_only: false,
            deprecated: false,
            external_docs: None,
            example: None,
            extensions: IndexMap::new(),
        },
        schema_kind: openapiv3::SchemaKind::Type(Type::Boolean(BooleanType {
            enumeration: vec![Some(false)],
        })),
    }))
}
