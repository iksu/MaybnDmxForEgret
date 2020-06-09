class BCenter extends Sx {
    private b: any;
    public constructor(b: any, yAlign: number = 0, xOffset: number = 0, yOffset: number = 0) {
        super();

        if (b == null) {
            return;
        }
        this.b = b;
        if (b.OnLoaded && b.width == 0) {
            b.OnLoaded(() => {
                if (!this.disposed) {
                    b.x = -b.width / 2 + xOffset;
                    if (yAlign == 0) {
                        b.y = -b.height / 2 + yOffset;
                    } else if (yAlign == 1) {
                        b.y = -b.height + yOffset;
                    }
                }
            });
        } else {
            b.x = -b.width / 2 + xOffset;
            if (yAlign == 0) {
                b.y = -b.height / 2 + yOffset;
            } else if (yAlign == 1) {
                b.y = -b.height + yOffset;
            }
        }
        this.Add(b);
    }

    public get width(): number {
        return this.b.width;
    }

    public get height(): number {
        return this.b.height;
    }
}


window["BCenter"] = BCenter;