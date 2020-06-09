//NGridList手动分页类
//使用方法：
// let pager = new NNoPage(this.g);
// pager.Set(0, 100, ()=>{}));
class NNoPage {
    public _val: number;
    private func: Function;
    private max: number = 0;

    private page: number = 0;
    private inPaging: boolean = false;

    private g: NGridList;

    private page1: Bx;
    private page2: Bx;

    public constructor(g: NGridList) {
        this.g = g;
        if (g._disableScroll) {
            throw new Error("NGridList need sed _disableScroll=true");
        }

        let reset = true;

        this.g.OnScrollerEnd((ev) => {
            let scrollV: number = ev.scrollV;
            if (this.g.disposed) {
                return;
            }
            //if (!this.inPaging) {
            if (scrollV < -5 || scrollV > 5) {
                if (reset) {
                    reset = false;
                    if (ev.scrollV < 0) {
                        if (this.page > 0) {
                            this.page--;
                            this.inPaging = true;
                            this.func(this.page);
                        }
                    } else if (ev.scrollV > 0) {
                        if (this.page < this.max - 1) {
                            this.page++;
                            this.inPaging = true;
                            this.func(this.page);
                        }
                    }
                }
            } else {
                reset = true;
            }
            //Js.Trace(ev.scrollV);
            //}
        });

        this.page1 = Assert.Img("comboboxdown");
        this.page1.align = 1;
        this.page2 = Assert.Img("comboboxdown");
        this.page2.align = 1;

        this.page1.scaleY = -1;

        this.g.Add(this.page1, this.g.w / 2, this.page1.height);
        this.g.Add(this.page2, this.g.w / 2, this.g.h - this.page2.height);

        g.OnDispose(() => {
            this.g = null;
            this.func = null;
            this.page1.Dispose();
            this.page2.Dispose();
            this.page1 = null;
            this.page2 = null;
        });
    }

    public Set(page: number, max: number, func: Function): void {
        this.func = func;
        if (page >= 0) {
            this.page = page;
        }
        this.max = max;
        if (page <= 0) {
            this.page1.Hide();
        } else {
            this.page1.Show();
        }
        if (page >= max - 1) {
            this.page2.Hide();
        } else {
            this.page2.Show();
        }
        NForm.SetTimeout(1000, () => {
            this.inPaging = false;
        });
    }
}

window["NNoPage"] = NNoPage;
