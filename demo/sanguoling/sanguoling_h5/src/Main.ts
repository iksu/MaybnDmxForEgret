//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends eui.UILayer {


    protected createChildren(): void {
        super.createChildren();

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })

        // egret.lifecycle.onPause = () =>{
        //     egret.ticker.pause();
        // }

        // egret.lifecycle.onResume = () =>{
        //     egret.ticker.resume();
        // }

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());


        this.runGame().catch(e => {
            console.log(e);
        })
    }

    private async runGame() {
        //this.stage.orientation = egret.OrientationMode.PORTRAIT;
        this.stage.orientation = egret.OrientationMode.LANDSCAPE;
        /////
        this.createGameScene();
    }

     protected createGameScene(): void {
         var game = new Game();

        var scaleMode = egret.StageScaleMode.FIXED_WIDTH;

        var maxWh = 1.78;//iphonex
        var minWh = 1.7;//ipad
        var wh = window.innerWidth / window.innerHeight;
        if (wh >= maxWh) {//iphonex
            let scale = this.stage.stageHeight * maxWh / this.stage.stageWidth;
            game.scaleX = scale;
            NForm.stageHeightOffset = this.stage.stageHeight * (1 - scale) / scale;
            game.scaleY = scale;
            game.x = this.stage.stageWidth * (1 - scale) / 2;
            ////////////////////////////////////////////////////
            NForm.stageX = game.x;
            NForm.stageScale = scale;
            NForm.WIDE = true;
        } else if (wh <= minWh) {//ipad
            NForm.stageHeightOffset = this.stage.stageWidth / minWh - this.stage.stageHeight;
            game.y = -NForm.stageHeightOffset / 2;
            ////////////////////////////////////////////////////
            NForm.stageY = game.y;
            NForm.NARROW = true;
        } else {
        }

        this.stage.scaleMode = scaleMode;

        game.Start(this.stage);
        this.stage.addChild(game);
        this.stage.removeChild(this);
    }
}
