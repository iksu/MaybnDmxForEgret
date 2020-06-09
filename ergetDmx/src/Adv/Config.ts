class Config {
    public static qq: string;
    public static qqq: string;
    public static allShopGoods: string;
    public static urls: Array<string>;
    public static gameUrl: string;
    public static payUrl: string;
    public static shareUrl: string;
    public static src: string;
    public static showTrace: string;
    public static version: number;
    public static icoPath: string;
    public static srcPath: string;
    //public static business: string;
    public static game: string;
    public static isLW: boolean = false;
    public static cardMode: boolean = false;
    public static app: string;
    public static shareApp: string;
    public static serverIp: string;
    public static port: number;
    public static serverIpTls13: string;
    public static portTls13: number;
    public static portHttp: number;
    public static serverName: string;
    public static serverBegin: number;
    public static serverFrom: number;
    public static test: string;
    public static ps: boolean;
    public static closeChat: boolean;
    public static serverId: string;
    public static newServerMode: boolean;
    public static wss: number;
    public static gonggao: string;
    public static isBattleCard: boolean;//战场卡牌
    public static isStyleCard: boolean;//新卡牌样式
    public static mainCenter: number;//主界面
    public static btServer: boolean;//bt服务器
    public static gameType: number;
    public static ads: string;
    public static openAds: boolean;//是否开启广告 审核的时候需要关闭
    public static banner: string;
    public static banner2: string;
    public static bannery: number;
    public static outAds: boolean = false;//外部广告（跳转到其他小程序）
    public static alert: string = "";//进入游戏的公告
    public static alertOld: string = "";//进入游戏的公告

    public static appMode: boolean = false;//是不是app模式
    public static inExam: boolean = false;
    public static autoCreateRole: boolean = false;
    public static bbs: string = "";

    public static share: string;

    public static get shareIco(): string {
        return Config.shareIcos[Strx.Rnd(Config.shareIcos.length)];
    }
    public static shareIcos: Array<string>;

    public static tujian: string;

    public static businessType: string;

    public static newServerId: string;


    public static dic: Listx;
    public static LoadConfig(xml: Xml, func: Function): void {
        console.log("Begin Load Config");

        //Config.dic = new Listx();
        let nodes = xml.nodes;
        Config.dic = nodes[0];

        let redirect: string = Config.dic["redirect"];
        if (redirect) {
            Src.ReadXml(redirect, (xml1) => {
                if (xml1 == null) {
                    NForm.SetTimeout(800, () => {
                        Config.LoadConfig(xml, func);
                    });
                } else {
                    Config.LoadConfig(xml1, func);
                }
            });
            return;
        }

        Config.showTrace = Config.dic["showTrace"];
        Js.showTrace = (Config.showTrace == "1");
        Config.test = Config.dic["test"];
        Config.qq = Config.dic["qq"];
        Config.qqq = Config.dic["qqq"];//QQ群
        Config.allShopGoods = Config.dic["allShopGoods"];

        if (Config.dic["url"]) {
            Config.urls = Config.dic["url"].split(",");
            Config.urls = Config.urls.sort((a, b) => {
                return Strx.Rnd(10);
            });
        }

        Config.gameUrl = Config.dic["gameUrl"];
        Config.payUrl = Config.dic["payUrl"];
        Config.shareUrl = Config.dic["shareUrl"];
        Config.src = Config.dic["src"];
        Config.version = Config.dic["version"];
        Config.icoPath = Config.dic["icoPath"];
        Config.srcPath = Config.dic["srcPath"];

        Config.game = Config.dic["game"];
        Config.isLW = Config.game == "Longwen";
        Config.cardMode = Config.dic["cardMode"] == "1";        

        Config.app = Config.dic["app"];
        Config.shareApp = Config.dic["shareApp"];
        Config.serverIp = Config.dic["serverIp"];
        Config.port = Config.dic["port"];
        Config.portHttp = Config.dic["portHttp"];
        Config.serverName = Config.dic["serverName"];
        Config.serverBegin = Config.dic["serverBegin"];
        Config.serverFrom = Config.dic["serverFrom"];
        Config.ps = Config.dic["ps"] == "1";
        Config.closeChat = Config.dic["closeChat"] == "1";
        Config.serverId = Config.dic["serverId"];
        Config.newServerMode = Config.dic["newServerMode"] == "1";
        Config.wss = Config.dic["wss"];
        Config.gonggao = Config.dic["gonggao"];
        Config.isBattleCard = Config.dic["isBattleCard"] == "1";
        Config.isStyleCard = Config.dic["isStyleCard"] == "1";
        Config.btServer = Config.dic["btServer"] == "1";

        if (Config.dic["mainCenter"]) {
            Config.mainCenter = Config.dic["mainCenter"].ToInt();
        }

        if (Config.dic["gameType"]) {
            Config.gameType = Config.dic["gameType"].ToInt();
        }
        Config.ads = Config.dic["ads"];

        Config.banner = Config.dic["banner"];
        Config.banner2 = Config.dic["banner2"];
        if (Config.dic["bannery"]) {
            Config.bannery = Config.dic["bannery"].ToInt();
        }

        Config.outAds = Config.dic["outAds"] == "1";
        Config.openAds = Config.dic["openAds"] == "1";
        Config.appMode = Config.dic["appMode"] == "1";
        Config.inExam = Config.dic["inExam"] == "1";
        Config.autoCreateRole = Config.dic["autoCreateRole"] == "1";
        if (Config.dic["bbs"]) {
            Config.bbs = Config.dic["bbs"];
        }

        if (Config.dic["alert"]) {
            Config.alert = Config.dic["alert"];
        }

        if (Config.dic["alertOld"]) {
            Config.alertOld = Config.dic["alertOld"];
        }

        let servers: string = Config.dic["servers"];
        if (servers) {
            let ss = servers.split(',');
            let server = ss[Strx.Rnd(ss.length)];
            let ss1 = server.split(':');
            Config.serverIp = ss1[0];
            Config.port = ss1[1].ToInt();
        }
        let serversTls13: string = Config.dic["serversTls13"];
        if (serversTls13) {
            let ss = serversTls13.split(',');
            let server = ss[Strx.Rnd(ss.length)];
            let ss1 = serversTls13.split(':');
            Config.serverIpTls13 = ss1[0];
            Config.portTls13 = ss1[1].ToInt();
        }

        Config.share = Config.dic["share"];
        if (!Config.share) {
            Config.share = "我正在种菜，缺少辣椒，请求帮助！";
        }
        if (Config.dic["shareIco"]) {
            Config.shareIcos = Config.dic["shareIco"].split(',');
        } else {
            Config.shareIcos = ["share/shares.jpg"];
        }

        Config.tujian = Config.dic["tujian"];

        let business = Config.dic["business"];
        let business1 = Js.GetUrlParm("business");
        if (business1 && business1 != "") {
            business = business1;
        }
        Config.businessType = business;

        console.log("End Load Config");
        func();
    }
}

window["Config"] = Config;