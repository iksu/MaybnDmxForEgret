class NNum extends Sx {
    public static extraOffset: number = 0;
    public offset: number;
    public type: string = "z";
    public leftOffset: number;
    public num: string;

    public constructor(num: string, type: string = "z", verification: boolean = false, offset: number = 0) {
        super();
        this.offset = offset + NNum.extraOffset;
        this.type = type;
        this.Set(num, type, verification);
    }

    public Set(num: string, type: string = "z", verification: boolean = false): void {
        num = num.toString();
        this.num = num;
        this.RemoveAll();
        this.type = type;
        this.leftOffset = 0;
        try {
            if (num == null) {
                num = "";
            }
            for (var i: number = 0, len: number = num.length; i < len; i++) {
                var char: string = num.charAt(i);
                if (char == " ") {
                    this.leftOffset += 5;
                } else {
                    if (char == "-") {
                        char = "j";
                    } else if (char == "+") {
                        char = "i";//i
                    } else if (char == "/") {
                        char = "p";//h
                    } else if (char == ".") {
                        char = "d";
                    } else if (char == ":") {
                        char = "m";
                    }
                    try {
                        var bx = new Bx(type + char);
                        bx.x = this.leftOffset;
                        this.leftOffset += bx.width + this.offset;
                        this.Add(bx);
                        if (verification) {
                            bx.rotation = Strx.Rnd(40) - 20;
                        }
                    } catch (ex) {
                        Js.Trace("Error Num:" + type + char + " orig: " + num);
                    }
                }
            }
            //super.width=left+3;
        } catch (ex) {
            Js.Trace("Error Num:" + num);
        }
        if (this.align == 1) {
            this.PutCenter();
        } else if (this.align == 2) {
            this.PutRight();
        }
    }

    public get val() {
        return this.num;
    }

    public set val(val: string) {
        this.Set(val, this.type);
    }

    public get valNum() {
        return this.num.ToInt();
    }

    public set valNum(val: number) {
        this.Set(val.toString(), this.type);
    }

    public get width(): number {
        return this.leftOffset;
    }
}

window["NNum"] = NNum;