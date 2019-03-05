import {forMs} from "./wait";

export class ConsoleHelper {

    public static WaitingBar(span: number = 50, length: number = 20, delay: number = 1): () => string {
        let closed = false;
        const Close = () => {
            closed = true;
            return timeCost();
        };

        let i = 0;
        const timeCost = () => (i * span / 1000).toFixed(2) + " sec";

        const stdout = process.stdout as any;
        const execute = async () => {
            await forMs(delay);
            while (!closed) {
                stdout.cursorTo(0);
                const indCount = i++ % length;
                const bodyCount = (indCount + 3) % length;
                if (bodyCount > indCount) {
                    stdout.write("[" + "-".repeat(indCount) + "#".repeat(3) + "-".repeat((length - bodyCount) % length) + "] total:" + timeCost());
                } else {
                    stdout.write("[" + "#".repeat(bodyCount) + "-".repeat(indCount - bodyCount) + "#".repeat(3 - bodyCount) + "] total:" + timeCost());
                }
                stdout.clearLine(1);
                await forMs(span);
            }
            return timeCost();
        };
        execute().then((timeCostStr) => {
            stdout.cursorTo(0);
            stdout.write("[done] total time cost : " + timeCostStr);
            stdout.clearLine(1);
            console.log("");
        });

        return Close;
    }

}
