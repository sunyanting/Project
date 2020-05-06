//通用的页码插件
//创建一个页码对象
function Pager(options){
    var defaultOptions={
        total:0,//总数据量
        current:1,//当前页码，最小为1
        limit:10,//页容量
        container:document.querySelector(".pager"),//页码容器
        firstText:"首页",//首页显示的文字
        prevText:"上一页",//上一页显示的文字
        nextText:"下一页",
        lastText:'尾页',
        pannelNumber:5,//分页面板中，数字页码最多有多少个
        onPageChange:null,//这是一个回掉函数，当页码发生改变时，会调用该函数
    }
    //对象混合
    this.options = Object.assign({},defaultOptions,options);
    // this.options={  es6的写法
    //     ...defaultOptions,
    //     ...options
    // }

    //this.show();
    this.registEvent();
}
//根据当前配置，重新显示页码
Pager.prototype.show = function(){
    //清空容器
    this.options.container.innerHTML='';
    //禁用样式
    var disabled ='';
    if(this.options.current===1){
        disabled="disabled"
    }
    //创建首页
    this.createPagerItem("first "+ disabled,this.options.firstText);
    //创建第一页
    this.createPagerItem("prev "+disabled,this.options.prevText);
    //创建数字页码
    this.createNumbers();
    
    //得到总页码
    var pageNumber = this.getPageNumber();
    //创建下一页
    disabled=''
    if(this.options.current>=pageNumber){
        disabled="disabled"
    }
    this.createPagerItem("next "+ disabled,this.options.nextText);
    
    //创建尾页
    this.createPagerItem("last "+ disabled,this.options.lastText);
    //创建页码文本
    var span= document.createElement('span');
    span.innerHTML = `<i>${this.options.current}</i>/<i>${pageNumber}</i>`;
    this.options.container.appendChild(span);
}
//创建数字页码
Pager.prototype.createNumbers = function (){
    //要显示最小数字
    var min = this.options.current - Math.floor(this.options.pannelNumber/2);
    if(min<1){
        min=1;
    }
    //要显示的最大数字
    var max = min + this.options.pannelNumber-1;
    var pageNumber = this.getPageNumber();
    if(max>pageNumber){
        max=pageNumber;
    }
    for (var i=min;i<=max;i++){
        var cls='';
        if(i===this.options.current){
            cls="active"
        }
        this.createPagerItem('number '+cls,i)
    }
}
//创建单个页码
Pager.prototype.createPagerItem=function(extraClassName,content){
    var a = document.createElement('a');
    a.className="pager-item " + extraClassName;
    a.innerText= content;
    this.options.container.appendChild(a);
}
//得到最大页码
Pager.prototype.getPageNumber= function(){
    return Math.ceil( this.options.total / this.options.limit);
}

//注册事件
Pager.prototype.registEvent = function(){
    var that = this;
    this.options.container.addEventListener('click',function(e){
        if(e.target.classList.contains("first")){
            that.toPage(1);  
        }
        else if(e.target.classList.contains("prev")){
            that.toPage(that.options.current-1);  
        }
        else if(e.target.classList.contains("next")){
            that.toPage(that.options.current+1);  
        }else if(e.target.classList.contains('last')){
            that.toPage(that.getPageNumber());
        }else if(e.target.classList.contains('number')){
            that.toPage(+e.target.innerText);
        }

    })
}

//跳转到指定页码
Pager.prototype.toPage = function(newPage){
    //最大页码
    var pageNumber = this.getPageNumber();
     if(newPage<1){
         newPage=1;
     }else if(newPage >pageNumber ){
         newPage=pageNumber;
     }
     if (this.options.current==newPage){
         return;
     }
     
     this.options.current=newPage;
     this.show();
     if(this.options.onPageChange){
         this.options.onPageChange(newPage);
     }
}