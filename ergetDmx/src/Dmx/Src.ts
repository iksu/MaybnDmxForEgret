//文件读取类
class Src {
    public static ReadByte(path: string, urlLoaded: Function, errorFunc: Function = null) {
        // let loader: egret.URLLoader = new egret.URLLoader();
        // loader.dataFormat = egret.URLLoaderDataFormat.BINARY;
        // loader.addEventListener(egret.Event.COMPLETE, (ev: any) => {
        //     urlLoaded(ev.target.data);
        // }, this);
        // if (errorFunc ) {
        //     loader.addEventListener(egret.IOErrorEvent.IO_ERROR, errorFunc, this);
        // }
        // loader.load(new egret.URLRequest("resource/" + path));
        let url = path;
        if (!path.StartWith("http")) {
            url = "resource/" + path;
        }

        let request: egret.HttpRequest = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.ARRAY_BUFFER;

        let respHandler = function (evt: egret.Event): void {
            switch (evt.type) {
                case egret.Event.COMPLETE:
                    let request: egret.HttpRequest = evt.currentTarget;
                    let ab: ArrayBuffer = request.response;
                    urlLoaded(ab);
                    break;
                case egret.IOErrorEvent.IO_ERROR:
                    urlLoaded(null);
                    break;
            }
        }

        request.once(egret.Event.COMPLETE, respHandler, null);
        request.once(egret.IOErrorEvent.IO_ERROR, respHandler, null);
        request.open(url, egret.HttpMethod.GET);
        request.send();
    }

    public static dataCacheList: Listx = new Listx();
    public static inreadingDataCacheList: Listx = new Listx();
    // public static readQueue: SingleQueue = new SingleQueue((item) => {
    //     if (Js.showTrace) {
    //         // ("ReadUrl:" + path).WriteLog();
    //     }
    //     let url = "resource/" + item.path;

    //     let imageLoader = new egret.ImageLoader();
    //     imageLoader.once(egret.Event.COMPLETE, onLoadComplete, null);
    //     imageLoader.once(egret.IOErrorEvent.IO_ERROR, onError, null);
    //     imageLoader.load(url);
    //     function onError(event) {
    //         item.urlLoaded(null);
    //         Src.dataCacheList[item.path] = null;
    //         Src.inreadingDataCacheList[item.path].forEach((fi) => {
    //             fi(null);
    //         });
    //         Src.inreadingDataCacheList.Remove(item.path);
    //         ("ReadErrorUrl:" + item.path).WriteLog();
    //     }
    //     function onLoadComplete(evt: egret.Event) {
    //         let data = evt.currentTarget.data;
    //         let texture = new egret.Texture();
    //         texture._setBitmapData(data);

    //         Src.dataCacheList[item.path] = texture;
    //         Src.inreadingDataCacheList[item.path].forEach((fi) => {
    //             fi(texture);
    //         });
    //         Src.inreadingDataCacheList.Remove(item.path);
    //     }
    // }, 800);

    public static Read(path: string, urlLoaded: Function) {
        if (path == null || path.IsEmpty()) {
            urlLoaded(null);
            return;
        }
        if (Src.dataCacheList.Exists(path)) {
            if (Src.dataCacheList[path]) {
                let texture = Src.dataCacheList[path];
                // let texture = new egret.Texture();
                // let data = Src.dataCacheList[path];
                // Js.Trace(Src.dataCacheList[path]);
                // texture._setBitmapData(Src.dataCacheList[path]);
                //Form.LazyCall(() => {
                urlLoaded(texture);
                //});
            } else {
                urlLoaded(null);
            }
            return;
        }
        if (Src.inreadingDataCacheList.Exists(path)) {
            Src.inreadingDataCacheList[path].push(urlLoaded);
            return;
        }
        Src.inreadingDataCacheList[path] = [];
        Src.inreadingDataCacheList[path].push(urlLoaded);
        //Src.readQueue.Push({ path: path, urlLoaded: urlLoaded, willCache: willCache });

        // if (Js.showTrace) {
        //     ("ReadUrl:" + path).WriteLog();
        // }

        let item = { path: path, urlLoaded: urlLoaded };
        let url = item.path;
        if (!item.path.StartWith("http")) {
            url = "resource/" + item.path;
        }

        let imageLoader = new egret.ImageLoader();
        imageLoader.once(egret.Event.COMPLETE, onLoadComplete, null);
        imageLoader.once(egret.IOErrorEvent.IO_ERROR, onError, null);
        imageLoader.load(url);
        function onError(event) {
            item.urlLoaded(null);
            Src.dataCacheList[item.path] = null;
            Src.inreadingDataCacheList[item.path].forEach((fi) => {
                fi(null);
            });
            Src.inreadingDataCacheList.Remove(item.path);
            ("ReadErrorUrl:" + item.path).WriteLog();
        }
        function onLoadComplete(evt: egret.Event) {
            let data = evt.currentTarget.data;
            let texture = new egret.Texture();
            texture._setBitmapData(data);

            let texures = Textures.GetTextures(texture, item.path);

            Src.dataCacheList[item.path] = texures;
            Src.inreadingDataCacheList[item.path].forEach((fi) => {
                fi(texures);
            });
            Src.inreadingDataCacheList.Remove(item.path);
        }
    }

