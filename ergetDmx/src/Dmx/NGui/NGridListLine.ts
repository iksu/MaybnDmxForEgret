// class NGridListLine extends Sx {
//     public cellWidth: number;
//     public cellHeight: number;
//     public cellAct: Function;
//     public data: XmlLinqT;

//     public p: any;
//     public sc: eui.Scroller;

//     public constructor(cellWidth: number,cellHeight: number,data: XmlLinqT,cellAct: Function,line: number = 1,canSelect: boolean = false) {
//         //canSelect TODO;
//         super();

//         this.data = data;
//         this.cellAct = cellAct;
//         this.cellWidth = cellWidth;
//         this.cellHeight = cellHeight;

//         this.width = cellWidth;
//         this.height = cellHeight * line;

//         if(canSelect) {
//             this.p = new eui.List();
//         } else {
//             this.p = new eui.DataGroup();
//         }

//         this.p.itemRendererSkinName = null;
//         this.p.useVirtualLayout = true;
//         this.p.itemRenderer = NGridListRender;

//         this.sc = new eui.Scroller();
//         this.sc.width = cellWidth;
//         this.sc.height = cellHeight * line;
//         this.sc.viewport = this.p;
//         this.sc.scrollPolicyH = eui.ScrollPolicy.OFF;
//         this.Add(this.sc);

//         this.p.dataProvider = this.data._names;
//     }
// }