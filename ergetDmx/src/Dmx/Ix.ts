interface Ix {
    OnDispose(func: Function);
    Dispose();
    Show();
    Hide();
    RemoveMe();
    Pos(x: number,y: number): Ix;
    width: number;
    height: number;
    x: number;
    y: number;
    position: Vector2;
    //Top: Ix;
    visible: boolean;
    topVisible: boolean;
    disposed: boolean;
    //scrollRect: egret.Rectangle;
    OnPos(func: Function);
}