class TaskQueue {
    private timeout: number = 100;
    private onIdle: Function;

    public constructor(timeout: number = 100, onIdle: Function = null) {
        this.timeout = timeout;
        this.onIdle = onIdle;
    }

    public queue: Array<any> = new Array<any>();
    private inHandle: boolean = false;
    public AddQueue(func: any): void {
        if (this.inHandle) {
            this.queue.push(func);
        } else {
            this.Handle(func);
        }
    }

    private Handle(func: any = null): void {
        this.inHandle = true;
        if (func == null) {
            if (this.queue.length > 0) {
                func = this.queue.splice(0, 1)[0];
            } else {
                this.inHandle = false;
                if (this.onIdle) {
                    this.onIdle();
                }
            }
        }
        if (func) {
            try {
                if (typeof func === 'function') {
                    if (func()) {
                        NForm.SetTimeout(this.timeout, () => {
                            this.Next();
                        });
                    }
                } else if (func.hasOwnProperty("func")) {
                    if (func["func"]()) {
                        NForm.SetTimeout(this.timeout, () => {
                            this.Next();
                        });
                    }
                }
            } catch (ex) {
                Js.Trace(ex);
            }
        }
    }

    public Next(): void {
        this.Handle();
    }

    public disposed: boolean = false;

    public Dispose() {
        let that = this;
        if (!this.disposed) {
            this.disposed = true;
        }
    }
}

window["TaskQueue"] = TaskQueue;