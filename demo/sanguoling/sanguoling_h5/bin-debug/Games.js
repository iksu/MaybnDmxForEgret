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
var Games = (function (_super) {
    __extends(Games, _super);
    function Games() {
        var _this = _super.call(this) || this;
        _this.noLogin = false;
        return _this;
    }
    Games.prototype.Start = function (stage) {
        var _this = this;
        console.log("Begin Load Stage");
        //载入游戏层次
        var main = new Sx();
        this.Add(main);
        NForm.main = main;
        var middle = new Sx();
        this.Add(middle);
        NForm.middle = middle;
        var middle1 = new Sx();
        this.Add(middle1);
        NForm.middle1 = middle1;
        var top = new Sx();
        this.Add(top);
        NForm.top = top;
        var overTop = new Sx();
        this.Add(overTop);
        NForm.overTop = overTop;
        //载入线程
        NForm.Load(stage);
        stage.addEventListener(egret.Event.ENTER_FRAME, NForm.EnterFrame, null); //newCode
        this.Show();
        var loading = new NLabel("载入中，请稍后...", 0xffffff, false, 20);
        loading.align = 1;
        loading.x = NForm.width / 2;
        loading.y = NForm.height / 2 - loading.height / 2;
        overTop.Add(loading);
        Strx.Setup();
        console.log("Begin Load Config");
        //载入配置
        Src.ReadXml("Config.xml", function (xml) {
            console.log("Begin Read Config");
            Config.LoadConfig(xml, function () {
                var resPath = "resource/default.res.json";
                //载入白鹭的资源文件
                RES.loadConfig(resPath, "resource/").then(function () {
                    RES.loadGroup("preload", 0, null).then(function () {
                        //解析资源文件
                        Assert.Load(null, (function () {
                            _this.LoadData();
                            if (loading) {
                                loading.RemoveMe();
                            }
                        }));
                    });
                });
            });
        });
    };
    Games.prototype.LoadData = function () {
        var _this = this;
        //载入策划配置
        //这个项目中没有策划配置
        Src.Load((function () {
            if (!_this.noLogin) {
            }
            _this.Loaded();
        }).bind(this));
    };
    Games.prototype.Loading = function () {
    };
    Games.prototype.Loaded = function () {
    };
    return Games;
}(Sx));
__reflect(Games.prototype, "Games");
//# sourceMappingURL=Games.js.map