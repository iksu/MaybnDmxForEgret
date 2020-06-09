// class NHardPanel extends Sx {
//     public p: Sx;
//     public sc: eui.Scroller;
//     public constructor(width: number = 1,height: number = 1) {
//         super();
//         this.p = new Sx();

//         this.sc = new eui.Scroller();
//         this.sc.width = width;
//         this.sc.height = height;
//         this.sc.viewport = this.p;
//         this.Add(this.sc);
//     }

//     public Add(s: any,x: number = 0,y: number = 0): boolean {
//         var that=this;
//         if(this.p == null || this.p == s || egret.is(s,"eui.Scroller")) {
//             return super.Add(s,x,y);
//         } else {
//             this.p.Add(s,x,y);
//         }
//         return true;
//     }
// }
