///<reference path="NLabel.ts" />

class NBKLabel extends NLabel {
    public constructor(key: string, item: Listx, bindKey: string = "", keyType: number = 17, color: number = -1, bold: boolean = false, size: number = -1, act: Function = null) {
        super("", color, bold, size);
        this.keyType = keyType;

        if (Strx.IsFull(key)) {
            this.key = key;
        }
        this.Bind(item, bindKey, act);
    }

    public ChangeBind(item: Listx): void {
        if (this.item != item) {
            this.Bind(item, this.bindKey, this.act);
        }
    }
}

window["NBKLabel"] = NBKLabel;

