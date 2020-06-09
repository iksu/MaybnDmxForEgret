///<reference path="Dictionary.ts" />
class Js extends egret.HashObject {
    public static showTrace: boolean;
    public static TraceCmd: Function;
    public static TraceCmdDmx: Function;
    public static Call(str: string): any {
        try {
            return eval(str);
        }
        catch (ex)
        { }
        return null;
    }

    public static FullScreen() {
        Js.Call("window.RequestFullScreen();");
    }

    public static Trace(str: any) {
        if (Js.TraceCmd) {
            Js.TraceCmd(str);
        }
        if (Js.showTrace) {
            if (typeof (str) == "string" && str.indexOf("rror") > 0)
                console.log('%c ' + str + ' ', 'color: #e40e0e');
            console.log(str);
            //str = "!function(){" + "var div = document.createElement('div');" + "div.style.color = '#ff0000';" + "div.innerHTML = '" + str.toString().replace(/'/g, "\'").replace(/</g, "&lt;") + "';" + "document.body.appendChild(div);" + "}();";
            //Js.Call(str);
        }
    }

    public static TraceObj(obj: any) {
        for (var fi in obj) {
            Js.Trace(fi + ":" + obj[fi]);
        }
    }

    public static TraceDmx(str: any) {
        if (Js.showTrace) {
            if (Js.TraceCmdDmx) {
                Js.TraceCmdDmx(str);
            }
        }
    }

    private static GetParm(url: string, method: string): string {
        try {
            var urls: Array<any> = url.split("?");
            if (urls.length > 1) {
                var parm: string = urls[1];
                var parms: Array<any> = parm.split("&");
                for (var i: number = 0, len: number = parms.length; i < len; i++) {
                    if (parms[i].split("=")[0] == method) {
                        return parms[i].split("=")[1];
                    }
                }
            }
        }
        catch (ex)
        { }
        return "";
    }

    public static GetUrlParm(method: string): string {
        try {
            var parm: string = Js.Call("GetParm('" + method + "')");
            if (Strx.IsFull(parm)) {
                return parm;
            }
        }
        catch (ex)
        { }
        try {
            var url: string = window.location.toString();
            return Js.GetParm(url, method);
        }
        catch (ex)
        { }
        return "";
    }

    public static OpenWindow(url: string, target: string = "_blank", features: string = "") {
        try {
            var browserName: string = Js.GetBrowserName();
            Js.Trace(browserName);
            window.open(url, target, features);
        }
        catch (ex)
        { }
    }

    private static GetBrowserName(): string {
        var browser: string;
        try {
            var browserAgent: string = navigator.userAgent;
            Js.Trace(browserAgent);
            if (browserAgent && browserAgent.indexOf("Firefox") >= 0) {
                browser = "Firefox";
            }
            else if (browserAgent && browserAgent.indexOf("Chrome") >= 0) {
                browser = "Chrome";
            }
            else if (browserAgent && browserAgent.indexOf("Safari") >= 0) {
                browser = "Safari";
            }
            else if (browserAgent && browserAgent.indexOf("MSIE") >= 0) {
                browser = "IE";
            }
            else if (browserAgent && browserAgent.indexOf("Opera") >= 0) {
                browser = "Opera";
            }
            else {
                browser = "Undefined";
            }
        }
        catch (ex)
        { }
        return browser;
    }

    private static _supportWebGL: number = 0;
    public static get SupportWebGL(): boolean {
        if (Js._supportWebGL <= 0) {
            try {
                var c: any = document.getElementById("supportWebGLCanvas");
                if (!c) {
                    c = document.createElement("canvas");
                    c.style.display = " none";
                    c.id = "supportWebGLCanvas";
                }
                var g = c.getContext("webgl");
                if (g) {
                    Js._supportWebGL = 1;
                    return true;
                } else {
                    Js._supportWebGL = 2;
                    return false;
                }
            } catch (ex) {
                Js.Trace(ex);
            }
            Js._supportWebGL = 1;
            return true;
        }
        if (Js._supportWebGL == 1) {
            return true;
        }
        return false;
    }
}

window["Js"] = Js;
