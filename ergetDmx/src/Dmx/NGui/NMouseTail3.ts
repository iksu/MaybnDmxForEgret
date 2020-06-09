class NMouseTail3 extends Sx {
    public frameRage = 25;
    public maxLen = 16;
    public lenPerFrame = 2;
    public scaleOffset = 1;


    public tails = [];

    public constructor() {
        super();
        this.Hide();
        this.y = NForm.stageHeightOffset / 2;

        for (var i = 0; i < this.maxLen - 1; i++) {
            let img = Assert.Img("tail");
            this.tails.push(img);
            this.Add(img, -100, -100);
        }

        NForm.Move((ev) => {
            this.pos = { x: ev.stageX, y: ev.stageY };
        }, this);

        NForm.Up((ev) => {
            this.Hide();
            this.tails.forEach((fi) => {
                fi.Pos(-100, -100);
            });
        }, this);

        NForm.Down((ev) => {
            NForm.LazyCall(() => {
                if (this.parent.visible) {
                    this.poss.length = 0;
                    this.pos = { x: ev.stageX, y: ev.stageY };
                    this.prePos = this.pos;
                    this.Show();
                }
            });
        }, this);

        NForm.SetInterval(this.frameRage, () => {
            if (this.visible) {
                try {
                    let c = this.lenPerFrame;
                    for (let i = 0; i < c; i++) {
                        let p = { x: (this.pos.x - this.prePos.x) * i / c + this.prePos.x, y: (this.pos.y - this.prePos.y) * i / c + this.prePos.y };
                        this.poss.push(p);
                    }
                    this.prePos = this.pos;
                    if (this.poss.length > this.maxLen) {
                        this.poss.splice(0, this.lenPerFrame);
                    }
                } catch (ex) {
                    Js.Trace(ex);
                }
                try {
                    if (this.poss.length > 2) {
                        let p = this.poss[this.poss.length - 1];
                        let prep = p;
                        let scale = 10;
                        let allc = this.poss.length - 2;
                        let sc = allc * 3 / 4;
                        for (let i = this.poss.length - 2; i >= 0; i--) {
                            p = this.poss[i];
                            if (i >= sc) {
                                scale += this.scaleOffset;
                            } else {
                                scale -= this.scaleOffset - 0.15;
                            }
                            let img = this.tails[i];
                            let height = Math.pow((p.x - prep.x) * (p.x - prep.x) + (p.y - prep.y) * (p.y - prep.y), 0.5);
                            img.height = height + 3;
                            img.scaleX = scale / 15;

                            img.Pos(p.x, p.y);
                            if (prep.x != p.x || prep.y != p.y) {
                                let angle = this.GetAngle(prep.x, prep.y, p.x, p.y);
                                img.rotation = angle;
                            } else {
                                img.rotation = 0;
                            }

                            prep = p;
                        }
                    }
                } catch (ex) {
                    Js.Trace(ex);
                }
            }
            return this.disposed;
        });
        this.mouseEnabled = false;
        this.mouseChildren = false;
    }

    public poss = [];
    public prePos = null;
    public pos = { x: 0, y: 0 };

    public GetAngle(px, py, mx, my): number {//获得人物中心和鼠标坐标连线，与y轴正半轴之间的夹角
        var x = Math.abs(px - mx);
        var y = Math.abs(py - my);
        var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        var cos = y / z;
        var radina = Math.acos(cos);//用反三角函数求弧度
        var angle = Math.floor(180 / (Math.PI / radina));//将弧度转换成角度

        if (mx > px && my > py) {//鼠标在第四象限
            angle = 180 - angle;
        }

        if (mx == px && my > py) {//鼠标在y轴负方向上
            angle = 180;
        }

        if (mx > px && my == py) {//鼠标在x轴正方向上
            angle = 90;
        }

        if (mx < px && my > py) {//鼠标在第三象限
            angle = 180 + angle;
        }

        if (mx < px && my == py) {//鼠标在x轴负方向
            angle = 270;
        }

        if (mx < px && my < py) {//鼠标在第二象限
            angle = 360 - angle;
        }

        return angle;
    }
}

window["NMouseTail3"] = NMouseTail3;