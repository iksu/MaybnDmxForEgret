class Arr<T> extends eui.ArrayCollection {
    public constructor(source: any[] = null) {
        super(source);
    }

    public get Count(): number {
        return this.length;
    }

    public get Length(): number {
        return this.length;
    }

    public Add(item: T) {
        this.addItem(item);
    }

    public Remove(item: T) {
        var index = this.getItemIndex(item);
        if (index > -1) {
            this.removeItemAt(index);
        }
    }

    public RemoveBy(func: Function) {
        var len = this.length;
        for (var i = 0; i < len; i++) {
            if (func(this.getItemAt(i))) {
                this.RemoveAt(i);
                break;
            }
        }
    }

    public RemoveAt(index: number) {
        this.removeItemAt(index);
    }

    public InsertAt(item: T, index: number) {
        this.addItemAt(item, index);
    }

    public Contian(item: T): boolean {
        return this.getItemIndex(item) > -1;
    }

    public Clear(): void {
        this.removeAll();
    }

    public Each(func: Function): void {
        var len = this.length;
        //for (var i = len - 1; i >= 0; i--) {
        for (var i = 0; i < len; i++) {
            if (func(this.getItemAt(i), i)) {
                break;
            }
        }
        // this.source.forEach((fi) => {
        //     if (func(fi)) {
        //         return;
        //     }
        // });
    }

    public EachDesc(func: Function): void {
        var len = this.length;
        for (var i = len - 1; i >= 0; i--) {
            if (func(this.getItemAt(i))) {
                break;
            }
        }
    }
}

window["Arr"] = Arr;