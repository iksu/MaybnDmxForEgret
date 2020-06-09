class Game extends Games { 
    public constructor() {
        super();
    }

    public Start(flexStage: egret.Stage) {
        egret.ImageLoader.crossOrigin = "anonymous";
        Parms.phone = egret.Capabilities.isMobile;
        super.Start(flexStage);
        return this;
    }

    public Loading(): void {
        //TODO:bg load
    }

    public Loaded(): void {
        NForm.LazyCall(() => {
            //这里载入游戏舞台
            NForm.main.Add(new sanguoling());
        });
    }

    public static checkSx: Sx = new Sx();
}