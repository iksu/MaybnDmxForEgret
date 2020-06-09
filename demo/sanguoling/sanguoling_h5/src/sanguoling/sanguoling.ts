//////////////////////////////////////////////////////////////////////////////////////
//
//  该游戏为MaybnDmxForEgret引擎的一个例子。
//  该例子游戏，版权由美彬网络科技有限公司所有。
//  该例子游戏，可用于学习，非授权不能发布使用。
//  具体开发的时候可以保留该例子的文件，删掉sanguoling.ts后进行开发
//
//////////////////////////////////////////////////////////////////////////////////////

//这个类只是能让快速创建一个按钮用
class Nr extends Sx {
    public constructor() {
        super();

        this.autoDispose = false;
    }

    public createButton(img: string, func: Function, p: Sx = null, x: number = 0, y: number = 0): Sx {
        let b = new NSButton(img);
        if (p) {
            p.Add(b, x, y);
        }
        if (func) {
            b.Click(() => {
                func();
            });
        }
        return b;
    }
}


//游戏入口
class sanguoling extends Nr {
    public main: gameMain;
    public menu: gameMenu;
    public over: gameOver;

    public constructor() {
        super();

        let bg = Assert.Img("gamebg_jpg");
        NForm.Full(bg);
        this.Add(bg);

        this.main = new gameMain(this);
        this.Add(this.main);

        this.menu = new gameMenu(this);
        this.Add(this.menu);

        this.over = new gameOver(this);
        this.Add(this.over);

        this.gomenu();
    }

    public go() {
        this.main.go();
        this.menu.Hide();
        this.over.Hide();
    }

    public gomenu() {
        this.main.auto();
        this.menu.Show();
        this.over.Hide();
    }

    public goend(score: number) {
        this.main.auto();
        this.menu.Hide();
        this.over.Show();
    }
}


//开始菜单
class gameMenu extends Nr {
    public game: sanguoling;

    public constructor(game: sanguoling) {
        super();

        this.game = game;

        let b = this.createButton("begingame", () => {
            game.go();
        });
        let ani = new NAniSx(b, { scaleX: 1, scaleY: 1 }, { scaleX: 0.95, scaleY: 0.95 }, 12, true, null, false);
        this.Add(ani, NForm.width / 2, NForm.height / 2);

        b.anchorOffsetX = b.width / 2;
        b.anchorOffsetY = b.height / 2;
    }
}

//往下掉的元素
class gameOne extends Sx {
    public main: gameMain;
    public type: number;//0正常 1双倍 2弓箭 33倍 44倍
    public score: number;
    public speed: number;
    public role: Sx;
    public egg: Sx;

    public onex: number = 0;
    public oney: number = 0;

    public canPick: boolean = false;

    public constructor(main: gameMain, type: number, speedAdd: number) {
        super();

        this.main = main;
        this.type = type;
        if (type == 0) {
            this.score = 1;
            this.speed = 2;
        } else if (type == 1) {
            this.score = 2;
            this.speed = 3;
        } else if (type == 2) {
            this.score = -8;
            this.speed = 2;
        } else if (type == 3) {
            this.score = 3;
            this.speed = 4;
        } else if (type == 4) {
            this.score = 4;
            this.speed = 5;
        }
        this.speed = this.speed + speedAdd;

        this.onex = Strx.Rnd(NForm.width - 200) + 100;
        this.Pos(this.onex, 50);

        this.role = new Sx();
        let ani = new NAniBx("role" + type, false, 10);
        this.role.Add(ani, -550 / 2, -400 / 2);
        this.Add(this.role);
        if (Strx.Rnd(2) == 0) {
            this.role.scaleX = -1;
        }

        NForm.SetTimeout(500, () => {
            this.role.To({ alpha: 0 }, 250, () => {
                this.role.RemoveMe();
            });
        });

        this.egg = new Sx();
        this.egg.Add(Assert.Img("ling" + type), -28, -50);
        this.Add(this.egg);

        //创建下落循环
        NForm.SetInterval(25, () => {
            if (this.picked) {
                return true;
            }
            if (main.end) {
                return true;
            }
            this.oney += this.speed;
            this.egg.y = this.oney;

            if (this.oney >= NForm.height - 125) {
                NForm.SetTimeout(50, () => {
                    this.canPick = false;
                    this.egg.To({ alpha: 0 }, 250, () => {
                        this.main.removeOne(this);
                    });
                });
                return true;
            } else if (this.oney >= NForm.height - 200) {
                if (!this.role.disposed) {
                    this.role.To({ alpha: 0 }, 250, () => {
                        this.role.RemoveMe();
                    });
                }
                this.canPick = true;
            }
            if (this.canPick) {
                if (Math.abs(this.onex - main.basket.onex) <= 50) {
                    this.pick();
                }
            }
        });
    }

    public picked: boolean;
    //被拾取到了
    public pick() {
        this.picked = true;
        this.canPick = false;
        this.egg.To({ alpha: 0 }, 250, () => {
            this.main.removeOne(this);
        });
        this.main.addScore(this.score, this.onex);
    }
}

//底下移动的篮子
class gameBasket extends Sx {
    public main: gameMain;
    public role: Sx;
    public onex: number;

