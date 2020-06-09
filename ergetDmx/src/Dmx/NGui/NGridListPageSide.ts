class NGridListPageSide extends Sx {
    public g: NGridList;
    public column: number = 1;
    public pageSize: number = 1;
    public xqt: XmlLinqT;
    public data: Array<Listx>;
    public func: Function;
    public cellHeight: number;
    public margin: number;
    public page: number = -1;
    public orderByFunc: Function;

    public w: number;
    public h: number;

    public canSetPageFunc: Function;

    public constructor(w: number, h: number, column: number, pageSize: number, emptyToCount: number = 0) {
        super();
        this.column = column;
        this.pageSize = pageSize;
        this.w = w;
        this.h = h;

        this.g = new NGridList(w, h, column, emptyToCount);
        this.g.DisableScroll();
        this.g.DisableMask();
        this.Add(this.g);

        let left = new NSButton("page1");
        this.Add(left, -10 - left.width, (h - left.height) * 4 / 9);
        left.Click(() => {
            this.SetPage(this.page - 1);
        });

        let right = new NSButton("page2");
        this.Add(right, w + 10, (h - right.height) * 4 / 9);
        right.Click(() => {
            let newPage = this.page + 1;
            if (this.canSetPageFunc) {
                if (this.canSetPageFunc(newPage)) {
                     this.SetPage(this.page + 1);
                }
            } else {
                this.SetPage(this.page + 1);
            }
        });
    }

    public SetData(xqt: XmlLinqT, cellHeight: number, func: Function, margin: number = 0) {
        this.data = new Array<Listx>();
        if (this.orderByFunc) {
            let keys = xqt.keys.sort((a, b) => {
                try {
                    let lista = xqt[a];
                    let listb = xqt[b];
                    return this.orderByFunc(lista) - this.orderByFunc(listb);
                } catch (ex) {
                    Js.Trace(ex);
                }
                return 0;
            });
            keys.forEach(((k) => {
                let list = xqt[k];
                this.data.push(list);
            }).bind(this));
        } else {
            xqt.Each((fi) => {
                this.data.push(fi);
            });
        }
        this.g.orderByFunc = this.orderByFunc;

        this.xqt = xqt;

        this.func = func;
        this.cellHeight = cellHeight;
        this.margin = margin;
    }

    public SetPage(page: number) {
        page = Math.max(page, 0);
        page = Math.min(page, this.xqt.GetPageSize(this.pageSize) - 1);
        if (this.page != page) {
            this.page = page;
            //let data = this.xqt.GetPage(this.pageSize, page);
            let data = this.GetPageData(page);
            this.g.SetData(data, this.cellHeight, this.func, false, this.margin);
        }
    }

    public GetPageData(page: number): XmlLinqT {
        page = Math.max(page, 0);
        page = Math.min(page, this.xqt.GetPageSize(this.pageSize) - 1);
        let data = new XmlLinqT();
        for (let i = page * this.pageSize, len = (page + 1) * this.pageSize; i < len; i++) {
            if (this.data.length > i) {
                data.Add(this.data[i]);
            }
        }
        return data;
    }

    public Reload() {
        this.page = -1;
        this.SetPage(0);
    }
}

window["NGridListPageSide"] = NGridListPageSide;