import * as anchor from "@coral-xyz/anchor";
import { Program, Wallet } from "@coral-xyz/anchor";
import { SupplierProgram } from "../target/types/supplier_program";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { SYSTEM_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/native/system";

describe("supplier-program", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();

  anchor.setProvider(provider);

  const signer = provider.wallet;
  const program = anchor.workspace.supplier_program as Program<SupplierProgram>;

  it("Is initialized!", async () => {
    
    const configurationPda = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from(anchor.utils.bytes.utf8.encode("CONFIGURATION"))], program.programId);
    
    const tx = await program.methods.initialize().accounts({
      configuration: configurationPda[0],
      signer: signer.publicKey,
      systemProgram: SYSTEM_PROGRAM_ID,
    }).rpc();
    console.log("Your transaction signature", tx);
  });
});
