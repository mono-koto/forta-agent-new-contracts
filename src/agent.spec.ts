import {
  FindingType,
  FindingSeverity,
  Finding,
  HandleTransaction,
  createTransactionEvent,
} from "forta-agent";
import agent from "./agent";

describe("new contract agent", () => {
  let handleTransaction: HandleTransaction;

  const createNewTx = (
    from: string,
    to: string | null,
    contractAddress: string
  ) =>
    createTransactionEvent({
      transaction: { from, to } as any,
      receipt: { contractAddress } as any,
      block: {} as any,
    });

  beforeAll(() => {
    handleTransaction = agent.handleTransaction;
  });

  describe("handleTransaction", () => {
    it("returns empty findings if gas used is below threshold", async () => {
      const txEvent = createNewTx("0x1234", "0xabcd", "0xabcd");

      const findings = await handleTransaction(txEvent);

      expect(findings).toStrictEqual([]);
    });

    it("returns a finding if gas used is above threshold", async () => {
      const txEvent = createNewTx("0x1234", null, "0xabcd");

      const findings = await handleTransaction(txEvent);

      expect(findings).toStrictEqual([
        Finding.fromObject({
          name: "New Contract Created",
          description: `New created at address 0xabcd by 0x1234`,
          alertId: "NEW-CONTRACT-0",
          type: FindingType.Info,
          severity: FindingSeverity.Info,
          metadata: {
            from: "0x1234",
            contractAddress: "0xabcd",
          },
        }),
      ]);
    });
  });
});
