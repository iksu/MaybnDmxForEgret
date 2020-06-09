class Filters {
    public static get borderFilter(): Array<any> {
        return [new egret.GlowFilter(0x000000, 0.6, 3, 3, 5, 1), new egret.DropShadowFilter(1, 45, 0x1d0d02, 0.5, 1, 1, 10, 2)];
    }

    public static get deepBorderFilter(): Array<any> {
        return [new egret.GlowFilter(0x4d2600, 1, 4, 4, 4, 1), new egret.DropShadowFilter(2, 45, 0x4d2600, 1, 1, 1, 13, 2)];
    }

    public static get tabBorderFilter(): Array<any> {
        return [new egret.GlowFilter(0x642e0a, 1, 5, 5, 6, 1)];
    }

    public static get tabBorderFilterOff(): Array<any> {
        return [new egret.GlowFilter(0xffffff, 1, 5, 5, 6, 1)];
    }

    public static get borderFilter0(): Array<any> {
        return [new egret.GlowFilter(0x965805, 1, 3, 3, 5, 1), new egret.DropShadowFilter(1, 45, 0x1d0d02, 0.5, 1, 1, 10, 2)];
    }

    public static get borderFilter1(): Array<any> {
        return [new egret.GlowFilter(0x00295f, 1, 3, 3, 5, 1), new egret.DropShadowFilter(1, 45, 0x1d0d02, 0.5, 1, 1, 10, 2)];
    }

    public static get borderFilter2(): Array<any> {
        return [new egret.GlowFilter(0x8c2e24, 1, 3, 3, 5, 1), new egret.DropShadowFilter(1, 45, 0x1d0d02, 0.5, 1, 1, 10, 2)];
    }

    public static get borderFilter3(): Array<any> {
        return [new egret.GlowFilter(0x7c5131, 1, 3, 3, 5, 1), new egret.DropShadowFilter(1, 45, 0x1d0d02, 0.5, 1, 1, 10, 2)];
    }

    public static get borderFilter4(): Array<any> {
        return [new egret.GlowFilter(0x006e27, 1, 3, 3, 5, 1), new egret.DropShadowFilter(1, 45, 0x1d0d02, 0.5, 1, 1, 10, 2)];
    }

    public static get borderFilter5(): Array<any> {
        return [new egret.GlowFilter(0x8c613f, 1, 3, 3, 5, 1), new egret.DropShadowFilter(1, 45, 0x1d0d02, 0.5, 1, 1, 10, 2)];
    }

    public static get greenBorderFilter(): Array<any> {
        return [new egret.GlowFilter(0x003300, 0.6, 3, 3, 5, 1), new egret.DropShadowFilter(1, 45, 0x1d0d02, 0.5, 1, 1, 10, 2)];
    }

    public static get borderLightFilter(): Array<any> {
        return [new egret.GlowFilter(0x000000, 0.2, 3, 3, 5, 1), new egret.DropShadowFilter(1, 45, 0x1d0d02, 0.5, 1, 1, 10, 2)];
    }

    public static get lightGlowFilter(): Array<any> {
        return [new egret.GlowFilter(0xffffbe, 0.55, 4, 4, 5, 1)];
    }

    public static get glowFilter(): Array<any> {
        return [new egret.GlowFilter(0x140c09, 0.35, 8, 8, 3, 1)];
    }

    public static get blackLineFilter(): Array<any> {
        return [new egret.DropShadowFilter(1, 45, 0x1d0d02, 0.9, 3, 2, 20, 2)];
    }

    public static get blackLightLineFilter(): Array<any> {
        return [new egret.DropShadowFilter(1, 45, 0x000000, 0.9, 1, 1, 3, 2)];
    }

    public static get knockoutGlowFilter(): Array<any> {
        return [new egret.GlowFilter(0x88ff88, 0.75, 6, 6, 3, 1, true, true), new egret.BlurFilter(3, 3, 1)];
    }

    public static get knockoutWhiteGlowFilter(): Array<any> {
        return [new egret.GlowFilter(0xffffff, 0.8, 6, 6, 10, 1, true, true), new egret.BlurFilter(3, 3, 1)];
    }

    public static get knockoutRedGlowFilter(): Array<any> {
        return [new egret.GlowFilter(0xff0000, 0.75, 20, 20, 5, 1, true, true), new egret.BlurFilter(3, 3, 1)];
    }

    public static get knockoutGrayFilter(): Array<any> {
        return [new egret.GlowFilter(0x888888, 0.75, 20, 20, 2, 1, true, true)];
    }

    public static get blackFilter(): Array<any> {
        return [new egret.GlowFilter(0x000000, 1, 2, 2, 5, 1)];
    }

    public static get redFilter(): Array<any> {
        return [new egret.ColorMatrixFilter([
            0.3086, 0.6094, 0.0820, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 1, 0
        ])];
    }

    public static get grayFilter(): Array<any> {
        // return [new egret.ColorMatrixFilter([
        //     0.3086, 0.6094, 0.0820, 0, 0,
        //     0.3086, 0.6094, 0.0820, 0, 0,
        //     0.3086, 0.6094, 0.0820, 0, 0,
        //     0, 0, 0, 1, 0
        // ])];
        return [new egret.ColorMatrixFilter([
            0.3, 0.6, 0, 0, 0,
            0.3, 0.6, 0, 0, 0,
            0.3, 0.6, 0, 0, 0,
            0, 0, 0, 1, 0
        ])];
    }


    public static get lightGrayFilter(): Array<any> {
        return [new egret.ColorMatrixFilter([
            0.4, 0.7, 0.1, 0, 0,
            0.4, 0.7, 0.1, 0, 0,
            0.4, 0.7, 0.1, 0, 0,
            0, 0, 0, 1, 0
        ])];
    }

    public static get brownGlowFilter(): Array<any> {
        return [new egret.GlowFilter(0x660000, 0.7, 10, 10, 3, 1)];
    }

    public static get greenGlowFilter(): Array<any> {
        return [new egret.GlowFilter(0x00ff00, 0.55, 4, 4, 2, 1)];
    }

    public static get redGlowFilter(): Array<any> {
        return [new egret.GlowFilter(0xff0000, 0.55, 4, 4, 2, 1)];
    }

    public static get highLightFilter(): Array<any> {
        return [new egret.ColorMatrixFilter([
            1.5, 0, 0, 0, 0,
            0, 1.5, 0, 0, 0,
            0, 0, 1.5, 0, 0,
            0, 0, 0, 1, 0
        ])];
    }
}

window["Filters"] = Filters;