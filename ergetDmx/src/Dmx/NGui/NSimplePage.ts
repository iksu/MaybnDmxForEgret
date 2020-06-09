//改用NNoPage代替，不然分页按钮可能太小点不中
// class NSimplePage extends Sx {
//     public _val: number;
//     private func: Function;
//     private min: number = 1;
//     private max: number;
//     private text: NText;
//     private page: number;
//     private numNct: NColorText;

//     public constructor() {
//         super();

//         var bg: NPanel = new NPanel(86, 34, 4);
//         bg.alpha = 0.5;
//         this.Add(bg, 112);

//         this.numNct = new NColorText("", false, 15);
//         this.numNct.align = 1;
//         this.Add(this.numNct, 155, 9);

//         var a: NSButton = new NSButton("pagel1");
//         this.Add(a, 60, 0);
//         a.Click(() => {
//             if (this.page > this.min) {
//                 this.val = this.page;
//                 this.func(this.val - 1);
//                 this.page = this.val;
//             }
//         });

//         var b: NSButton = new NSButton("pager1");
//         this.Add(b, 210, 0);
//         b.Click(() => {
//             if (this.page < this.max) {
//                 this.val = this.page;
//                 this.func(this.val + 1);
//                 this.page = this.val;
//             }
//         });

//         var c: NSButton = new NSButton("pagel0");
//         this.Add(c);
//         c.Click(() => {
//             this.val = 1;
//             this.func(this.val);
//             this.page = this.val;
//         });

//         var d: NSButton = new NSButton("pager0");
//         this.Add(d, 270, 0);
//         d.Click(() => {
//             this.val = this.max;
//             this.func(this.val);
//             this.page = this.val;
//         });

//         this.val = this.min;
//     }

//     public set val(_val: number) {
//         if (_val < this.min) {
//             _val = this.min;
//         }
//         if (_val > this.max) {
//             _val = this.max;
//         }
//         this._val = _val;

//         this.numNct.val = "第" + _val + "页";
//     }

//     public get val(): number {
//         return this._val;
//     }

//     public SetMin(min: number) {
//         this.min = min;
//         this.val = this.val;
//     }

//     public SetMax(max: number) {
//         this.max = max;
//         this.val = this.val;
//     }

//     public Set(page: number, total: number, func: Function) {
//         Js.Trace("page:" + page);
//         this.func = func;
//         this.max = total
//         this.SetMax(total);
//         this.val = page;
//         this.page = page;

//         this.numNct.val = "第" + page + "页";
//     }
// }
