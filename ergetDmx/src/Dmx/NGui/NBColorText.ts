///<reference path="NColorText.ts" />

class NBColorText extends NColorText {
    public constructor(item: Listx, bindKey: string = "", bold: boolean = false, size: number = 13, style: number = 0, act: Function = null) {
        super("", bold, size, style);
        this.Bind(item, bindKey, act);
    }

    public ChangeBind(item: Listx): void {
        if (this.item != item) {
            this.Bind(item, this.bindKey, this.act);
        }
    }
}

window["NBColorText"] = NBColorText;