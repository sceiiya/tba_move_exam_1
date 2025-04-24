import {
  Account,
  Aptos,
  AptosConfig,
  Ed25519PrivateKey,
  Network,
} from "@aptos-labs/ts-sdk";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  const config = new AptosConfig({ network: Network.TESTNET });
  const aptos = new Aptos(config);

  const PRIVATE_KEY = new Ed25519PrivateKey(process.env.PRIVATE_KEY as string);

  const MY_ACCOUNT = Account.fromPrivateKey({
    privateKey: PRIVATE_KEY,
  });

  const myBalance = await aptos.getAccountAPTAmount({
    accountAddress: MY_ACCOUNT.accountAddress,
  });

  console.log(`My Wallet balance: ${myBalance} APT \n`);

  const transaction = await aptos.transaction.build.simple({
    sender: MY_ACCOUNT.accountAddress,
    data: {
      function:
        "0x777b93e13ff2a1bc872eb4d099ae15a52fb70f2f01dd18d7c809e217fb0e543e::tba_exam::add_participant",
      functionArguments: [
        "0x539f880b3da2bc33d98b5efbf611eb76b6a980b0fdb15badb537767e0767d6e3",
        "Scheidj Bleu Villados",
        "https://github.com/sceiiya",
        "yesimscheidj@protonmail.com",
        "@sceiiya",
      ],
    },
  });

  const senderAuthenticator = aptos.transaction.sign({
    signer: MY_ACCOUNT,
    transaction,
  });

  const pendingTransaction = await aptos.transaction.submit.simple({
    transaction,
    senderAuthenticator,
  });

  const txnResult = await aptos.waitForTransaction({
    transactionHash: pendingTransaction.hash,
  });

  console.log(
    `Transaction completed with status: ${
      txnResult.success
        ? `SUCCESS : Txn Hash: ${txnResult.hash} /n View @ https://explorer.aptoslabs.com/txn/${txnResult.version}?network=testnet `
        : "FAILURE"
    }`
  );
}
main().catch(console.error);
