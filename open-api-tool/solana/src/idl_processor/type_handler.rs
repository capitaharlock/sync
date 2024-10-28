use indexmap::IndexMap;
use openapiv3::{BooleanType, ParameterSchemaOrContent, ReferenceOr, Schema, SchemaData, Type};

use crate::idl::IdlField;

pub fn handle_type(arg: &IdlField) -> openapiv3::ParameterSchemaOrContent {
    match arg {
        // TODO: Handle all possible Solana tyypes properly
        _ => handle_bool(arg),
    }
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
