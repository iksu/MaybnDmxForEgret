class Vector2Hash {
    public v: any;
    public width: number;
    public height: number;

    public constructor(width: number, height: number, data: string = "") {
        this.width = width;
        this.height = height;

        this.v = [];

        for (var i: number = 0; i < height; i++) {
            var v1 = [];
            this.v[i] = v1;
        }

        var len: number = data.length;
        for (i = 0; i < len; i++) {
            var d = data.charAt(i);
            if (d.ToInt()) {
                this.Set(i % width, i / width);
            }
        }
    }

    public Set(x: number, y: number) {
        this.v[y][x] = 1;
    }

    public Delete(x: number, y: number) {
        this.v[y][x] = 0;
    }

    public Exists(x: number, y: number): boolean {
        return this.v[y][x];
    }

    public ExistsPoint(p: Vector2): boolean {
        return this.v[p.y][p.x];
    }

    public Clear(): void {
        for (var i: number = 0; i < this.height; i++) {
            for (var j: number = 0; j < this.width; j++) {
                this.v[i][j] = 0;
            }
        }
    }

    public get length(): number {
        return this.height;
    }
}

window["Vector2Hash"] = Vector2Hash;