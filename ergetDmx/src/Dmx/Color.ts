class Color {
    public color: number = 0;
    public constructor(argb: number = 0) {
        this.Set(argb);
    }

    public Set(color: number = 0): void {
        this.color = color;
    }

    public get a(): number {
        return this.color >> 24 & 0xff;
    }

    public get r(): number {
        return this.color >> 16 & 0xff;
    }

    public get g(): number {
        return this.color >> 8 & 0xff;
    }

    public get b(): number {
        return this.color & 0xff;
    }

    public get rgb(): string {
        return "#" + Strx.PaddingRight(this.r.toString(16), 2, "0") + Strx.PaddingRight(this.g.toString(16), 2, "0") + Strx.PaddingRight(this.b.toString(16), 2, "0");
    }


    public static get Green(): number {
        return 0x83fb1f;
    }

    public static get GreenGame(): string {
        return "#83fb1f";
    }

    public static Parse(color: string): Color {
        return new Color(color.replace("#", "0x").ToInt());
    }
}

window["Color"] = Color;