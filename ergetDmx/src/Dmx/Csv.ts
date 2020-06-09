class Csv {
    public nodes = [];
    public keys = {};
    public keyArr = [];
    public constructor(text: string) {
        if (text == null || text.IsEmpty()) {
            return;
        }
        let row = 0;
        let vals = [];
        let extra = false;
        let extraD = false;

        let cell = [];
        for (let i = 0, len = text.length; i < len; i++) {
            let c = text.charAt(i);
            if (c == ",") {
                if (extra) {
                    cell.push(c);
                } else {
                    let cellVal = cell.join("");
                    vals.push(cellVal);
                    cell.length = 0;
                    extra = false;
                }
            }
            else if (c == "\n" || c == "\r") {
                if (vals.length > 0) {
                    let cellVal = cell.join("");
                    vals.push(cellVal);
                    cell.length = 0;
                    extra = false;

                    if (row == 0) {
                        vals.forEach(fi => {
                            this.keyArr.push(fi);
                            this.keys[fi] = true;
                        });
                    } else {
                        let obj = {};
                        let index = 0;
                        this.keyArr.forEach(fi => {
                            obj[fi] = vals[index];
                            index++;
                        });
                        this.nodes.push(obj);
                    }
                    vals.length = 0;
                } else {
                    cell.length = 0;
                    extra = false;
                }
                row++;
            } else {
                if (cell.length == 0 && c == "\"") {
                    extra = true;
                } else {
                    if (extra) {
                        if (!extraD && c == "\\") {
                            extraD = true;
                        } else {
                            if (c == "\"") {
                                extra = false;
                            } else {
                                cell.push(c);
                            }
                            extraD = false;
                        }
                    } else {
                        cell.push(c);
                    }
                }
            }
        }
        //Js.Trace(row);
    }
}

window["Csv"] = Csv;