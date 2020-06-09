class Xml {
    public nodes = [];
    public keys = {};
    public constructor(text: string) {
        if (text == null || text.IsEmpty()) {
            return ;
        }

        let types = { beginNode: 1, endNode: 2, text: 3, att: 4 };

        let xml = this.nodes;
        let keys = this.keys;
        let parent = null;
        let obj;
        let nodeName;
        let readerNode = (node) => {
            if (node.type == types.beginNode) {
                nodeName = node.val.join("");
                if (nodeName == "root" || nodeName == "TextureAtlas") {
                } else if (nodeName == "ox" || nodeName == "SubTexture") {
                    obj = {};
                    xml.push(obj);
                    parent = null;
                }
                else if (nodeName == "oxs") {
                    if (!parent) {
                        parent = obj;
                    }
                    if (!parent[nodeName]) {
                        parent[nodeName] = [];
                    }
                    let obj1 = {};
                    parent[nodeName].push(obj1);
                    obj = obj1;
                }
                else {
                }
            } else if (node.type == types.endNode) {
            } else if (node.type == types.text) {
                if (obj) {
                    if (nodeName) {
                        obj[nodeName] = node.val.join("").replace(/&amp;/g,"&")
                        .replace(/&amp;/g,"&")
                        .replace(/&lt;/g,"<")
                        .replace(/&gt;/g,">")
                        .replace(/&quot;/g,"\"")
                        .replace(/&apos;/g,"\'");
                        if (!keys[nodeName]) {
                            keys[nodeName] = true;
                        }
                    }
                }
            } else if (node.type == types.att) {
                if (obj) {
                    let nodeName = node.node.join("");
                    obj[nodeName] = node.val.join("");
                    if (!keys[nodeName]) {
                        keys[nodeName] = true;
                    }
                }
            }
        };

        let begin = false;
        let end = false;
        let node = [];
        let textVal = [];
        let beginIndex = 0;
        let isAtt = false;
        let beginAtt = 0;

        for (let i = 0, len = text.length; i < len; i++) {
            let c = text.charAt(i);
            if (!begin) {
                if (isAtt) {
                    if (beginAtt >= 2) {
                        if (c == "\"") {
                            beginAtt = 0;
                            readerNode({ type: types.att, node: node, val: textVal });
                            textVal.length = 0;
                            node.length = 0;
                        } else {
                            textVal.push(c);
                        }
                    } else if (c == "=" || c == "\"") {
                        beginAtt++;
                    } else if (c == ">") {
                        isAtt = false;
                        beginAtt = 0;
                        textVal.length = 0;
                        node.length = 0;
                    } else {
                        if (c != " ") {
                            node.push(c);
                        }
                    }
                } else {
                    if (c == "<") {
                        begin = true;
                        node.length = 0;
                        if (beginIndex == 3) {
                            readerNode({ type: types.text, val: textVal });
                            textVal.length = 0;
                        }
                        beginIndex++;
                    } else {
                        textVal.push(c);
                    }
                }
            } else {
                if (c == "/") {
                    end = true;
                    beginIndex -= 2;
                }
                else if (c == ">") {
                    if (end) {
                        readerNode({ type: types.endNode, val: node });
                    } else {
                        readerNode({ type: types.beginNode, val: node });
                    }
                    begin = false;
                    end = false;
                    textVal.length = 0;
                    isAtt = false;
                    node.length = 0;;
                } else if (node && c == " ") {
                    readerNode({ type: types.beginNode, val: node });
                    begin = false;
                    end = false;
                    textVal.length = 0;
                    isAtt = true;
                    node.length = 0;;
                } else {
                    node.push(c);
                }
            }
        }
    }
}

window["Xml"] = Xml;