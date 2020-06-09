class Games extends Sx {
    public loadSxFunc: Function;
    public noLogin: boolean = false;

    public constructor() {
        super();
    }

    public Start(stage: egret.Stage): void {
        console.log("Begin Load Stage");

        //载入游戏层次
        let main = new Sx();
        this.Add(main);
        NForm.main = main;

        let middle = new Sx();
        this.Add(middle);
        NForm.middle = middle;

        let middle1 = new Sx();
        this.Add(middle1);
        NForm.middle1 = middle1;

        let top = new Sx();
        this.Add(top);
        NForm.top = top;

        let overTop = new Sx();
        this.Add(overTop);
        NForm.overTop = overTop;

        //载入线程
        NForm.Load(stage);
        stage.addEventListener(egret.Event.ENTER_FRAME, NForm.EnterFrame, null);//newCode

        this.Show();

        let loading = new NLabel("载入中，请稍后...", 0xffffff, false, 20);
        loading.align = 1;
        loading.x = NForm.width / 2;
        loading.y = NForm.height / 2 - loading.height / 2;
        overTop.Add(loading);

        Strx.Setup();
        console.log("Begin Load Config");

        //载入配置
        Src.ReadXml("Config.xml", (xml) => {
            console.log("Begin Read Config");
            Config.LoadConfig(xml, () => {
                let resPath = "resource/default.res.json";
                //载入白鹭的资源文件
                RES.loadConfig(resPath, "resource/").then(() => {
                    RES.loadGroup("preload", 0, null).then(() => {
                        //解析资源文件
                        Assert.Load(null, (() => {
                            this.LoadData();
                            if (loading) {
                                loading.RemoveMe();
                            }
                        }));
                    });
                });
            });
        });
    }

    private LoadData(): void {
        //载入策划配置
        //这个项目中没有策划配置
        Src.Load((() => {
            if (!this.noLogin) {
            }
            this.Loaded();
        }).bind(this));
    }

    public Loading(): void {
    }

    public Loaded(): void {
    }
}