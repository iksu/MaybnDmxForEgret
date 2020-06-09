class IOx {
    public static ReadURL(path: string, urlLoaded: Function, urlError: Function = null, data: string = "", method: string = egret.HttpMethod.POST) {
        var req = new egret.HttpRequest();
        req.responseType = egret.HttpResponseType.TEXT;
        req.open(path, method);
        req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        req.send(data);
        if (data.length > 50) {
            Js.Trace(path + "?");
        } else {
            Js.Trace(path + "?" + data);
        }
        req.once(egret.Event.COMPLETE, (ev) => {
            switch (ev.type) {
                case egret.Event.COMPLETE:
                    var text = ev.currentTarget.response;
                    Js.Trace(text);
                    urlLoaded(text);
                    break;
                case egret.IOErrorEvent.IO_ERROR:
                    Js.Trace("null");
                    urlLoaded(null);
                    break;
            }
        }, null);
        req.once(egret.IOErrorEvent.IO_ERROR, (ev) => {
            urlLoaded(null);
            if (urlError) {
                urlError(ev);
            }
        }, null);
    }

    public static ReadURLContent(path: string, urlLoaded: Function, urlError: Function = null, data: string = "") {
        var req = new egret.HttpRequest();
        req.responseType = egret.HttpResponseType.ARRAY_BUFFER;
        req.open(path, egret.HttpMethod.POST);
        req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        req.send(data);
        req.once(egret.Event.COMPLETE, (ev) => {
            urlLoaded(req.response);
        }, null);
        if (urlError) {
            req.once(egret.IOErrorEvent.IO_ERROR, urlError, null);
        }
    }

    // public static ReadURL1(path: string,urlLoaded: Function,urlError: Function = null,data: string = "") {
    //     var loader = new egret.URLLoader();
    //     var req: egret.URLRequest = new egret.URLRequest(path);
    //     req.url = path;
    //     req.method = egret.URLRequestMethod.POST;
    //     req.data = new egret.URLVariables(data);
    //     loader.addEventListener(egret.Event.COMPLETE,(ev) => {
    //         urlLoaded(loader.data);
    //     },null);
    //     loader.addEventListener(egret.IOErrorEvent.IO_ERROR,urlError,null);
    //     loader.load(req);
    // }
}

window["IOx"] = IOx;