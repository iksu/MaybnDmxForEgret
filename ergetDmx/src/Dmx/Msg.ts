class Msg {
    private static list = new Listx();
    public static Call(name: string, val: any) {
        try {
            if (Msg.list.Exists(name)) {
                let actList: Arr<Function> = Msg.list[name];
                actList.Each((fi: Function) => {
                    try {
                        Msg.Fun(fi, val);
                    }
                    catch (ex) {
                        Js.Trace(ex);
                    }
                });
            }
        }
        catch (ex) {
            Js.Trace(ex);
        }
    }

    public static Fun(fi: Function, val: any) {
        NForm.LazyCall(() => {
            if (fi) {
                fi(val);
            }
        });
    }

    public static Listen(name: string, act: Function, sx: Ix) {
        // Js.Trace(name);
        // Js.Trace(act);

        if (!Msg.list.Exists(name)) {
            Msg.list[name] = new Arr<any>();
        }
        let arr: Arr<Function> = Msg.list[name];
        arr.Add(act);
        if (sx) {
            sx.OnDispose(() => {
                arr.Remove(act);
            });
        }
    }
}

window["Msg"] = Msg;