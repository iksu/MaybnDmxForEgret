class NText extends Sx {
    public static bgRender: Function;

    private _key: string;
    private _val: string;
    public keyTextField: NLabel;
    private textFieldp: Sx;
    public textField: egret.TextField;
    public bg: any;
    public static color: number = 0x000000;
    public func: Function;
    public completeFunc: Function;

    public w: number;
    public h: number;

    public constructor(key: string, val: string, maxSize: number, w: number, h: number = -1, func: Function = null, completeFunc: Function = null, fontSize: number = 20) {
        super();
        this._key = key;
        this.func = func;
        this.completeFunc = completeFunc;

        if (h < 40) {
            h = 40;
        }

        this.w = w;
        this.h = h;

        this.bg = NText.bgRender();
        this.bg.width = w + 10;
        this.bg.height = h;
        this.Add(this.bg);

        this.textFieldp = new Sx();
        this.Add(this.textFieldp);

        this.textField = new egret.TextField();
        this.textField.type = egret.TextFieldType.INPUT;
        this.textField.width = w;
        this.textField.height = h;
        this.textField.size = fontSize;
        this.textField.maxChars = maxSize;
        this.textField.textColor = NText.color;

        this.textFieldp.Add(this.textField, 0, (h - fontSize) / 4);//new NColorText("", false, 15, 17);

        if (func) {
            this.textField.addEventListener(egret.TextEvent.CHANGE, func, this);
            this.textField.addEventListener(egret.Event.CHANGE, func, this);
        }

        if (completeFunc) {
            this.textField.addEventListener(egret.TextEvent.FOCUS_OUT, completeFunc, this);
            this.textField.addEventListener(egret.Event.FOCUS_OUT, completeFunc, this);
        }

        this.textField.addEventListener(egret.TextEvent.FOCUS_IN, () => {
            Msg.Call("TextFieldFocusIn", null);
        }, this);
        this.textField.addEventListener(egret.Event.FOCUS_IN, () => {
            Msg.Call("TextFieldFocusIn", null);
        }, this);
        this.textField.addEventListener(egret.TextEvent.FOCUS_OUT, () => {
            Msg.Call("TextFieldFocusOut", null);
        }, this);
        this.textField.addEventListener(egret.Event.FOCUS_OUT, () => {
            Msg.Call("TextFieldFocusOut", null);
        }, this);

        if (Strx.IsFull(this._key)) {
            if (NColorText.ExsistStyle(0)) {
                this.keyTextField = new NColorText(Lang.PT(this._key) + "：", true, fontSize, 0);
            } else {
                this.keyTextField = new NLabel(Lang.PT(this._key) + "：", 0xffffff, true, fontSize);
            }
            this.keyTextField.y = (h - fontSize) / 2 - 1;
            this.Add(this.keyTextField);
        }

        this.val = val;

        this.OnPos(() => {
            this.SetTextFieldPos();
        });

        this.addEventListenerSx(egret.Event.ADDED_TO_STAGE, this.SetTextFieldPos);
    }

    private SetTextFieldPos(ev: any = null) {
        if (this.parent) {
            NForm.LazyCall((() => {
                if (!this.disposed) {
                    var keyWidth: number = 0;
                    if (this.keyTextField) {
                        keyWidth = this.keyTextField.width;
                    }
                    this.bg.x = keyWidth + 8;
                    this.bg.y = -4;
                    this.textFieldp.x = keyWidth + 16;
                    this.textFieldp.y = 3;
                }
            }).bind(this));
        }
    }

    public get val(): string {
        return this.textField.text;
    }

    public set val(val: string) {
        if (val == null) {
            val = "";
        }
        this._val = val;
        this.textField.text = val;
    }

    public get multiline(): boolean {
        return this.textField.multiline;
    }

    public set multiline(val: boolean) {
        this.textField.multiline = val;
    }

    public set isPassword(val: boolean) {
        this.textField.displayAsPassword = val;
    }

    private holdPlaceLabel: NLabel;
    public set holdPlace(val: string) {
        if (this.holdPlaceLabel == null) {
            this.holdPlaceLabel = new NLabel("", 0xaaaaaa, false, this.textField.size - 2);
            this.holdPlaceLabel.alpha = 0.3;
            this.textFieldp.Add(this.holdPlaceLabel, this.textField.x + 1, (this.h - this.holdPlaceLabel.height) / 2 - 2);
            if (this.val.IsFull()) {
                this.holdPlaceLabel.Hide();
            }
            this.textField.addEventListener(egret.TextEvent.CHANGE, this.HandleHoldPlace, this);
            this.textField.addEventListener(egret.Event.CHANGE, this.HandleHoldPlace, this);
        }
        this.holdPlaceLabel.val = val;
    }

    private HandleHoldPlace(ev: any) {
        if (this.val.IsFull()) {
            this.holdPlaceLabel.Hide();
        } else {
            this.holdPlaceLabel.Show();
        }
    }

    public Dispose() {
        if (this.func) {
            this.textField.removeEventListener(egret.TextEvent.CHANGE, this.func, this);
            this.textField.removeEventListener(egret.Event.CHANGE, this.func, this);
        }
        if (this.completeFunc) {
            this.textField.removeEventListener(egret.TextEvent.FOCUS_OUT, this.completeFunc, this);
            this.textField.removeEventListener(egret.Event.FOCUS_OUT, this.completeFunc, this);
        }
        this.textField.removeEventListener(egret.TextEvent.CHANGE, this.HandleHoldPlace, this);
        this.textField.removeEventListener(egret.Event.CHANGE, this.HandleHoldPlace, this);
        this.func = null;
        this.completeFunc = null;
        super.Dispose();
    }
}

window["NText"] = NText;