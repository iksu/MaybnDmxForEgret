///<reference path="NLabel.ts" />

class NColorText extends NLabel {
    public static arr: Array<any>;
    public static arrFilter: Array<any>;
    public static arrFilterNoborder: Array<any>;
    public static willEmbedFontsFunc: Function = null;
    public static starlingOffsetSize: number = 5;

    public constructor(val: string, bold: boolean = false, size: number = -1, style: number = 10, showBorderFilters: boolean = true) {
        var color: number = -0;
        if (style == 0) {
            color = 0xffffff;
        } else {
            color = NColorText.arr[style];
        }
        // if (Js.SupportWebGL) {
        //     color = 0xffffff;
        // }
        if (val == null) {
            val = "";
        }
        val = val.replace(/<[^>]+>/g, "");
        super(val, color, bold, size, 2, 0x555555);
        // if (Js.SupportWebGL) {
        //     if (style > 0) {
        //         if (showBorderFilters) {
        //             this.filters = NColorText.arrFilter[style];
        //         } else {
        //             this.filters = NColorText.arrFilterNoborder[style];
        //         }
        //     }
        // } else {
        //     if (style > 0) {
        //         this.filters = [new egret.GlowFilter(0x666666, 0.6, 4, 4, 5, 1), new egret.DropShadowFilter(1, 45, 0x1d0d02, 0.5, 1, 1, 10, 2)];
        //     }
        // }
    }

    public ValMulti(val: string, width: number, leading: number = 5): void {
        this.SetMultiline(width, leading);
        this.val = val;
    }

    public static ExsistStyle(style: number): boolean {
        return true;
    }

    public set style(val: number) {
        if (Js.SupportWebGL) {
            if (val > 0) {
                //if (this.showBorderFilters) {
                this.filters = NColorText.arrFilter[val];
                //} else {
                //    this.filters = NColorText.arrFilterNoborder[val];
                //}
            }
        } else {
            this.color = NColorText.arr[val];
        }
    }
}

window["NColorText"] = NColorText;