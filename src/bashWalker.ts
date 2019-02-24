import {exec} from "child_process";
import * as fs from "fs-extra";
import * as path from "path";

function run(cmd: string): Promise<string[]> {
    return new Promise((resolve: (ret: string[]) => any, reject: (err: Error) => void) => {
        exec(cmd, (err, stdout, stderr) => {
            if (err) {
                reject(err);
                return;
            }
            resolve([stdout, stderr]);
        });
    });
}

export async function bashWalker(commands: string[], tag: string = "") {
    console.log("START");
    await fs.ensureDir("./__export");
    const dir = "./__export";
    const filename = `${tag}_${Date.now()}.log`;
    const filePath = path.join(dir, filename);
    console.log("Logs :", filePath);

    for (let i = 0; i < commands.length; i++) {
        const ret = await run(commands[i]).catch((err) => console.log(` - !! ERROR !! ${commands[i]} ${err}`));
        if (!ret) {
            console.log(`run ${commands[i]} failed, ret is void.`);
            continue;
        }
        const errInfo = `
==> Execute ${i}: ${commands[i]}
 - INFO: ${ret[0]}
 - WARNING: ${ret[1]}
    `;
        console.log(errInfo);
        await fs.appendFile(filePath, errInfo);
    }
    console.log("EVERYTHING DONE");
}
