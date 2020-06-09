interface ISocket {
    Connect();
    Send(text: string, errFunc?: Function);
    SendGBK(text: string);
    Close();
    addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number);
    isConnected: boolean;
    socket: any;
}
