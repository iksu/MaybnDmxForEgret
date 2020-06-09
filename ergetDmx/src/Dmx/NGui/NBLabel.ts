//文字绑定类
///<reference path="NLabel.ts" />
//使用方法
//let list = new Listx();
//list["att"] = "1";
//let l = new NBLabel(list, "att", 17, 0x83fb1f);
//this.Add(l);
//list["att"] = "2";

///<reference path="NLabel.ts" />

class NBLabel extends NLabel {
    public constructor(item: Listx, bindKey: string = "", color: number = -1, bold: boolean = false, size: number = -1, act: Function = null, stroke: number = 0, strokeColor: number = -1) {
        super("", color, bold, size, stroke, strokeColor);
        this.Bind(item, bindKey, act);
    }

    public ChangeBind(item: Listx): void {
        if (this.item != item) {
            this.Bind(item, this.bindKey, this.act);
        }
    }
}

window["NBLabel"] = NBLabel;