    public constructor(main: gameMain) {
        super();
        this.main = main;

        this.role = new Sx();

        let ani = new NAniBx("me", false, 10);
        this.role.Add(ani, -550 / 2, -400 / 2 - 25);
        this.Add(this.role, NForm.width / 2, NForm.height - 75);
    }

    public move(ev: any) {
        this.onex = ev.stageX;
        if (this.role.x > this.onex) {
            this.role.scaleX = -1;
        } else {
            this.role.scaleX = 1;
        }
        this.role.x = this.onex
        this.role.y = NForm.height - 75;
    }
}

//游戏主场景
class gameMain extends Nr {
    public game: sanguoling;
    public score: NNum;
    public time: NNum;

    public list: Listx;
    public maxTime: number = 61;

    public ones: Arr<gameOne>;
    public p: Sx;
    public basket: gameBasket;

    public end: boolean = true;

    public constructor(game: sanguoling) {
        super();

        this.game = game;
        this.ones = new Arr<gameOne>();

        this.list = new Listx();
        this.list["time"] = 0;
        this.list["score"] = 0;

        this.p = new Sx();
        this.Add(this.p);

        //创建接收的武将
        this.basket = new gameBasket(this);
        this.Add(this.basket);
        game.Move((ev) => {
            this.basket.move(ev);
        });

        //创建得分
        let score = new NNum("0", "v", false, -5);
        this.Add(score, 50, 50);
        this.score = score;
        this.list.Listen(() => {
            score.val = this.list["score"];
        }, "score", score);

        //创建时间信息
        let time = new NNum("0", "w");
        time.align = 2;
        this.Add(time, NForm.width - 50, 50);
        this.time = time;
        this.list.Listen(() => {
            time.val = (this.list["time"].ToInt() / 4).ToInt().toString();
        }, "time", time);

    }

    public auto() {
    }

    //开始游戏
    public go() {
        let noIndex = 0;
        NForm.SetTimeout(50, () => {
            this.reset();
            this.list["score"] = 0;
            this.list["time"] = this.maxTime * 4;
            this.end = false;
            NForm.SetInterval(250, () => {
                let time = this.list["time"];
                time--;
                if (time <= 0) {
                    time = 0;
                }
                if (Strx.Rnd(this.maxTime * 4) > time || noIndex++ > 2) {
                    this.addOne(time);
                    noIndex = 0;
                }
                this.list["time"] = time;
                if (time <= 0) {
                    this.end = true;
                    this.game.goend(this.list["score"]);
                    return true;
                }
            });
        });
    }

    //增加令牌
    public addOne(time: number) {
        let type = 0;
        let speedAdd = 0;
        if (time >= this.maxTime * 3) {
            let rnd = Strx.Rnd(6);
            if (rnd == 0) {
                type = 1;
            } else if (rnd == 1) {
                type = 2;
            } else {
                type = 0;
            }
        } else if (time >= this.maxTime * 2) {
            let rnd = Strx.Rnd(7);
            if (rnd == 0) {
                type = 1;
            } else if (rnd == 1) {
                type = 2;
            } else if (rnd == 2) {
                type = 3;
            } else {
                type = 0;
            }
            speedAdd = 1;
        } else if (time >= this.maxTime) {
            let rnd = Strx.Rnd(8);
            if (rnd == 0) {
                type = 1;
            } else if (rnd == 1 || rnd == 2) {
                type = 2;
            } else if (rnd == 3) {
                type = 3;
            } else {
                type = 0;
            }
            speedAdd = 2;
        } else {
            let rnd = Strx.Rnd(9);
            if (rnd == 0) {
                type = 1;
            } else if (rnd == 1 || rnd == 2) {
                type = 2;
            } else if (rnd == 3) {
                type = 3;
            } else if (rnd == 4) {
                type = 4;
            } else {
                type = 0;
            }
            speedAdd = 3;
        }

        let one = new gameOne(this, type, speedAdd);
        this.p.Add(one);

        this.ones.Add(one);
    }

    //删除令牌
    public removeOne(one: gameOne) {
        one.RemoveMe();
        this.ones.Remove(one);
    }

    //清除场景
    public reset() {
        this.ones.Each((fi) => {
            fi.RemoveMe();
        });
        this.ones.Clear();
    }

    //得分
    public addScore(score: number, x: number) {
        let myScore = this.list["score"] + score;
        if (myScore < 0) {
            myScore = 0;
        }
        this.list["score"] = myScore;

        let scorel = score.toString();
        if (score > 0) {
            scorel = "+" + scorel;
        }
        let l = new NNum(scorel, "w");
        l.align = 1;
        this.Add(l, x, NForm.height - 100);
        l.To({ y: NForm.height - 175 }, 800, () => {
            l.To({ alpha: 0 }, 500, () => {
                l.RemoveMe();
            });
        });
    }
}


//游戏结束场景
class gameOver extends Nr {
    public game: sanguoling;

    public constructor(game: sanguoling) {
        super();

        this.game = game;

        let b = this.createButton("playagain", () => {
            game.go();
        });
        let ani = new NAniSx(b, { scaleX: 1, scaleY: 1 }, { scaleX: 0.95, scaleY: 0.95 }, 12, true, null, false);
        this.Add(ani, NForm.width / 2, NForm.height / 2);

        b.anchorOffsetX = b.width / 2;
        b.anchorOffsetY = b.height / 2;
    }
}