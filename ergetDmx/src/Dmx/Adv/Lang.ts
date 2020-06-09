///<reference path="LangType.ts" />

interface String {
    format(arr: Array<any>): string;
}

if (!String.prototype.format) {
    String.prototype.format = function (arr: Array<any>) {
        var args = arr;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

class Lang {
    public static list: any;
    public static type: string = LangType.Chs;
    public static Setup(att: any) {
        Lang.list = att;
    }

    public static Get(key: string): string {
        if (!Lang.list) {
            return "";
        }
        if (Lang.list.hasOwnProperty(key)) {
            let text: string = Lang.list[key];
            if (text.indexOf("&lt;") > -1 && text.indexOf("&gt;") > -1) {
                text = text.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
            }
            if (text.indexOf(" ") > -1) {
                text = text.replace(/ /g, " ");
            }
            return text;
        }
        return "";
    }

    public static Exists(key: string): string {
        return Lang.list.hasOwnProperty(key);
    }

    public static PT(val: string): string {
        if (val == null) {
            val = "";
        }
        try {
            var vals: Array<any> = val.split("|");
            if (vals.length == 1) {
                return Lang.GetLangText(val);
            }
            else {
                var str: string = Lang.GetLangText(vals[0]);
                vals.shift();
                var text: string = str.format(vals);
                return text;
            }
        }
        catch (ex) {
            return val;
        }
    }

    public static transList: Listx;
    public static GetLangText(val: string): string {
        if (Strx.IsEmpty(val)) {
            return "";
        }
        if (Lang.Get == null) {
            return val;
        }
        if (Lang.Get(val)) {
            var val1: string =Lang.Get(val);
            if (Strx.IsFull(val1)) {
                val = val1;
                if (Js.showTrace) {
                    //                    if(NColorText.willEmbedFontsFunc) {
                    //                        Lang.AddTransList(val);
                    //                        Lang.AddTransList(val + "：");
                    //                        Lang.AddTransList("[" + val + "]");
                    //                    }
                }
            }
        }
        else {
            if (val.indexOf(">") > -1 && val.indexOf("<") > -1) {
                var vals: Array<any> = val.split("<");
                for (var j: number = 0, lenj: number = vals.length; j < lenj; j++) {
                    var vals1: Array<any> =vals[j].split(">");
                    for (var i: number = 0, len: number = vals1.length; i < len; i++) {
                        vals1[i] = Lang.GetLangText(vals1[i]);
                    }
                    vals[j] = vals1.join(">");
                }
                val = vals.join("<");
            }
            else {
                if (Js.showTrace) {
                    //                    if(NColorText.willEmbedFontsFunc) {
                    //                        if(val.indexOf("/") == -1) {
                    //                            if(!Lang.transList.Exists(val)) {
                    //                                Lang.AddTransList(val);
                    //                                if(val.length < 15) {
                    //                                    if(val.length != Strx.TrueLength(val))
                    //                                    { }
                    //                                }
                    //                            }
                    //                        }
                    //                    }
                }
            }
        }
        return val;
    }

    public static AddTransList(val: string) {
        if (Js.showTrace) {
            Lang.transList[val] = true;
        }
    }

    public static GetPlant: Function;
    //public static GetHero: Function;
    public static GetGoods: Function;
    public static GetGoodsWithQuality: Function;
    public static GetObj: Function;
}

window["Lang"] = Lang;