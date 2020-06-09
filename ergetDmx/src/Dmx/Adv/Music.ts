class Music {
    private id: string;
    private sound: egret.Sound;
    private channel: egret.SoundChannel;
    private loopTimes: number;
    private loaded: boolean;
    private stoped: boolean;

    public constructor(id: string, loopTimes: number = 1) {
        this.loopTimes = loopTimes;
        try {
            this.Load(id);
        } catch (ex) {
            Js.Trace(ex);
        }
    }

    private Load(id: string): void {
        this.id = id;
        try {
            var path: string = Config.icoPath + "music/" + id + ".mp3";
            this.sound = new egret.Sound();
            this.sound.once(egret.Event.COMPLETE, this.LoadComplete, this);
            this.sound.once(egret.IOErrorEvent.IO_ERROR, this.LoadError, this);
            this.sound.load(path);
        } catch (ex) {
            Js.Trace(ex);
        }
    }

    private LoadComplete() {
        this.loaded = true;
        if (!this.stoped) {
            this.Play();
        }
    }

    public Play() {
        this.stoped = false;
        if (this.loaded) {
            this.channel = this.sound.play(0, this.loopTimes);
            this.channel.once(egret.Event.SOUND_COMPLETE, this.PlayEnd, this);
        }
    }

    public Stop() {
        this.stoped = true;
        if (this.channel) {
            this.channel.stop();
        }
    }

    private LoadError() {
        Js.Trace("Sound Error: " + this.id);
    }

    private PlayEnd() {
        //this.Dispose();
    }

    public static mList: Listx = new Listx();
    public static Play(id: string): void {
        try {
            if (!Music.musicOn) {
                return;
            }
            if (Music.mList.Exists(id)) {
                Music.mList[id].Play();
            } else {
                let m = new Music(id);
                Music.mList[id] = m;
            }
        } catch (ex) {
            Js.Trace(ex);
        }
    }


    public static Load(id: string): void {
        try {
            if (!Music.musicOn) {
                return;
            }
            if (!Music.mList.Exists(id)) {
                let m = new Music(id);
                Music.mList[id] = m;
                m.stoped = true;
            }
        } catch (ex) {
            Js.Trace(ex);
        }
    }

    public static _bg: Music;
    public static preBgId: string;
    public static bgId: string;
    public static Bg(id: string): Music {
        try {
            Js.Trace("setBgMusic: " + id);
            if (Music.bgId == id) {
                return;
            }
            Music.preBgId = Music.bgId;
            Music.bgId = id;
            if (Music._bg) {
                Music._bg.Stop();
            }
            if (!Music.musicBgOn) {
                return;
            }
            if (id.IsFull()) {
                if (Music.mList.Exists(id)) {
                    Music.mList[id].Play();
                } else {
                    let m = new Music(id, -1);
                    Music.mList[id] = m;
                    Music._bg = m;
                }
                Music._bg = Music.mList[id];
            }
        } catch (ex) {
            Js.Trace(ex);
        }
        return Music._bg;
    }

    public static BgStop(): void {
        if (Music._bg) {
            Music._bg.Stop();
        }
    }

    // public static PreBg(): void {
    //     Music.Bg(Music.preBgId);
    // }

    public static _musicBgOn: boolean;
    public static get musicBgOn(): boolean {
        Music._musicBgOn = Server.GetIO("musicBgOff").IsFull() ? false : true;
        return Music._musicBgOn;
    };
    public static set musicBgOn(val: boolean) {
        if (Music._musicBgOn != val) {
            Music._musicBgOn = val;
            if (val) {
                Server.SetIO("musicBgOff", "");
            } else {
                Server.SetIO("musicBgOff", "1");
            }
            if (val) {
                let bgId = Music.bgId;
                Music.bgId = "";
                Music.Bg(bgId);
            } else {
                Music.BgStop();
            }
        }
    };

    public static _musicOn: boolean;
    public static get musicOn(): boolean {
        Music._musicOn = Server.GetIO("musicOff").IsFull() ? false : true;
        return Music._musicOn;
    };
    public static set musicOn(val: boolean) {
        if (Music._musicOn != val) {
            Music._musicOn = val;
            if (val) {
                Server.SetIO("musicOff", "");
            } else {
                Server.SetIO("musicOff", "1");
            }
        }
    };

    public disposed: boolean = false;
    public Dispose() {
        var that = this;
        if (!this.disposed) {
            this.disposed = true;
            if (this.channel) {
                this.channel.stop();
                this.channel.removeEventListener(egret.Event.SOUND_COMPLETE, this.PlayEnd, this);
                this.channel = null;
            }
            if (this.sound) {
                this.sound.removeEventListener(egret.Event.COMPLETE, this.LoadComplete, this);
                this.sound.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.LoadError, this);
                this.sound.close();
                this.sound = null;
            }
        }
    }
}


window["Music"] = Music;