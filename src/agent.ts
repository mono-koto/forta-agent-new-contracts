import BigNumber from "bignumber.js";
import {
  BlockEvent,
  Finding,
  HandleBlock,
  HandleTransaction,
  TransactionEvent,
  FindingSeverity,
  FindingType,
} from "forta-agent";

let findingsCount = 0;

const handleTransaction: HandleTransaction = async (
  txEvent: TransactionEvent
) => {
  const findings: Finding[] = [];

  if (!txEvent.to || new BigNumber(txEvent.to).eq(0)) {
    const contractAddress = txEvent.receipt.contractAddress!;
    findings.push(
      Finding.fromObject({
        name: "New Contract Created",
        description: `New created at address ${contractAddress} by ${txEvent.from}`,
        alertId: "NEW-CONTRACT-0",
        severity: FindingSeverity.Info,
        type: FindingType.Info,
        metadata: {
          from: txEvent.from,
          contractAddress: txEvent.receipt.contractAddress!,
        },
      })
    );
  }

  return findings;
};

export default {
  handleTransaction,
  // handleBlock
};
