export class TimeoutError extends Error {

    public name: string;

    constructor(public readonly message: string, public readonly ms?: number) {
        super(message);
        this.name = "TimeoutError";
    }
}
