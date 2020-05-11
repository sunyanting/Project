(function(root){
    function Index(len){
        this.index = 0;
        this.len = len ;
    }
    Index.prototype={
        prev(){
            return this.get(-1);
        },
        next(){
            return this.get(1);
        },
        get(val){
            this.index = (this.index + val +this.len)%this.len;
            return this.index;
        }
    }
    root.controlIndex = Index;//把构造函数暴露出去，因为实例对象需要传参，所以实例对象不能暴露出去
})(window.player || (window.player={}));