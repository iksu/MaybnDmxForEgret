class ColorChange {//extends Array<number>
    private static DELTA_INDEX: Array<number> = [
        0, 0.01, 0.02, 0.04, 0.05, 0.06, 0.07, 0.08, 0.1, 0.11,
        0.12, 0.14, 0.15, 0.16, 0.17, 0.18, 0.20, 0.21, 0.22, 0.24,
        0.25, 0.27, 0.28, 0.30, 0.32, 0.34, 0.36, 0.38, 0.40, 0.42,
        0.44, 0.46, 0.48, 0.5, 0.53, 0.56, 0.59, 0.62, 0.65, 0.68,
        0.71, 0.74, 0.77, 0.80, 0.83, 0.86, 0.89, 0.92, 0.95, 0.98,
        1.0, 1.06, 1.12, 1.18, 1.24, 1.30, 1.36, 1.42, 1.48, 1.54,
        1.60, 1.66, 1.72, 1.78, 1.84, 1.90, 1.96, 2.0, 2.12, 2.25,
        2.37, 2.50, 2.62, 2.75, 2.87, 3.0, 3.2, 3.4, 3.6, 3.8,
        4.0, 4.3, 4.7, 4.9, 5.0, 5.5, 6.0, 6.5, 6.8, 7.0,
        7.3, 7.5, 7.8, 8.0, 8.4, 8.7, 9.0, 9.4, 9.6, 9.8,
        10.0
    ];

    // identity matrix constant:
    private static IDENTITY_MATRIX: Array<number> = [
        1, 0, 0, 0, 0,
        0, 1, 0, 0, 0,
        0, 0, 1, 0, 0,
        0, 0, 0, 1, 0,
        0, 0, 0, 0, 1
    ];
    private static LENGTH: number = ColorChange.IDENTITY_MATRIX.length;


    public data: Array<number> = [];
    // initialization:
    public constructor(p_matrix: Array<number> = null) {
        //super();
        p_matrix = this.fixMatrix(p_matrix);
        this.copyMatrix(((p_matrix.length == ColorChange.LENGTH) ? p_matrix : ColorChange.IDENTITY_MATRIX));
    }


    // public methods:
    public reset(): void {
        for (let i: number = 0; i < ColorChange.LENGTH; i++) {
            this.data[i] = ColorChange.IDENTITY_MATRIX[i];
        }
    }

    public adjustColor(p_brightness: number, p_contrast: number, p_saturation: number, p_hue: number): void {
        this.adjustHue(p_hue);
        this.adjustContrast(p_contrast);
        this.adjustBrightness(p_brightness);
        this.adjustSaturation(p_saturation);
    }

    public adjustBrightness(p_val: number): void {
        p_val = this.cleanValue(p_val, 100);
        if (p_val == 0 || isNaN(p_val)) { return; }
        this.multiplyMatrix([
            1, 0, 0, 0, p_val,
            0, 1, 0, 0, p_val,
            0, 0, 1, 0, p_val,
            0, 0, 0, 1, 0,
            0, 0, 0, 0, 1
        ]);
    }

    public adjustContrast(p_val: number): void {
        p_val = this.cleanValue(p_val, 100);
        if (p_val == 0 || isNaN(p_val)) { return; }
        let x: number;
        if (p_val < 0) {
            x = 127 + p_val / 100 * 127
        } else {
            x = p_val % 1;
            if (x == 0) {
                x = ColorChange.DELTA_INDEX[p_val];
            } else {
                //x = DELTA_INDEX[(p_val<<0)]; // this is how the IDE does it.
                x = ColorChange.DELTA_INDEX[(p_val << 0)] * (1 - x) + ColorChange.DELTA_INDEX[(p_val << 0) + 1] * x; // use linear interpolation for more granularity.
            }
            x = x * 127 + 127;
        }
        this.multiplyMatrix([
            x / 127, 0, 0, 0, 0.5 * (127 - x),
            0, x / 127, 0, 0, 0.5 * (127 - x),
            0, 0, x / 127, 0, 0.5 * (127 - x),
            0, 0, 0, 1, 0,
            0, 0, 0, 0, 1
        ]);
    }

    public adjustSaturation(p_val: number): void {
        p_val = this.cleanValue(p_val, 100);
        if (p_val == 0 || isNaN(p_val)) { return; }
        let x: number = 1 + ((p_val > 0) ? 3 * p_val / 100 : p_val / 100);
        let lumR: number = 0.3086;
        let lumG: number = 0.6094;
        let lumB: number = 0.0820;
        this.multiplyMatrix([
            lumR * (1 - x) + x, lumG * (1 - x), lumB * (1 - x), 0, 0,
            lumR * (1 - x), lumG * (1 - x) + x, lumB * (1 - x), 0, 0,
            lumR * (1 - x), lumG * (1 - x), lumB * (1 - x) + x, 0, 0,
            0, 0, 0, 1, 0,
            0, 0, 0, 0, 1
        ]);
    }

    public adjustHue(p_val: number): void {
        p_val = this.cleanValue(p_val, 180) / 180 * Math.PI;
        if (p_val == 0 || isNaN(p_val)) { return; }
        let cosVal: number = Math.cos(p_val);
        let sinVal: number = Math.sin(p_val);
        let lumR: number = 0.213;
        let lumG: number = 0.715;
        let lumB: number = 0.072;
        this.multiplyMatrix([
            lumR + cosVal * (1 - lumR) + sinVal * (-lumR), lumG + cosVal * (-lumG) + sinVal * (-lumG), lumB + cosVal * (-lumB) + sinVal * (1 - lumB), 0, 0,
            lumR + cosVal * (-lumR) + sinVal * (0.143), lumG + cosVal * (1 - lumG) + sinVal * (0.140), lumB + cosVal * (-lumB) + sinVal * (-0.283), 0, 0,
            lumR + cosVal * (-lumR) + sinVal * (-(1 - lumR)), lumG + cosVal * (-lumG) + sinVal * (lumG), lumB + cosVal * (1 - lumB) + sinVal * (lumB), 0, 0,
            0, 0, 0, 1, 0,
            0, 0, 0, 0, 1
        ]);
    }

    public concat(p_matrix: Array<number>): void {
        p_matrix = this.fixMatrix(p_matrix);
        if (p_matrix.length != ColorChange.LENGTH) { return; }
        this.multiplyMatrix(p_matrix);
    }

    // public clone(): ColorChange {
    //     return new ColorChange(this);
    // }

    public toString(): string {
        return "ColorChange [ " + this.data.join(" , ") + " ]";
    }

    // return a length 20 array (5x4):
    public toArray(): Array<number> {
        return this.data.slice(0, 20);
    }

    // private methods:
    // copy the specified matrix's values to this matrix:
    protected copyMatrix(p_matrix: Array<number>): void {
        let l: number = ColorChange.LENGTH;
        for (let i: number = 0; i < l; i++) {
            this.data[i] = p_matrix[i];
        }
    }

    // multiplies one matrix against another:
    protected multiplyMatrix(p_matrix: Array<number>): void {
        let col: Array<number> = [];

        for (let i: number = 0; i < 5; i++) {
            for (let j: number = 0; j < 5; j++) {
                col[j] = this.data[j + i * 5];
            }
            for (let j = 0; j < 5; j++) {
                let val: number = 0;
                for (let k: number = 0; k < 5; k++) {
                    val += p_matrix[j + k * 5] * col[k];
                }
                this.data[j + i * 5] = val;
            }
        }
    }

    // make sure values are within the specified range, hue has a limit of 180, others are 100:
    protected cleanValue(p_val: number, p_limit: number): number {
        return Math.min(p_limit, Math.max(-p_limit, p_val));
    }

    // makes sure matrixes are 5x5 (25 long):
    protected fixMatrix(p_matrix: Array<number> = null): Array<number> {
        if (p_matrix == null) { return ColorChange.IDENTITY_MATRIX; }
        if (p_matrix instanceof ColorChange) { p_matrix = p_matrix.slice(0); }
        if (p_matrix.length < ColorChange.LENGTH) {
            p_matrix = p_matrix.slice(0, p_matrix.length).concat(ColorChange.IDENTITY_MATRIX.slice(p_matrix.length, ColorChange.LENGTH));
        } else if (p_matrix.length > ColorChange.LENGTH) {
            p_matrix = p_matrix.slice(0, ColorChange.LENGTH);
        }
        return p_matrix;
    }
}

window["ColorChange"] = ColorChange;