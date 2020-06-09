class NLabel extends Sx {
    public static font: string = "";
    public static defaultColor: number = 0x502d17;

    public bg: Sx;
    public act: Function;
    public keyTextField: NColorText;
    public textF: egret.TextField;
    private keyNum: Sx;
    public keyType: number;

    private _color: number = 0;
    public get color(): number {
        return this._color;
    };
    public set color(val: number) {
        this._color = val;
        this.textF.textColor = val;
    };

    private _bold: boolean = false;
    public get bold(): boolean {
        return this._bold;
    };
    public set bold(val: boolean) {
        this._bold = val;
        this.textF.bold = val;
    };

    private _size: number = 13;
    public get size(): number {
        return this._size;
    };
    public set size(val: number) {
        this._size = val;
        this.textF.size = val * 2;
    };

    private _italic: boolean = false;
    public get italic(): boolean {
        return this._italic;
    };
    public set italic(val: boolean) {
        this._italic = val;
        this.textF.italic = val;
    };

    public item: Listx;

    private _stroke: number = 0;
    public get stroke(): number {
        return this._stroke;
    };
    public set stroke(val: number) {
        this._stroke = val;
        if (val > 0) {
            this.textF.stroke = val;
        }
    };

    private _strokeColor: number = 0;
    public get strokeColor(): number {
        return this._strokeColor;
    };
    public set strokeColor(val: number) {
        this._strokeColor = val;
        if (val > 0) {
            this.textF.strokeColor = val;
        }
    };


    public static fontSize: number = 15;
    public static phoneFontSize: number = 15;

    public constructor(val: string = "", color: number = -1, bold: boolean = false, size: number = -1, stroke: number = 0, strokeColor: number = -1, withBg: boolean = false) {
        super();
        if (color < 0) {
            color = NLabel.defaultColor;
        }
        if (strokeColor < 0) {
            strokeColor = NLabel.defaultColor;
        }

        if (stroke > 20) {
            throw new Error("Error NLabel stroke");
        }

        let minSize = 0;
        if (Parms.phone) {
            minSize = NLabel.phoneFontSize;
        } else {
            minSize = NLabel.fontSize;
        }
        if (size < minSize) {
            size = minSize;
        }

        if (withBg) {
            this.bg = new Sx();
            this.Add(this.bg);
        }

        this.textF = new egret.TextField();
        this.strokeColor = strokeColor;
        this.stroke = stroke;
        this.color = color;
        this.bold = bold;
        this.size = size;
        this.textF.scaleX = 0.5;
        this.textF.scaleY = 0.5;

        if (Strx.IsFull(NLabel.font)) {
            this.textF.fontFamily = NLabel.font;
        }
        this.Add(this.textF);
        this.val = val;
        this.mouseChildren = false;
    }

    private _key: string = "";
    public get key(): string {
        return this._key;
    }

    public set key(val: string) {
        this._key = val;
        if (val.length >= 3) {
            if (val.substr(0, 1) == "@") {
                if (this.keyNum == null) {
                    this.keyNum = new Sx();
                    this.Add(this.keyNum);
                }
                this.keyNum.RemoveAll();
                this.keyNum.Add(new NNum(val.substr(2, val.length - 2), val.substr(1, 1)));
                this.textF.x = this.keyNum.width + 2;
                return;
            }
        }
        if (this.keyTextField == null) {
            this.keyTextField = new NColorText(Lang.PT(this._key) + "：", this.bold, this.size, this.keyType);
            this.Add(this.keyTextField);
            this.keyTextField.size = this.size;
        }
        if (Lang.type == LangType.Chs || Lang.type == LangType.Cht) {
            this.keyTextField.val = Lang.PT(this._key) + "：";
        } else {
            this.keyTextField.val = Lang.PT(this._key) + ": ";
        }

        this.textF.x = this.keyTextField.width;
    }

    private _val: string = "";
    public get val(): string {
        return this._val;
    }

    public set html(val: string) {
        if (this.disposed) {
            return;
        }
        //UnFlatten();
        if (val == null) {
            val = "";
        }
        this._val = val;
        var valText: string = val;

        this.textF.textFlow = this.GetHtml(valText);
        this.HandleHtmlCustom();

        // if (new Number(this.textF.text) > 0) {
        //     this.textF.width = this.textF.text.length * 15 + 15;
        // }
        // else {
        //     this.textF.width = this.textF.text.length * 30 + 30;
        // }

        this.textF.width = this.textF.textWidth * 2 + 15;
        this.textF.height = this.textF.textHeight * 2 + 5;

        if (this.align == 1) {
            this.PutCenter();
        } else if (this.align == 2) {
            this.PutRight();
        }
    }

    public static htmlTextParser: egret.HtmlTextParser;
    private htmlCustom: boolean = false;
    private GetHtml(html: string): Array<egret.ITextElement> {
        if (!NLabel.htmlTextParser) {
            NLabel.htmlTextParser = new egret.HtmlTextParser();
        }
        html = html.toString().replace(/<p>/g, "").replace(/<\/p>/g, "\n");
        let arr: Array<egret.ITextElement> = NLabel.htmlTextParser.parser(Lang.PT(html));
        let index = 0;
        arr.forEach(((fi: egret.ITextElement) => {
            if (fi.text.indexOf("[") > -1 && fi.text.indexOf("]") > -1) {
                let sb = [];
                let inAtt = false;
                let att = { text: [], name: null, atts: [] };
                for (let i = 0, len = fi.text.length; i < len; i++) {
                    let c = fi.text.charAt(i);
                    if (c == "[") {
                        inAtt = true;
                    }
                    else if (c == "]") {
                        let text = att.text.join("");
                        text.split(" ").forEach((fi1) => {
                            if (fi1.IsFull()) {
                                let fi1s = fi1.split("=");
                                let k = fi1s[0];
                                let v = "";
                                if (fi1s.length > 1) {
                                    v = fi1s[1];
                                }
                                if (v.IsFull()) {
                                    att.atts.push({ name: k, val: v });
                                } else {
                                    att.name = k;
                                }
                            }
                        });
                        if (text.indexOf("/") > -1) {
                            //TODO:
                        }
                        inAtt = false;
                    } else {
                        if (inAtt) {
                            att.text.push(c);
                        } else {
                            sb.push(c);
                        }
                    }
                }
                if (att.name == "center/center") {
                    if (fi.style.size > 0) {
                        fi.text = NLabel.HtmlAlignCenter(sb.join(""), this.textF.width, fi.style.size);
                    } else {
                        fi.text = NLabel.HtmlAlignCenter(sb.join(""), this.textF.width, this.size);
                    }
                } else if (att.name == "hr" || att.name == "hr/hr") {
                    let node = { text: "\n" };
                    arr.splice(index, 0, node);
                    index++;

                    fi.text = "\u000B";
                    this.htmlCustom = true;
                } else if (att.name == "bg" || att.name == "bg/bg") {
                    fi.style = { target: sb.join("") };
                    fi.text = "\u000C";
                    this.htmlCustom = true;
                } else if (att.name == "underline" || att.name == "underline/underline") {
                    fi.style.underline = true;
                    fi.text = sb.join("");
                    this.htmlCustom = true;
                } else {
                    fi.text = sb.join("");
                }
            }
            index++;
        }).bind(this));
        return arr;
    }


    public set val(val: string) {
        if (this.disposed) {
            return;
        }
        //UnFlatten();
        if (val == null) {
            val = "";
        }
        this._val = val;
        var valText: string = val;
        // if (Number(this._val).toString() == this._val) {
        //     valText = Strx.GetSmaNum(Strx.Int(this._val));
        // }

        if (this.textF.multiline || valText.indexOf("</") > -1) {
            this.textF.textFlow = this.GetHtml(valText);
            this.HandleHtmlCustom();
        } else {
            this.textF.text = Lang.PT(valText);
        }

        // if (!this.textF.multiline) {
        //     this.textF.width = this.textF.textWidth + 5;
        //     //this.textF.width = this.textF.text.length * this.size + 15;
        //     // if (new Number(this.textF.text) > 0) {
        //     //     this.textF.width = this.textF.text.length * 15 + 15;
        //     // }
        //     // else {
        //     //     this.textF.width = this.textF.text.length * 30 + 30;
        //     //     //                    this.textF.width = this.textF.textWidth + 5;
        //     // }
        // }
        // this.textF.height = this.textF.textHeight + 5;

        if (this.textF.multiline) {
            //this.Add("empty", this.textF.width / 2, this.textF.height / 2);
            this.Add("gridlistempty", this.textF.width / 2, this.textF.height / 2);
        }

        if (this.align == 1) {
            this.PutCenter();
        } else if (this.align == 2) {
            this.PutRight();
        }
        //Flatten();
    }

    private HandleHtmlCustom() {
        if (this.htmlCustom) {
            NForm.LazyCall(() => {
                if (this.disposed) {
                    return;
                }
                let nodes = this.textF.$renderNode.drawData;
                //Js.Trace(nodes);
                for (let i = 0, len = nodes.length - 4; i < len; i += 4) {
                    let x = nodes[i];
                    let y = nodes[i + 1];
                    let t = nodes[i + 2];
                    let d = nodes[i + 3];
                    if (t == "\n\u000B" || t == "\u000B") {
                        let line = new N9("line");
                        line.alpha = 0.8;
                        line.width = this.width;
                        this.Add(line, x, y / 2);
                        nodes[i + 3] = "";
                    } else if (t == "\n\u000C" || t == "\u000C") {
                        let urls = d.target.split(":");
                        let bg = Assert.Img(urls[0]);
                        let bgx = 0;
                        let bgy = 0;
                        if (urls.length > 1) {
                            bgx = urls[1].ToInt();
                        }
                        if (urls.length > 2) {
                            bgy = urls[2].ToInt();
                        }
                        this.bg.Add(bg, x + bgx, y / 2 - this.size / 2 + bgy);
                        nodes[i + 3] = "";
                    }
                }
            });
        }
    }

    public get valInt(): number {
        return this.val.ToInt();
    }

    public set valInt(_val: number) {
        this.val = _val.toString();
    }

    public get x(): number {
        return this._x;
    }

    public set x(val: number) {
        super.SxSetX(val);
        if (this.align == 1) {
            this.PutCenter();
        } else if (this.align == 2) {
            this.PutRight();
        }
    }

    public bindKey: string;
    private bindEmptyP: Sx;
    public Bind(item: Listx, bindKey: string, act: Function = null) {
        if (!item) {
            if (act) {
                this.val = act("");
            } else {
                this.val = "";
            }
            return;
        }
        if (this.bindEmptyP ) {
            this.Remove(this.bindEmptyP);
        }
        this.bindEmptyP = new Sx();
        this.Add(this.bindEmptyP);
        this.item = item;
        this.act = act;
        this.bindKey = bindKey;
        item.ListenArray((() => {
            //Js.Trace("BLabel Changed");
            if (act == null) {
                this.val = this.item.g(this.bindKey);
            } else {
                this.val = this.act(this.item.g(this.bindKey));
            }
        }).bind(this), bindKey.split(","), this.bindEmptyP);
    }

    public OnClick(act: Function): void {
        this.act = act;
        this.mouseEnabled = true;
        this.buttonMode = true;
        this.Click(() => {
            act();
        });
    }

    public get width(): number {
        if (this.disposed) {
            return 0;
        } else {
            return this.textF.textWidth / 2 + 5 + (this.keyTextField == null ? 0 : this.keyTextField.width);
        }
    }

    public get height(): number {
        if (this.disposed) {
            return 0;
        } else {
            if (this.val.IsEmpty()) {
                return this.size;
            } else {
                return this.textF.textHeight / 2;
            }
        }
    }

    public SetMultiline(width: number, leading: number = 5): void {
        if (this.textF.hasOwnProperty("leading")) {
            this.textF["leading"] = leading;
        }
        this.textF.multiline = true;
        //this.textF.wordWrap = true;
        this.textF.width = width * 2;
        this.textF.lineSpacing = leading * 2;
    }

    public Dispose(): void {
        super.Dispose();
        this.act = null;
        this.keyTextField = null;
        this.textF = null;
        this.keyNum = null;
        this.bindEmptyP = null;
        this.item = null;
        this.faces = null;
    }

    private faces: Array<any>;
    public SetFaceVal(value: string): void {
        //UnFlatten();
        if (this.faces == null) {
            this.faces = [];
        }
        this.faces.forEach(function (fi: any) {
            fi.RemoveMe();
        });
        this.faces.length = 0;

        var char: string = "　";
        value = value.replace(/　/g, " ");
        var faceArr: Array<any> = [];
        var face: Array<any> = value.match(/\{f\d{1,2}\}/g);
        if (face ) {
            faceArr = faceArr.concat(face);
        }
        value = value.replace(/\{f\d{1,2}\}/g, "<font size='13'>" + char + "  </font>");

        this.val = value;

        var text: string = this.textF.text;
        var indexArr: Array<any> = [];
        for (var index: number = 0; index < text.length; index++) {
            if (text.charAt(index) == char) {
                indexArr.push(index);
            }
        }
        for (var i: number = 0; i < indexArr.length; i++) {
            //        var pos: Rectangle = textF.getCharBoundaries(indexArr[i]);
            //        var s: NSwfFast = new NSwfFast("Res/qqFace/" + faceArr[i].replace("{f","").replace("}","") + ".swf",null,false,true);
            //        Add(s,pos.x + 4,pos.y - 4);
            //        s.mouseEnabled = false;
            //        faces.push(s);
        }
    }

    public static HtmlAlignCenter(text: string, w: number, fontSize: number): string {
        text = text.replace(/<\/?.+?\/?>/g, "");
        return "".PaddingLeft(" ", (w - text.TrueLength() * fontSize / 2) / (fontSize / 2)) + text;
    }
}

window["NLabel"] = NLabel;