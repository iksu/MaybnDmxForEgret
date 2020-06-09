//服务器类
//可保存、读取临时数据
class Server {
    public static SetFile(path: string, val: string) {
        try {
            egret.localStorage.setItem(path, val);
        } catch (ex) {
            Js.Trace(ex);
        }
    }

    public static GetFile(path: string): string {
        try {
            let rv = egret.localStorage.getItem(path);
            if (rv == null) {
                rv = "";
            }
            return rv;
        } catch (ex) {
            Js.Trace(ex);
        }
        return "";
    }

    public static GetIO(path: string): string {
        return Server.GetFile(path);
    }

    public static SetIO(path: string, val: string): void {
        Server.SetFile(path, val);
    }

    public static CreateClass(c: any): any {
        if (Js.showTrace) {
            let s = new c();
            s.OnDispose(() => {
                c.instance = null;
            });
            return s;
        } else {
            try {
                let s = new c();
                s.OnDispose(() => {
                    c.instance = null;
                });
                return s;
            } catch (ex) { }
            return null;
        }
    }

    public static get Now(): DateTime {
        return Time.Now;
    }
}

window["Server"] = Server;