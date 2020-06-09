//带有标头的文字绑定类
///<reference path="NLabel.ts" />
//使用方法
//let list = new Listx();
//list["att"] = "1";
//let l = new NBKLabel("攻击", list, "att", 17, 0x83fb1f);
//this.Add(l);
//list["att"] = "2";
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

