use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

declare_id!("EeurDW522mz3z34FnQ3a77Q9XiFQfkrLLPpMfTZGRvbB");

#[program]
pub mod supplier_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }

    /// This call is only available to the authority
    /// who initialized the program. It allows minting
    /// of contract tokens into the supplier wallet

    pub fn mint_contract(ctx: Context<MintContract>, metadata: ContractMetadata) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = 8 + Configuration::INIT_SPACE, seeds = [ b"CONFIGURATION"], bump)]
    pub configuration: Account<'info, Configuration>,

    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MintContract<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    pub configuration: Account<'info, Configuration>,
    #[account(
        init, payer = signer,
        mint::decimals = 0,
        mint::authority = signer,
        mint::freeze_authority = signer
    )]
    pub contract_mint: Account<'info, Mint>,
    #[account(
        init, payer = signer, space = 8 + ContractMetadata::INIT_SPACE, seeds = [b"CONTRACT_METADATA", contract_mint.key().as_ref()], bump
    )]
    pub metadata: Account<'info, ContractMetadata>,
    #[account(mut)]
    pub signer_ata: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

/// Global configuration PDA
#[account]
#[derive(InitSpace)]
pub struct Configuration {
    pub authority: Pubkey,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct ContractMetadata {
    buyer_addr: [u8; 20],
    length: u64,
    amount: u128,
    is_expired: bool,
}
