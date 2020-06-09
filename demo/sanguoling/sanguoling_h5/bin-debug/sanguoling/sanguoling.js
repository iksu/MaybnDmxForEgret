//////////////////////////////////////////////////////////////////////////////////////
//
//  该游戏为MaybnDmxForEgret引擎的一个例子。
//  该例子游戏，版权由美彬网络科技有限公司所有。
//  该例子游戏，可用于学习，非授权不能发布使用。
//  具体开发的时候可以保留该例子的文件，删掉sanguoling.ts后进行开发
//
//////////////////////////////////////////////////////////////////////////////////////
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
//这个类只是能让快速创建一个按钮用
var Nr = (function (_super) {
    __extends(Nr, _super);
    function Nr() {
        var _this = _super.call(this) || this;
        _this.autoDispose = false;
        return _this;
    }
    Nr.prototype.createButton = function (img, func, p, x, y) {
        if (p === void 0) { p = null; }
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        var b = new NSButton(img);
        if (p) {
            p.Add(b, x, y);
        }
        if (func) {
            b.Click(function () {
                func();
            });
        }
        return b;
    };
    return Nr;
}(Sx));
__reflect(Nr.prototype, "Nr");
//游戏入口
var sanguoling = (function (_super) {
    __extends(sanguoling, _super);
    function sanguoling() {
        var _this = _super.call(this) || this;
        var bg = Assert.Img("gamebg_jpg");
        NForm.Full(bg);
        _this.Add(bg);
        _this.main = new gameMain(_this);
        _this.Add(_this.main);
        _this.menu = new gameMenu(_this);
        _this.Add(_this.menu);
        _this.over = new gameOver(_this);
        _this.Add(_this.over);
        _this.gomenu();
        return _this;
    }
    sanguoling.prototype.go = function () {
        this.main.go();
        this.menu.Hide();
        this.over.Hide();
    };
    sanguoling.prototype.gomenu = function () {
        this.main.auto();
        this.menu.Show();
        this.over.Hide();
    };
    sanguoling.prototype.goend = function (score) {
        this.main.auto();
        this.menu.Hide();
        this.over.Show();
    };
    return sanguoling;
}(Nr));
__reflect(sanguoling.prototype, "sanguoling");
//开始菜单
var gameMenu = (function (_super) {
    __extends(gameMenu, _super);
    function gameMenu(game) {
        var _this = _super.call(this) || this;
        _this.game = game;
        var b = _this.createButton("begingame", function () {
            game.go();
        });
        var ani = new NAniSx(b, { scaleX: 1, scaleY: 1 }, { scaleX: 0.95, scaleY: 0.95 }, 12, true, null, false);
        _this.Add(ani, NForm.width / 2, NForm.height / 2);
        b.anchorOffsetX = b.width / 2;
        b.anchorOffsetY = b.height / 2;
        return _this;
    }
    return gameMenu;
}(Nr));
__reflect(gameMenu.prototype, "gameMenu");
//往下掉的元素
var gameOne = (function (_super) {
    __extends(gameOne, _super);
    function gameOne(main, type, speedAdd) {
        var _this = _super.call(this) || this;
        _this.onex = 0;
        _this.oney = 0;
        _this.canPick = false;
        _this.main = main;
        _this.type = type;
        if (type == 0) {
            _this.score = 1;
            _this.speed = 2;
        }
        else if (type == 1) {
            _this.score = 2;
            _this.speed = 3;
        }
        else if (type == 2) {
            _this.score = -8;
            _this.speed = 2;
        }
        else if (type == 3) {
            _this.score = 3;
            _this.speed = 4;
        }
        else if (type == 4) {
            _this.score = 4;
            _this.speed = 5;
        }
        _this.speed = _this.speed + speedAdd;
        _this.onex = Strx.Rnd(NForm.width - 200) + 100;
        _this.Pos(_this.onex, 50);
        _this.role = new Sx();
        var ani = new NAniBx("role" + type, false, 10);
        _this.role.Add(ani, -550 / 2, -400 / 2);
        _this.Add(_this.role);
        if (Strx.Rnd(2) == 0) {
            _this.role.scaleX = -1;
        }
        NForm.SetTimeout(500, function () {
            _this.role.To({ alpha: 0 }, 250, function () {
                _this.role.RemoveMe();
            });
        });
        _this.egg = new Sx();
        _this.egg.Add(Assert.Img("ling" + type), -28, -50);
        _this.Add(_this.egg);
        //创建下落循环
        NForm.SetInterval(25, function () {
            if (_this.picked) {
                return true;
            }
            if (main.end) {
                return true;
            }
            _this.oney += _this.speed;
            _this.egg.y = _this.oney;
            if (_this.oney >= NForm.height - 125) {
                NForm.SetTimeout(50, function () {
                    _this.canPick = false;
                    _this.egg.To({ alpha: 0 }, 250, function () {
                        _this.main.removeOne(_this);
                    });
                });
                return true;
            }
            else if (_this.oney >= NForm.height - 200) {
                if (!_this.role.disposed) {
                    _this.role.To({ alpha: 0 }, 250, function () {
                        _this.role.RemoveMe();
                    });
                }
                _this.canPick = true;
            }
            if (_this.canPick) {
                if (Math.abs(_this.onex - main.basket.onex) <= 50) {
                    _this.pick();
                }
            }
        });
        return _this;
    }
    //被拾取到了
    gameOne.prototype.pick = function () {
        var _this = this;
        this.picked = true;
        this.canPick = false;
        this.egg.To({ alpha: 0 }, 250, function () {
            _this.main.removeOne(_this);
        });
        this.main.addScore(this.score, this.onex);
    };
    return gameOne;
}(Sx));
__reflect(gameOne.prototype, "gameOne");
//底下移动的篮子
var gameBasket = (function (_super) {
    __extends(gameBasket, _super);
    function gameBasket(main) {
        var _this = _super.call(this) || this;
        _this.main = main;
        _this.role = new Sx();
        var ani = new NAniBx("me", false, 10);
        _this.role.Add(ani, -550 / 2, -400 / 2 - 25);
        _this.Add(_this.role, NForm.width / 2, NForm.height - 75);
        return _this;
    }
    gameBasket.prototype.move = function (ev) {
        this.onex = ev.stageX;
        if (this.role.x > this.onex) {
            this.role.scaleX = -1;
        }
        else {
            this.role.scaleX = 1;
        }
        this.role.x = this.onex;
        this.role.y = NForm.height - 75;
    };
    return gameBasket;
}(Sx));
__reflect(gameBasket.prototype, "gameBasket");
//游戏主场景
var gameMain = (function (_super) {
    __extends(gameMain, _super);
    function gameMain(game) {
        var _this = _super.call(this) || this;
        _this.maxTime = 61;
        _this.end = true;
        _this.game = game;
        _this.ones = new Arr();
        _this.list = new Listx();
        _this.list["time"] = 0;
        _this.list["score"] = 0;
        _this.p = new Sx();
        _this.Add(_this.p);
        //创建接收的武将
        _this.basket = new gameBasket(_this);
        _this.Add(_this.basket);
        game.Move(function (ev) {
            _this.basket.move(ev);
        });
        //创建得分
        var score = new NNum("0", "v", false, -5);
        _this.Add(score, 50, 50);
        _this.score = score;
        _this.list.Listen(function () {
            score.val = _this.list["score"];
        }, "score", score);
        //创建时间信息
        var time = new NNum("0", "w");
        time.align = 2;
        _this.Add(time, NForm.width - 50, 50);
        _this.time = time;
        _this.list.Listen(function () {
            time.val = (_this.list["time"].ToInt() / 4).ToInt().toString();
        }, "time", time);
        return _this;
    }
    gameMain.prototype.auto = function () {
    };
    //开始游戏
    gameMain.prototype.go = function () {
        var _this = this;
        var noIndex = 0;
        NForm.SetTimeout(50, function () {
            _this.reset();
            _this.list["score"] = 0;
            _this.list["time"] = _this.maxTime * 4;
            _this.end = false;
            NForm.SetInterval(250, function () {
                var time = _this.list["time"];
                time--;
                if (time <= 0) {
                    time = 0;
                }
                if (Strx.Rnd(_this.maxTime * 4) > time || noIndex++ > 2) {
                    _this.addOne(time);
                    noIndex = 0;
                }
                _this.list["time"] = time;
                if (time <= 0) {
                    _this.end = true;
                    _this.game.goend(_this.list["score"]);
                    return true;
                }
            });
        });
    };
    //增加令牌
    gameMain.prototype.addOne = function (time) {
        var type = 0;
        var speedAdd = 0;
        if (time >= this.maxTime * 3) {
            var rnd = Strx.Rnd(6);
            if (rnd == 0) {
                type = 1;
            }
            else if (rnd == 1) {
                type = 2;
            }
            else {
                type = 0;
            }
        }
        else if (time >= this.maxTime * 2) {
            var rnd = Strx.Rnd(7);
            if (rnd == 0) {
                type = 1;
            }
            else if (rnd == 1) {
                type = 2;
            }
            else if (rnd == 2) {
                type = 3;
            }
            else {
                type = 0;
            }
            speedAdd = 1;
        }
        else if (time >= this.maxTime) {
            var rnd = Strx.Rnd(8);
            if (rnd == 0) {
                type = 1;
            }
            else if (rnd == 1 || rnd == 2) {
                type = 2;
            }
            else if (rnd == 3) {
                type = 3;
            }
            else {
                type = 0;
            }
            speedAdd = 2;
        }
        else {
            var rnd = Strx.Rnd(9);
            if (rnd == 0) {
                type = 1;
            }
            else if (rnd == 1 || rnd == 2) {
                type = 2;
            }
            else if (rnd == 3) {
                type = 3;
            }
            else if (rnd == 4) {
                type = 4;
            }
            else {
                type = 0;
            }
            speedAdd = 3;
        }
        var one = new gameOne(this, type, speedAdd);
        this.p.Add(one);
        this.ones.Add(one);
    };
    //删除令牌
    gameMain.prototype.removeOne = function (one) {
        one.RemoveMe();
        this.ones.Remove(one);
    };
    //清除场景
    gameMain.prototype.reset = function () {
        this.ones.Each(function (fi) {
            fi.RemoveMe();
        });
        this.ones.Clear();
    };
    //得分
    gameMain.prototype.addScore = function (score, x) {
        var myScore = this.list["score"] + score;
        if (myScore < 0) {
            myScore = 0;
        }
        this.list["score"] = myScore;
        var scorel = score.toString();
        if (score > 0) {
            scorel = "+" + scorel;
        }
        var l = new NNum(scorel, "w");
        l.align = 1;
        this.Add(l, x, NForm.height - 100);
        l.To({ y: NForm.height - 175 }, 800, function () {
            l.To({ alpha: 0 }, 500, function () {
                l.RemoveMe();
            });
        });
    };
    return gameMain;
}(Nr));
__reflect(gameMain.prototype, "gameMain");
//游戏结束场景
var gameOver = (function (_super) {
    __extends(gameOver, _super);
    function gameOver(game) {
        var _this = _super.call(this) || this;
        _this.game = game;
        var b = _this.createButton("playagain", function () {
            game.go();
        });
        var ani = new NAniSx(b, { scaleX: 1, scaleY: 1 }, { scaleX: 0.95, scaleY: 0.95 }, 12, true, null, false);
        _this.Add(ani, NForm.width / 2, NForm.height / 2);
        b.anchorOffsetX = b.width / 2;
        b.anchorOffsetY = b.height / 2;
        return _this;
    }
    return gameOver;
}(Nr));
__reflect(gameOver.prototype, "gameOver");
//# sourceMappingURL=sanguoling.js.map