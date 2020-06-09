//一个对象在一个视野里面移动，如：世界地图的拖动
class NMovePanel extends NScrollPanel {
    private movedFunc: Function;
    private moveFunc: Function;

    public constructor(width: number = 1, height: number = 1, moveFunc: Function = null, movedFunc: Function = null, bgType: number = -1, moveWidth: number = -1, moveHeight: number = -1) {
        super(width, height, 0);

        this.tween = false;
        this.bounces = false;

        if (width == NForm.width && height == NForm.height) {
            NForm.Resize(() => {
                this.Resize(width, height);
                this.Adjust();
            }, this);
        }
        this.Resize(width, height);

        this.moveFunc = moveFunc;
        this.movedFunc = movedFunc;
        if (moveFunc) {
            this.scroller.addEventListener(eui.UIEvent.CHANGE, moveFunc, this.scroller);
        }
        if (movedFunc) {
            this.scroller.addEventListener(eui.UIEvent.CHANGE_END, movedFunc, this.scroller);
        }
    }

    public Resize(width: number, height: number) {
        super.Resize(width, height);
        this.SetRect(new Rectangle(0, 0, width, height));
        this.Adjust();
    }

    public Add(item: any, x: number = 0, y: number = 0): boolean {
        if (this.disposed) {
            return;
        }
        super.Add(item, x, y);
        this.Adjust();
        return true;
    }

    public Remove(item: Ix) {
        super.Remove(item);
        this.Adjust();
    }

    public Adjust(): void {
        if (!this.disposed) {
            //this.move.Adjust();
        }
    }

    public MoveTo(x: number, y: number) {
        this.scrollH = x;
        this.scrollV = y;
    }

    public get contentX(): number {
        return this.scroller.viewport.scrollH;
    }

    public get contentY(): number {
        return this.scroller.viewport.scrollV;
    }

    public set scrollH(H: number) {
        this.scroller.viewport.scrollH = H;
    }

    public set scrollV(V: number) {
        this.scroller.viewport.scrollV = V;
    }

    public RemoveAll() {
        // if (this.move) {
        //     this.move.RemoveAll();
        // }
    }

    public get contentWidth(): number {
        // if (this.move) {
        //     this.move.__width = -1;
        //     return this.move.width;
        // }
        return 0;
    }

    public get contentHeight(): number {
        // if (this.move) {
        //     this.move.__height = -1;
        //     return this.move.height;
        // }
        return 0;
    }

    public SetRect(rect: Rectangle = null) {
        // if (this.move) {
        //     this.move.SetRect(rect);
        // }
    }

    public _disableScroll: boolean = false;
    public DisableScroll() {
        this.scroller.scrollPolicyV = eui.ScrollPolicy.OFF;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
        this._disableScroll = true;
    }

    public DisableScrollX() {
        this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
    }
    public DisableScrollY() {
        this.scroller.scrollPolicyV = eui.ScrollPolicy.OFF;
    }

    public EnableScroll() {
        this.scroller.scrollPolicyV = eui.ScrollPolicy.AUTO;
        this.scroller.scrollPolicyH = eui.ScrollPolicy.AUTO;
    }

    public EnableScrollX() {
        this.scroller.scrollPolicyH = eui.ScrollPolicy.AUTO;
    }

    public EnableScrollY() {
        this.scroller.scrollPolicyV = eui.ScrollPolicy.AUTO;
    }

    public Lock(): void {
        this.DisableScroll();
    }

    public UnLock(): void {
        this.EnableScroll();
    }

    public Dispose() {
        if (this.moveFunc) {
            this.scroller.addEventListener(eui.UIEvent.CHANGE, this.moveFunc, this.scroller);
        }

        if (this.movedFunc) {
            this.scroller.addEventListener(eui.UIEvent.CHANGE_END, this.movedFunc, this.scroller);
        }

        super.Dispose();
        this.movedFunc = null;
        this.view = null;
        //this.move = null;
    }
}

window["NMovePanel"] = NMovePanel;