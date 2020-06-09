//临时存储类
//使用方法：
//Caches.SetObj("test","1");
//Caches.GetObj("test");
///<reference path="Listx.ts" />
class Caches {
    private static dic = new Listx();

    public static GetDic(key: string): any {
        if (!Caches.dic[key]) {
            Caches.dic[key] = new Listx();
        }
        return Caches.dic[key];
    }

    public static GetListx(key: string): Listx {
        if (!Caches.dic[key]) {
            Caches.dic[key] = new Listx();
        }
        return Caches.dic[key];
    }

    public static GetArr(key: string): any {
        if (!Caches.dic[key]) {
            Caches.dic[key] = [];
        }
        return Caches.dic[key];
    }

    public static GetObj(key: string): any {
        return Caches.dic[key];
    }

    public static SetObj(key: string, obj: any): void {
        Caches.dic[key] = obj;
    }
}
window["Caches"] = Caches;