import {WriteStream} from "fs";
import * as readline from "readline";
import {forMs} from "./wait";

export class ConsoleHelper {

    public static cursorTo(stdout: WriteStream, x: number, y?: number) {
        readline.cursorTo(stdout, 0);
    }

    public static clearLine(stdout: WriteStream, dir: number) {
        readline.clearLine(stdout, dir);
    }

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
                this.cursorTo(stdout, 0);
                // stdout.cursorTo(0);
                const indCount = i++ % length;
                const bodyCount = (indCount + 3) % length;
                if (bodyCount > indCount) {
                    stdout.write("[" + "-".repeat(indCount) + "#".repeat(3) + "-".repeat((length - bodyCount) % length) + "] total:" + timeCost());
                } else {
                    stdout.write("[" + "#".repeat(bodyCount) + "-".repeat(indCount - bodyCount) + "#".repeat(3 - bodyCount) + "] total:" + timeCost());
                }
                this.clearLine(stdout, 1);
                // stdout.clearLine(1);
                await forMs(span);
            }
            this.cursorTo(stdout, 0);
            // stdout.cursorTo(0);
            stdout.write("[" + "#".repeat(length) + "] total:" + timeCost());
            return timeCost();
        };
        execute().then((timeCostStr) => {
            this.cursorTo(stdout, 0);
            // stdout.cursorTo(0);
            stdout.write("[done] total time cost : " + timeCostStr);
            this.clearLine(stdout, 1);
            // stdout.clearLine(1);
            console.log("");
        });

        return Close;
    }

    public static async question(questionContent: string) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        return new Promise(((resolve) => {
            rl.question(questionContent, (result) => {
                rl.close();
                resolve(result);
            });
        }));
    }

}
