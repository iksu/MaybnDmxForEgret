class NKLabel extends NLabel {
    public constructor(key: string = "",val: string = "",keyType: number = 17,color: number = -1,bold: boolean = false,size: number = -1)
    {
        super(val,color,bold,size);
        this.keyType = keyType;
        this.key = key;
    }
}

window["NKLabel"] = NKLabel;