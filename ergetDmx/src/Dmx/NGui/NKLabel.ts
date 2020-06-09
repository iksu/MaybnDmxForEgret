//带标头的文字类
//使用方法：
// let l1 = new NKLabel("标题", "这是内容");
// this.Add(l1, 80, 50);
class NKLabel extends NLabel {
    public constructor(key: string = "",val: string = "",keyType: number = 17,color: number = -1,bold: boolean = false,size: number = -1)
    {
        super(val,color,bold,size);
        this.keyType = keyType;
        this.key = key;
    }
}

window["NKLabel"] = NKLabel;