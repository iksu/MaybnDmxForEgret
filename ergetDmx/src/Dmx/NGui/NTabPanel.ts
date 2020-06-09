//选项卡类 
//使用方法
// let tab = new NTabPanel(750, 430, 31, null, 0, 35);
// this.Add(tab, (NForm.width - tab.w - tab.tempButton.w + 20) / 2, 60);
// this.tab.AddTabPro("选项卡1", (p: Sx) => {
//     p.Add(new NLabel("选项卡1"));
// }, null, 50, 1);
// this.tab.AddTabPro("选项卡2", (p: Sx) => {
//     p.Add(new NLabel("选项卡2"));
// }, null, 50, 1);
// this.tab.Select(0);
class NTabPanel extends Sx {
    public static defaultPanelType: number = 11;

    public list: Listx = new Listx();
    public bList: Listx = new Listx();
    public tabPanel: NPanel;
    public midPanel: NPanel;
    public selectKey: string;
    public contentP: NPanel;
    private style: number;
    public tempButton: NButton;
    private OnTabChange: Function;
    private mode: number;
    private allP: Sx;
    public w: number;
    public h: number;

    private panelType: number;

    public constructor(w: number, h: number, buttonStyle: number = 10, OnTabChange: Function = null, mode: number = 0, panelType: number = -9999) {
        super();
        if (panelType == -9999) {
            panelType = NTabPanel.defaultPanelType;
        }
        this.mode = mode;
        this.w = w;
        this.h = h;
        this.style = buttonStyle;
        this.OnTabChange = OnTabChange;
        this.panelType = panelType;

        this.tempButton = new NButton("", buttonStyle);
        this.tempButton.Hide();
        this.Add(this.tempButton);

        let offsetY: number = 1;
        offsetY = 4;

        if (mode == 1) {
            let allP1: NScrollPanel = new NScrollPanel(this.w, this.h + 32);
            this.Add(allP1);

            this.allP = new Sx();
            allP1.Add(this.allP);

            allP1.Pos(0, offsetY);
        } else {
            this.allP = new Sx();
            this.Add(this.allP, 0, 31 + offsetY);
        }

        this.tabPanel = new NPanel(w, this.tempButton.height - 10);
        this.tabPanel.Pos(0, offsetY - (this.tempButton.height - 31));
        this.Add(this.tabPanel);

        this.midPanel = new NPanel(w, this.tempButton.height - 10);
        this.tabPanel.Add(this.midPanel);
    }

    private _offset: number = 0;

    public AddTab(key: string, offset: number = 0, type: number = 0): NPanel {
        this._offset += offset;
        if (this.list.Length == 0) {
            this.selectKey = key;
            if (offset != 0) {
            }
        }
        let b = new NButton(key, this.style);
        b.b.music = "";

        this.tabPanel.Add(b);
        b.Click((() => {
            Music.Play("tab");
            this.SelectKey(key);
        }).bind(this));
        if (type == 0) {
            b.Pos(25 + this.list.Length * (this.tempButton.width + 6) + this._offset, 0);
        } else if (type == 2) {
            b.Pos(this.w, 60 + this.list.Length * (this.tempButton.height + 6) + this._offset);
        } else {
            b.Pos(-this.tempButton.width, 60 + this.list.Length * (this.tempButton.height + 6) + this._offset);
        }
        this.bList[key] = b;
        let p: NPanel = new NPanel(this.w, this.h, this.panelType);
        p.Hide();

        this.allP.Add(p);
        this.list[key] = p;

        this.LoadXY();

        return p;
    }

    private proList: Listx;
    private proFuncList: Listx;
    private tabFuncList: Listx;
    private selectProP: NPanel;
    public AddTabPro(key: string, func: Function, tabFunc: Function = null, offset: number = 0, type: number = 0) {
        if (this.proList == null) {
            this.proList = new Listx();
        }
        if (this.proFuncList == null) {
            this.proFuncList = new Listx();
        }
        if (this.tabFuncList == null) {
            this.tabFuncList = new Listx();
        }
        let p: NPanel = this.AddTab(key, offset, type);

        this.proList[key] = p;
        this.proFuncList[key] = func;
        if (tabFunc) {
            this.tabFuncList[key] = tabFunc;
        }
        this.selectKey = "";
    }

    private static PutPosition(x: number, y: number, xOffset: number, yOffset: number, items: Array<any>): void {
        for (let i: number = 0; i < items.length; i++) {
            if (items[i] != null) {
                items[i].x = x + xOffset * i;
                items[i].y = y + yOffset * i;
            }
        }
    }

    private LoadXY() {
        if (this.mode == 1) {
            let arr = [];
            this.list.Each((fi) => {
                arr.push(fi);
            });
            NTabPanel.PutPosition(0, 32, this.w, 0, arr);
        }
    }

    public Select(index: number) {
        this.SelectKey(this.list.GetName(index));
    }

    public get selectIndex(): number {
        let index = this.list.GetIndex(this.selectKey);
        return index.Max(0);
    }

    public SelectKey(key: string) {
        if (!this.list.Exists(key)) {
            return;
        }
        let willEvent = false;
        if (this.selectKey != key) {
            willEvent = true;
        }

        let willNotOpen = false;
        if (this.proList && this.proList.Exists(key)) {
            if (this.proList[key].loaded) {
            } else {
                willNotOpen = this.proFuncList[key](this.proList[key]);
                if (!willNotOpen) {
                    this.proList[key].loaded = true;
                }
            }
        }

        if (!willNotOpen) {
            this.selectKey = key;
            if (this.mode == 0) {
                this.list.Each((fi) => {
                    fi.Hide();
                });
                this.list[key].Show();
            }
            this.bList.Each((fi) => {
                fi.Off();
            });
            if (this.mode == 0) {
                this.list[key].Show();
            }
            if (this.mode == 1) {
                let index = 0;
                this.list.EachKey((fi) => {
                    if (fi == key) {
                        ActLite.To(this.allP, { x: -index * this.w }, 400);
                        return true;
                    }
                    index++;
                });
            }
            this.bList[key].On();
        }
        if (!willNotOpen) {
            if (willEvent) {
                if (this.OnTabChange) {
                    NForm.LazyCall(() => {
                        this.OnTabChange(this.list.GetIndex(key));
                    });
                }
                if (this.tabFuncList) {
                    if (this.tabFuncList.Exists(key)) {
                        NForm.LazyCall(() => {
                            this.tabFuncList[key]();
                        });
                    }
                }
            }
        }
    }
}

window["NTabPanel"] = NTabPanel;