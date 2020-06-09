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
var Game = (function (_super) {
    __extends(Game, _super);
    function Game() {
        return _super.call(this) || this;
    }
    Game.prototype.Start = function (flexStage) {
        egret.ImageLoader.crossOrigin = "anonymous";
        Parms.phone = egret.Capabilities.isMobile;
        _super.prototype.Start.call(this, flexStage);
        return this;
    };
    Game.prototype.Loading = function () {
        //TODO:bg load
    };
    Game.prototype.Loaded = function () {
        NForm.LazyCall(function () {
            //这里载入游戏舞台
            NForm.main.Add(new sanguoling());
        });
    };
    Game.checkSx = new Sx();
    return Game;
}(Games));
__reflect(Game.prototype, "Game");
//# sourceMappingURL=Game.js.map