class Prototype {
}
Array.prototype["Each"] = function(func) {
    var len = this.length;
    for(var i = 0;i < len;i++) {
        if(func(this[i])) {
            break;
        }
    }
};