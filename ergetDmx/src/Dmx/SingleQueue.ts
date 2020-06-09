class SingleQueue {
    public timeout: number;
    public handleQueue: Array<any>;
    private inHandle = false;
    private index: number = 0;
    private act: Function;
    private continueCount: number = 0;

    public constructor(act: Function, timeout: number = 800) {
        this.act = act;
        this.timeout = timeout;
        this.handleQueue = new Array<any>();
    }

    public Push(item: any) {
        if (!this.inHandle) {
            try {
                this.Add(item);
            }
            catch (ex) {
                Js.Trace(ex)
            }
        }
        else {
            this.En(item);
        }
    }

    private Add(item: any) {
        try {
            if (this.inHandle) {
                this.handleQueue.push(item);
            }
            else {
                this.inHandle = true;
                this.Handle(item);
            }
        }
        catch (ex) {
            this.inHandle = false;
            Js.Trace(ex)
        }
    }

    private En(item: any) {
        this.handleQueue.push(item);
    }

    private Handle(item: any) {
        if (item == null) {
            this.inHandle = false;
            this.index = 0;
            return;
        }
        try {
            this.act(item);
            this.index++;
        }
        catch (ex) {
            Js.Trace(ex);
        }
        if (this.index >= this.continueCount) {
            this.inHandle = false;
            this.index = 0;
            return;
        }
        else {
            let items = this.handleQueue.splice(0, 1);
            if (items.length > 0) {
                this.Handle(items[0]);
            }
        }
    }

    public End() {
        this.inHandle = true;
        while (true) {
            let items = this.handleQueue.splice(0, 1);
            if (items.length == 0) {
                return;
            }
            try {
                this.act(items[0]);
            }
            catch (ex) {
                Js.Trace(ex);
            }
        }
    }
}

window["SingleQueue"] = SingleQueue;