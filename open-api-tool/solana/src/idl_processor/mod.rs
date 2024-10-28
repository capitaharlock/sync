pub mod type_handler;

use indexmap::IndexMap;
use openapiv3::{Info, OpenAPI, Operation, Parameter, ParameterData, PathItem, Paths, ReferenceOr};

use crate::idl::Idl;

pub fn process_into_openapi(idl: Idl) -> anyhow::Result<OpenAPI> {
    let mut api = OpenAPI::default();
    api.openapi = "3.0.0".to_string();
    let mut info = Info::default();
    info.title = idl
        .metadata
        .name
        .unwrap_or("Solana Program Documentation".to_string());
    info.version = idl.metadata.version.unwrap_or("1.0".to_string());
    api.info = info;
    api.info.description = idl.metadata.description;
    let mut paths = Paths::default();
    idl.instructions.iter().for_each(|instruction| {
        let mut path = PathItem::default();
        path.description = Some(instruction.docs.join(
            r#"
"#,
        ));
        let mut op = Operation::default();
        op.description = path.description.clone();

        let parameters = instruction
            .args
            .iter()
            .map(|arg| {
                let param = Parameter::Query {
                    parameter_data: ParameterData {
                        name: arg.name.clone(),
                        description: Some(arg.docs.join(
                            r#"
"#,
                        )),
                        required: true,
                        deprecated: None,
                        format: type_handler::handle_type(&arg),
                        example: None,
                        examples: IndexMap::new(),
                        extensions: IndexMap::new(),
                        explode: Some(false),
                    },
                    allow_reserved: false,
                    style: openapiv3::QueryStyle::Form,
                    allow_empty_value: Some(false),
                };
                ReferenceOr::Item(param)
            })
            .collect::<Vec<_>>();

        op.parameters = parameters;
        path.post = Some(op);
        paths
            .paths
            .insert(instruction.name.clone(), ReferenceOr::Item(path));
    });
    api.paths = paths;
    Ok(api)
}
