// class NTileMap extends Sx {
//     private tileWidth: number = 200;
//     private tileHeight: number = 200;
//     private id: string;
//     private showBlackBg: boolean;

//     private mapWidth: number;
//     private mapHeight: number;

//     private textureBlockIndex: number = 0;
//     private textureBlockIndexCheck: number = 0;
//     private textureBlock;

//     private info: Listx;

//     public constructor(id: string, mapWidth: number, mapHeight: number, showBlackBg: boolean = false) {
//         super();
//         this.id = id;
//         this.showBlackBg = showBlackBg;
//         this.mapWidth = mapWidth;
//         this.mapHeight = mapHeight;
//         this.info = new Listx();

//         //if(!Parms.starling){
//         this.textureBlock = Assert.Img("" + id + ".jpg", mapWidth, mapHeight);
//         this.Add(this.textureBlock);
//         //}

//         Form.LazyCall(this.Update.bind(this));
//     }

//     public Update(x: number = 0, y: number = 0) {
//         Form.LazyCall(() => {
//             this.DoUpdate(x, y);
//         });
//     }

//     public DoUpdate(x: number = 0, y: number = 0) {
//         if (x == 0 && y == 0) {
//             return;
//         }
//         if (x == 0) {
//             x = -this.globalX;
//         }
//         if (y == 0) {
//             y = -this.globalY;
//         }
//         var added: boolean = false;
//         var jMin: number = Math.floor(1.0 * y / this.tileHeight);
//         var jMax: number = Math.ceil(1.0 * (y + NForm.height) / this.tileHeight);
//         var iMin: number = Math.floor(1.0 * x / this.tileWidth);
//         var iMax: number = Math.ceil(1.0 * (x + NForm.width) / this.tileWidth);
//         for (var j: number = 0, jlen: number = Math.ceil(this.mapHeight / this.tileHeight); j < jlen; j++) {
//             for (var i: number = 0, ilen: number = Math.ceil(this.mapWidth / this.tileWidth); i < ilen; i++) {
//                 if (j >= jMin && j < jMax &&
//                     i >= iMin && i < iMax) {
//                     if (!this.info.Exists(j + "_" + i)) {
//                         this.AddBG(this.id, j, i);
//                         added = true;
//                     } else {
//                         if (!this.info[j + "_" + i].parent) {
//                             this.Add(this.info[j + "_" + i]);
//                         }
//                     }
//                 } else {
//                     if (this.info.Exists(j + "_" + i) && this.info[j + "_" + i].parent) {
//                         this.info[j + "_" + i].RemoveMe();
//                     }
//                 }
//             }
//         }
//         if (added) {
//             //SetChildrenMouseEnabled();
//         }
//     }

//     private AddBG(id: string, j: number, i: number): void {
//         if (this.textureBlock ) {
//             this.textureBlock.Show();
//         }
//         this.textureBlockIndexCheck++;
//         var s = Assert.Img(id + "/" + j + "_" + i + ".jpg");
//         s.OnLoaded(() => {
//             //sp.DrawImg(s.bx,i*tileWidth,j*tileHeight);
//             this.textureBlockIndex++;
//             if (this.textureBlockIndex >= this.textureBlockIndexCheck) {
//                 if (this.textureBlock ) {
//                     this.textureBlock.Hide();
//                 }
//             }
//         });
//         this.Add(s, i * this.tileWidth, j * this.tileHeight);
//         s.autoDispose = false;
//         this.info[j + "_" + i] = s;
//     }
// }