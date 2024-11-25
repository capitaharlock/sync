pub mod type_handler;

use indexmap::IndexMap;
use openapiv3::{
    Info, OpenAPI, Operation, Parameter, ParameterData, PathItem, Paths, ReferenceOr, Response,
    Responses,
};

use crate::idl::{Idl, IdlField, IdlInstructionAccountItem};

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
        let mut accounts = instruction
            .accounts
            .iter()
            .map(|acc| process_account(acc))
            .collect::<Vec<_>>();
        op.parameters.append(&mut accounts);
        let mut responses = Responses::default();
        responses.responses.insert(
            openapiv3::StatusCode::Code(200),
            ReferenceOr::Item(Response::default()),
        );
        op.responses = responses;
        path.post = Some(op);
        paths.paths.insert(
            format!("/{}", instruction.name.clone()),
            ReferenceOr::Item(path),
        );
    });
    api.paths = paths;
    Ok(api)
}

fn process_account(account: &IdlInstructionAccountItem) -> ReferenceOr<Parameter> {
    let account = match account {
        IdlInstructionAccountItem::Composite(idl_instruction_accounts) => {
            let acc = idl_instruction_accounts.accounts.first().unwrap();
            match acc {
                IdlInstructionAccountItem::Composite(_) => {
                    panic!("Multi-nested accounts in contracts not supported for PoC!")
                }
                IdlInstructionAccountItem::Single(idl_instruction_account) => {
                    idl_instruction_account
                }
            }
        }
        IdlInstructionAccountItem::Single(idl_instruction_account) => idl_instruction_account,
    };
    let arg_format = IdlField {
        name: format!(
            "Account: {} {} {} {}",
            &account.name,
            if account.pda.is_some() { "[PDA]" } else { "" },
            if account.writable { "[MUT]" } else { "" },
            if account.signer { "[SIG]" } else { "" }
        ),
        docs: account.docs.clone(),
        ty: crate::idl::IdlType::Pubkey,
    };
    let param = Parameter::Header {
        parameter_data: ParameterData {
            name: arg_format.name.clone(),
            description: Some(arg_format.docs.join(
                r#"
"#,
            )),
            required: true,
            deprecated: None,
            format: type_handler::handle_type(&arg_format),
            example: None,
            examples: IndexMap::new(),
            extensions: IndexMap::new(),
            explode: None,
        },
        style: openapiv3::HeaderStyle::Simple,
    };
    ReferenceOr::Item(param)
}