    public static textCacheList: Listx = new Listx();
    public static ReadTxt(path: string, urlLoaded: Function, willCache: boolean = true) {
        if (path == null || path.IsEmpty()) {
            urlLoaded(null);
            return;
        }
        if (willCache && Src.textCacheList.Exists(path)) {
            urlLoaded(Src.textCacheList[path]);
            return;
        }
        if (Src.inreadingDataCacheList.Exists(path)) {
            Src.inreadingDataCacheList[path].push(urlLoaded);
            return;
        }
        Src.inreadingDataCacheList[path] = [];
        Src.inreadingDataCacheList[path].push(urlLoaded);
        // if (Js.showTrace) {
        //     ("ReadUrl:" + path).WriteLog();
        // }

        let url = path;
        if (!path.StartWith("http")) {
            url = "resource/" + path;
        }
        let request: egret.HttpRequest = new egret.HttpRequest();

        let respHandler = function (evt: egret.Event): void {
            switch (evt.type) {
                case egret.Event.COMPLETE:
                    let request: egret.HttpRequest = evt.currentTarget;
                    Src.textCacheList[path] = request.response;
                    Src.inreadingDataCacheList[path].forEach((fi) => {
                        fi(request.response);
                    });
                    Src.inreadingDataCacheList.Remove(path);
                    break;
                case egret.IOErrorEvent.IO_ERROR:
                    Src.inreadingDataCacheList[path].forEach((fi) => {
                        fi("");
                    });
                    Src.inreadingDataCacheList.Remove(path);
                    ("ReadErrorUrl:" + path).WriteLog();
                    break;
            }
        }

        // let progressHandler = function( evt:egret.ProgressEvent ):void{
        //     console.log( "progress:", evt.bytesLoaded, evt.bytesTotal );
        // }
        request.once(egret.Event.COMPLETE, respHandler, null);
        request.once(egret.IOErrorEvent.IO_ERROR, respHandler, null);
        //request.once(egret.ProgressEvent.PROGRESS, progressHandler, null);
        request.open(url, egret.HttpMethod.GET);
        request.send();
    }

    public static ReadXml(path: string, urlLoaded: Function, willCache: boolean = true) {
        Src.ReadTxt(path, (res: string) => {
            console.log(res);
            if (res.IsEmpty()) {
                urlLoaded(null);
            } else {
                urlLoaded(new Xml(res));
            }
        }, willCache);
    }

    public static modelFlexList: Listx;

    public static Load(func: Function) {
        //if (Js.showTrace) {//这里最好能Config配置
        let data = RES.getRes("ModelFlexAttribute_txt");//增加载入速度
        if (data) {
            let buffer = Strx.Decompress(new Uint8Array(data));
            let text = UTF8.decode(buffer);
            Src.modelFlexList = Listx.Arr(text);

            Src.modelFlexList.EachKey((fi) => {
                Js.Trace(fi + ":" + Src.modelFlexList[fi].length);
            });
        }
        func();
        // } else {
        //     Src.ReadByte("Res/data/ModelFlexAttribute.txt", ((data: ArrayBuffer) => {//外网可能会需要热更
        //         let buffer = Strx.Decompress(new Uint8Array(data));
        //         let text = UTF8.decode(buffer);
        //         Src.modelFlexList = Listx.Arr(text);

        //         Src.modelFlexList.EachKey((fi) => {
        //             Js.Trace(fi + ":" + Src.modelFlexList[fi].length);
        //         });
        //         func();
        //     }));
        // }
    }
}

window["Src"] = Src;