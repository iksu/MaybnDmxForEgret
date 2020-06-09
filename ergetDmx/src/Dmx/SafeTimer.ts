// ///<reference path="Dictionary.ts" />
// class SafeTimer {
//     public static _fps: number = 0;
//     public static fps: Listx = new Listx();
//     public static stage: egret.Stage;
//     public static loaded: boolean = false;
//     public static Load(stage: egret.Stage) {
//         if(!SafeTimer.loaded) {
//             SafeTimer.stage = stage;
//             stage.addEventListener(egret.Event.ENTER_FRAME,SafeTimer.EnterFrame,null);
//             //stage.addEventListener(egret.Event.RENDER,SafeTimer.Render,null);
//             SafeTimer.Add(1500,SafeTimer.HandleAutoHide);
//             SafeTimer.loaded = true;
//         }
//     }

//     public static Add(interval: number,func: Function) {
//         SafeTimer.staticObjCount++;
//         var timer: egret.Timer = new egret.Timer(interval);
//         var act: Function =function(ev: egret.TimerEvent) {
//             if(stop) {
//                 return;
//             }
//             var stop: boolean =func();
//             if(stop) {
//                 timer.removeEventListener(egret.TimerEvent.TIMER,act,null);
//                 timer.stop();
//                 SafeTimer.staticObjCount--;
//             }
//         };
//         timer.addEventListener(egret.TimerEvent.TIMER,act,null);
//         timer.start();
//     }

//     public static staticObjCount: number = 0;
//     public static staticTimerDic: Dictionary = new Dictionary();
//     public static AddStatic(interval: number,func: Function) {
//         if(!SafeTimer.staticTimerDic.Get(interval.toString())) {
//             SafeTimer.staticTimerDic.Set(interval,new Array<Function>());
//             SafeTimer.Add(interval,function(): boolean {
//                 if(stop) {
//                     return false;
//                 }
//                 var arr: Array<Function> = SafeTimer.staticTimerDic.Get(interval.toString());
//                 for(var fi_key_a in arr) {
//                     var fi: Function = arr[fi_key_a];
//                     var stop: boolean = false;
//                     SafeTimer.Try(function() {
//                         if(fi()) {
//                             stop = true;
//                         }
//                     },false);
//                     if(stop) {
//                         var index: number = arr.indexOf(fi);
//                         if(index > -1) {
//                             arr.splice(index,1);
//                             SafeTimer.staticObjCount--;
//                             continue;
//                         }
//                     }
//                 }
//                 return false;
//             });
//         }
//         SafeTimer.staticTimerDic.Get(interval.toString()).push(func);
//         SafeTimer.staticObjCount++;
//     }

//     public static AddRepeat(interval: number,repeatCount: number,func: Function,complete: Function = null) {
//         var timer: egret.Timer = new egret.Timer(interval,repeatCount);
//         var act1: Function =function(ev: egret.TimerEvent) {
//             if(SafeTimer.stop) {
//                 return;
//             }
//             func();
//         };
//         var act2: Function =function(ev: egret.TimerEvent) {
//             complete();
//             timer.removeEventListener(egret.TimerEvent.TIMER,act1,null);
//             timer.removeEventListener(egret.TimerEvent.TIMER_COMPLETE,act2,null);
//             timer.stop();
//             SafeTimer.staticObjCount--;
//         };
//         timer.addEventListener(egret.TimerEvent.TIMER,act1,null);
//         timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE,act2,null);
//         timer.start();
//         SafeTimer.staticObjCount++;
//     }

//     public static SetTimeout(interval: number,func: Function) {
//         var timer: egret.Timer = new egret.Timer(interval,1);
//         var act: Function =function(ev: egret.TimerEvent) {
//             if(SafeTimer.stop) {
//                 return;
//             }
//             func();
//             timer.removeEventListener(egret.TimerEvent.TIMER_COMPLETE,act,null);
//             SafeTimer.staticObjCount--;
//         };
//         timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE,act,null);
//         timer.start();
//         SafeTimer.staticObjCount++;
//     }

//     public static dic: Dictionary = new Dictionary();
//     public static LazyCall(name: any,state: any = null) {
//         if(state == null) {
//             SafeTimer.dic.Set(name,name);
//         }
//         else {
//             if(!SafeTimer.dic.Exists(name)) {
//                 SafeTimer.dic.Set(name,state);
//             }
//             else {
//                 var state1: any = SafeTimer.dic.Get(name);
//                 for(var key in state) {
//                     state1[key] = state[key];
//                 }
//             }
//         }
//         if(!SafeTimer.loaded) {
//             SafeTimer.EnterFrame(null);
//         }
//     }

//     public static EnterFrame(ev: egret.Event) {
//         SafeTimer._fps++;
//         if(SafeTimer.stop) {
//             return;
//         }
//         SafeTimer.dic.EachKey((fi) => {
//             var state: any = SafeTimer.dic.Get(fi);
//             if(state instanceof Function) {
//                 SafeTimer.Try(function() {
//                     state();
//                 });
//             }
//             else {
//                 for(var key in state) {
//                     SafeTimer.Try(function() {
//                         fi[key] = state[key];
//                     },false);
//                 }
//             }
//             SafeTimer.dic.Set(fi,null);       
//             SafeTimer.dic.Remove(fi);
//         });
//     }

//     public static Render(ev: egret.Event) {
//     }

//     public static Try(func: Function,willLog: boolean = false) {
//         if(Js.showTrace) {
//             func();
//             if(willLog) {
//                 var ex: Error = new Error();
//                 Js.Trace("-----------------------" + ex.message.replace(/\n/g,"***").replace(/ /g," "));
//             }
//         }
//         else {
//             try {
//                 func();
//             }
//             catch(ex)
//             { }
//         }
//     }

//     public static AddHandleAutoHide(sx: Ix) {
//         SafeTimer.autoHideList.push(sx);
//     }

//     public static autoHideList: Array<Ix>;
//     public static HandleAutoHide(): boolean {
//         SafeTimer.fps["fps"] = SafeTimer._fps * 2 / 3;
//         SafeTimer._fps = 0
//         var count: number = 0;
//         for(var sx_key_a in SafeTimer.autoHideList) {
//             var sx: any = SafeTimer.autoHideList[sx_key_a];
//             if(sx.disposed) {
//                 var index: number = SafeTimer.autoHideList.indexOf(sx);
//                 if(index > -1) {
//                     SafeTimer.autoHideList.splice(index,1);
//                 }
//             }
//             else {
//                 if(sx.showTop50 && count >= 50) {
//                     sx.HandleAutoHide_Hide();
//                 }
//                 else {
//                     var rv: boolean =sx.HandleAutoHide();
//                     if(rv) {
//                         if(sx.showTop50) {
//                             count++;
//                         }
//                     }
//                 }
//             }
//         }
//         return false;
//     }

//     public static stop: boolean;
//     public static StopAllSafeTimer() {
//         SafeTimer.stop = true;
//     }

// }

