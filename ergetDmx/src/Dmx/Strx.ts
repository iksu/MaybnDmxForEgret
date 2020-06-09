//文本处理类
interface String {
    IsFull(): boolean;
    IsEmpty(): boolean;
    ToInt(): number;
    WriteLog(): void;
    TrueLength(): number;
    PaddingLeft(c: string, count: number);
    PaddingRight(c: string, count: number);
    Trim();
    StartWith(c: string);
}

if (!String.prototype.IsFull) {
    String.prototype.IsFull = function () {
        return Strx.IsFull(this);
    };
}

if (!String.prototype.IsEmpty) {
    String.prototype.IsEmpty = function () {
        return Strx.IsEmpty(this);
    };
}

if (!String.prototype.ToInt) {
    String.prototype.ToInt = function () {
        if (this == null || this == "") {
            return 0;
        }
        var rv = parseInt(this);
        if (isNaN(rv)) {
            return 0;
        }
        return rv;
    };
}

if (!String.prototype.WriteLog) {
    String.prototype.WriteLog = function () {
        return Js.Trace(this);
    };
}

if (!String.prototype.TrueLength) {
    String.prototype.TrueLength = function () {
        // var text: string = this;
        // if (text.IsEmpty())
        //     return 0;
        // let rv = 0;
        // for (let i = 0, len = text.length; i < len; i++) {
        //     let num = text.charCodeAt(i);
        //     if (num < 0 || num > 0x7f) {
        //         rv += 2;
        //     }
        //     else {
        //         rv++;
        //     }
        // }
        // return rv;
        return Strx.TrueLength(this);
    };
}

if (!String.prototype.PaddingLeft) {
    String.prototype.PaddingLeft = function (c: string, count: number) {
        // let left = "";
        // for (let i = 0, len = count - this.length; i < len; i++) {
        //     left += c;
        // }
        // return left + this;
        return Strx.PaddingLeft(this, count, c);
    }
};

if (!String.prototype.PaddingRight) {
    String.prototype.PaddingRight = function (c: string, count: number) {
        return Strx.PaddingRight(this, count, c);
    }
};

if (!String.prototype.Trim) {
    String.prototype.Trim = function () {
        return Strx.Trim(this);
    }
};

if (!String.prototype.StartWith) {
    String.prototype.StartWith = function (c: string) {
        if (this.length >= c.length && this.substr(0, c.length) == c) {
            return true;
        }
        return false;
    }
};

class Strx {
    public constructor() {
    }

    public static Setup() {
    }

    public static NUMS: Array<string> = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    public static CHARS: Array<string> = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

    public static Rnd(max: number): number {
        max = max;
        return Math.floor(Math.random() * (max));
    }

    public static Int(text: any): number {
        var rv: number = 0;
        try {
            rv = parseInt(text);
        }
        catch (ex) {
            rv = 0;
        }
        return rv;
    }

    public static IsEmpty(text: string): boolean {
        if (text == null || text == undefined || text.length == 0) {
            return true;
        }
        else {
            return false;
        }
    }

    public static IsFull(text: string): boolean {
        return !Strx.IsEmpty(text);
    }

    public static PaddingLeft(text: string, len: number, char: string): string {
        if (text.length >= len) {
            return text.substr(0, len);
        }
        else {
            var needLen: number = len - text.length;
            for (var i: number = 0; i < needLen; i++) {
                text = char + text;
            }
        }
        return text;
    }

    public static PaddingRight(text: string, len: number, char: string): string {
        if (text.length >= len) {
            return text.substr(0, len);
        }
        else {
            var needLen: number = len - text.length;
            for (var i: number = 0; i < needLen; i++) {
                text = text + char;
            }
        }
        return text;
    }

    public static Trim(str: string): string {
        while (str.substr(0, 1) == " ") {
            str = str.substr(1);
        }
        while (str.substr(-1, 1) == " ") {
            str = str.substr(0, str.length - 1);
        }
        return str;
    }

    public static GetSmaNum(val: number): string {
        var wanText: string = "";
        if (Lang.type == LangType.Cht) {
            wanText = "萬";
        }
        else {
            wanText = "万";
        }
        if (val < 10000) {
            return val.toString();
        }
        else {
            var left: number = (val / 10000).ToInt();
            var right: number = val - left * 10000;
            if (right == 0) {
                return left + wanText;
            }
            else {
                return left + "." + right.toString().substring(0, 1) + wanText;
            }
        }
    }

    public static TrueLength(text: string): number {
        if (Strx.IsEmpty(text))
            return 0;
        var rv: number = 0;
        for (var i: number = 0, len: number = text.length; i < len; i++) {
            var num: number = text.charCodeAt(i);
            if (num < 0 || num > 0x7f) {
                rv += 2;
            }
            else {
                rv++;
            }
        }
        return rv;
    }

    public static Num2Str(d: number, decimal: number = 1): string {
        var s: string = d.toString();
        if (s.indexOf(".") > -1) {
            var ss: Array<string> = s.split(".");
            if (ss[1].length >= decimal) {
                return ss[0] + "." + ss[1].substr(0, decimal);
            }
            else {
                return ss[0] + "." + Strx.PaddingRight(ss[1], decimal, "0");
            }
        }
        else {
            return s + "." + Strx.PaddingRight("", decimal, "0");
        }
    }

    public static Decompress(buffer: Uint8Array): Uint8Array {
        var inflate = new Zlib.Inflate(buffer);
        var inbuffer: Uint8Array = inflate.decompress();
        return inbuffer;
    }

    public static Encompress(buffer: Uint8Array): Uint8Array {
        var inflate = new Zlib.Deflate(buffer);
        var inbuffer: Uint8Array = inflate.compress();
        return inbuffer;
    }

    public static CalulateXYAnagle(startx: number, starty: number, endx: number, endy: number): number {
        let tan = Math.atan(Math.abs((endy - starty) / (endx - startx))) * 180 / Math.PI;
        if (endx >= startx && endy >= starty) {
            return -tan;
        }
        else if (endx > startx && endy < starty) {
            return tan;
        }
        else if (endx < startx && endy > starty) {
            return tan - 180;
        }
        else {
            return 180 - tan;
        }
        //return tan;
    }

    public static GetInnerText(text: string, begin: string, end: string, times: number = 1): string {
        try {
            let str: string = "";
            if (end.IsFull()) {
                for (let i: number = 1; i < times; i++) {
                    let index: number = text.indexOf(begin);
                    text = text.substr(index + begin.length, (text.length - index) - begin.length);
                }
                let str2: string = text.substr(0, text.indexOf(begin) + begin.length);
                let str3: string = text.substr(str2.length, text.length - str2.length);
                if (str3.indexOf(end) == -1) {
                    return str3;
                }
                else if (text.indexOf(begin) == -1) {
                    return str;
                }
                try {
                    return str3.substr(0, str3.indexOf(end));
                }
                catch (ex) {
                    return str3;
                }
            }
            let str4: string = text.substr(0, text.indexOf(begin) + begin.length);
            return text.substr(str4.length, text.length - str4.length);
        }
        catch (ex) {
            return "";
        }
    }

    public static IsString(val: any): boolean {
        if (val == null) {
            return false;
        }
        return egret.getQualifiedClassName(val) == "string";
    }
}

window["Strx"] = Strx;