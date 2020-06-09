// interface Object {//Object不能扩展
//     ToInt(): number;
// }
// if (!Object.prototype.ToInt) {
//     Object.prototype.ToInt = function () {
//         return this.toString().ToInt();
//     };
// }

interface Number {
    ToInt(): number;
    Max(val1: number): number;
    Min(val1: number): number;
    Clamp(min: number, max: number): number;
}

if (!Number.prototype.ToInt) {
    Number.prototype.ToInt = function () {
        return parseInt(this);
    };
}

if (!Number.prototype.Max) {
    Number.prototype.Max = function (val1: number) {
        return Math.max(this, val1);
    };
}

if (!Number.prototype.Min) {
    Number.prototype.Min = function (val1: number) {
        return Math.min(this, val1);
    };
}

if (!Number.prototype.Clamp) {
    Number.prototype.Clamp = function (min: number, max: number) {
        return Math.min(Math.max(this, min), max);
    };
}

// egret.MovieClipData.prototype.getTextureByFrame = function (frame) {
//     if (frame) {
//         var frameData = this.getKeyFrameData(frame);
//         if (frameData) {
//             if (frameData.res) {
//                 var outputTexture = this.getTextureByResName(frameData.res);
//                 return outputTexture;
//             }
//         }
//     }
//     return null;
// };