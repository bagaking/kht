import {spawn} from "child_process";
import * as fs from "fs-extra";
import * as Path from "path";
import {ConsoleHelper} from "./consoleHelper";

export class Git {

    public static async clone(repoPath: string, outPath: string, version = "master") {
        return new Promise((resolve, reject) => {

            const process = spawn("git", ["clone", "--", repoPath, outPath]);
            process.stderr.on("data", (data) => {
                console.log("==> ", data.toString());
            });
            const closeBar = ConsoleHelper.WaitingBar(40, 30, 50);

            process.on("close", (status) => {
                if (status === 0) {
                    _checkout();
                } else {
                    closeBar();
                    reject(new Error("'git clone' failed with status " + status));
                }
            });

            function _checkout() {
                const args = ["checkout", version];
                const process = spawn("git", args, {cwd: outPath});
                process.on("close", (status) => {
                    if (status === 0) {
                        resolve(closeBar());
                    } else {
                        closeBar();
                        reject(new Error("'git checkout' failed with status " + status));
                    }
                });
            }

        });
    }

    public static async fetchAsFiles(repoPath: string, outPath: string, version = "master") {
        return Git.clone(repoPath, outPath, version).catch((err) => {
            console.log("get tables failed", err);
            fs.removeSync(outPath);
        }).then(() => fs.removeSync(Path.resolve(outPath, ".git")));
    }
}
