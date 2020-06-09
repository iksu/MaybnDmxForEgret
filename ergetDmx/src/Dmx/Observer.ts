//底层类
///<reference path="Arr.ts" />
///<reference path="Dictionary.ts" />
class Observer extends Dictionary {
    public constructor() {
        super();
    }
    
    public g(key: any): any {
        return this.Get(key);
    }

    public Get(name: any): any {
        var val: any = null;
        if(!this.Exists(name)) {
            if(this._xml) {                
                val = this._xml[name];
            }
        } else {
            val = super.Get(name);
        }
        return val;
    }

    public setProperty(name: any,value: any) {
        this.Set(name,value);
    }

    public Dispose() {
        if(this._xml) {
            this._xml = null;
        }
        super.Dispose();
    }
}

window["Observer"] = Observer;