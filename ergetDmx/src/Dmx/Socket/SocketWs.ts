class SocketWs extends egret.EventDispatcher implements ISocket {
    public static net: any;
    private sender: Function;
    public socket: any; //egret.WebSocket
    private ip: string;
    private port: number;

    public constructor(sender: Function, ip: string, port: number) {
        super();
        this.sender = sender;
        this.ip = ip;
        this.port = port;

        this.socket = new egret.WebSocket();
        //this.socket.type = egret.WebSocket.TYPE_BINARY;
        this.socket.addEventListener(egret.Event.CONNECT, this.ConnectHandler, this);
        this.socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.DataHandler, this);
        this.socket.addEventListener(egret.Event.CLOSE, this.CloseHandler, this);
    }

    public Connect(): void {
        if (Config.wss == 1) {
            this.socket.connectByUrl("wss://" + this.ip + ":" + this.port);
        } else {
            this.socket.connect(this.ip, this.port);
        }
    }

    public Send(text: string, errFunc: Function = null): void {
        if (this.socket.connected) {
            this.socket.writeUTF(text);
            this.socket.flush();
        }
    }

    public SendGBK(text: string): void {
        //        if(this.socket.connected) {
        //            this.socket.writeMultiByte(text,"GBK");
        //            this.socket.flush();
        //        }
    }

    public Close(): void {
        this.socket.close();
    }

    private ConnectHandler(ev: egret.Event): void {
        var event: egret.Event = new egret.Event(egret.Event.CONNECT);
        this.dispatchEvent(event);
    }

    private DataHandler(ev: egret.ProgressEvent): void {
        try {
            if (SocketWs.net && SocketWs.net.socket && ev.target == SocketWs.net.socket.socket) {//TODO:暂时这样进行判断，防止接收到上一个socket信息
                if (this.socket.connected) {
                    var text = this.socket.readUTF();
                    if (text.length > 0) {
                        if (text.indexOf("$") == -1) {
                            var buffer = Strx.Decompress(new Uint8Array(egret.Base64Util.decode(text)));
                            text = UTF8.decode(buffer);
                        }
                        this.sender(text);
                    }
                }
            }
        } catch (ex) {
            Js.Trace(ex);
        }
    }

    private CloseHandler(ev: egret.Event): void {
        var event: egret.Event = new egret.Event(egret.Event.CLOSE);
        this.dispatchEvent(event);
    }

    public get isConnected(): boolean {
        return this.socket.connected;
    }
}


window["SocketWs"] = SocketWs;