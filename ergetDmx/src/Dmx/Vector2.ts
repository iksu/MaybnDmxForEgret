//Vector2类
class Vector2 {
    public x: number = 0;
    public y: number = 0;

    public constructor(x: number = 0,y: number = 0) {
        this.x = x;
        this.y = y;
    }

    public toString(): string {
        return this.x + "_" + this.y;
    }

    public Equals(p: Vector2): boolean {
        return this.x == p.x && this.y == p.y;
    }

    public Move(x: number,y: number): Vector2 {
        return new Vector2(this.x + x,this.y + y);
    }

    public Multi(val: number): Vector2 {
        return new Vector2(this.x * val,this.y * val);
    }

    public Distance(p: Vector2): number {
        var dx: number = (p.x - this.x);
        var dy: number = (p.y - this.y);
        return Math.sqrt(((dx * dx) + (dy * dy)));
    }

    public static New(x: number,y: number): Vector2 {
        return new Vector2(x,y);
    }

}

window["Vector2"] = Vector2;