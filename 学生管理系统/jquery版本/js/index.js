var tableData=[];
//分页对象
var pager = new Pager({
    total: 0,
    limit:2,
    current:1,
    pannelNumber:3,
    onPageChange: function(page){
        this.current=page;
        getTableData();
    }
});
//绑定事件 
function bindEvent(){
    //点击菜单栏事件
    $('.left-menu').on('click','dd',function(e){
        $('.active').removeClass('active');
        $(this).addClass('active');
        var id=$(this).data('id');
        $('.content-box').fadeOut();
        $('#'+id).fadeIn();
    });
    //点击表单提交新增数据按钮
    $('#student-add-btn').on('click',function(e){
        e.preventDefault();
        var formData = formatData($('#form-add').serializeArray());
        //像后端发送请求,拿取用户填写的学生信息
        var data = formData.data;
       if(formData.status=='success'){
        transferData('/api/student/addStudent',data,function(res){
                alert('新增成功');
                //模拟手动点击学生列表以及渲染学生列表数据
                $('.left-menu dd[data-id=student-list]').click();
                getTableData();
        })
       }
    });
    //点击查询按钮事件
    $('#search-btn').click(function(){
        clearTimeout(timer);
        var val=$('#search-inp').val();
        //var sexValue = $('#search-form')[0].sex.value;
        //像后端发送请求
        if(val){
            //pager.options.current=1;
            console.log(pager.options.current);
            searchTableDate(val);
        }else{
            getTableData();
        }
        
    });
    var timer=null;
   //点击input回车健后
   $('#search-inp').on('input',function(){
    clearTimeout(timer);
    timer = setTimeout(function(){
        $('#search-btn').click();
    },500);
   })
   //获取搜索表格数据
   function searchTableDate(val){
    transferData('/api/student/searchStudent',{
        sex:-1,
        search:val,
        page:pager.options.current,
        size:2
    },function(data){
        renderDom(data.searchList)
        console.log(data);
    })
   }
    //删除和编辑
    $('tbody').on('click','#list-edit',function(){
        $('.model').fadeIn();
        //获取当前表格数据
        var index=$(this).parents('tr').index();
        var data=tableData[index];
        $('.model').fadeIn();
        //表格数据回填
        renderEditForm(data);
    }).on('click','#list-remove',function(){
        var index=$(this).parents('tr').index();
        var data=tableData[index].sNo;
        var isDel = confirm('确认删除');
        if(isDel){
            transferData('/api/student/delBySno',{
                sNo:data
            },function(){
                alert('删除成功');
                getTableData();
            })
        }
        
    });
    //表单编辑后提交事件
    $('#student-edit-btn').click(function(e){
        e.preventDefault();
        var formData =formatData($('#form-list').serializeArray());
        var data = formData.data;
        transferData('/api/student/updateStudent',data,function(){
            alert('修改成功');
            $('.model').fadeOut();
            getTableData();
        })
    })
    //关闭编辑表单按钮事件
    $('.model .header span').click(function(){
        $('.model').fadeOut();
    })
}
//按页获取学生列表
function getTableData(){
        return new Promise(resolve=>{
            transferData('/api/student/findByPage',{
                page:pager.options.current,
                size:pager.options.limit
            },function(data){
                tableData=data.findByPage;
                renderDom(data.findByPage);
                 resolve(data);
            })
        })
}


//得到数据总量total
getTableData().then(resp=>{
    pager.options.total=resp.cont;
    //渲染分页组件
    pager.show();
});

//获取所有学生列表
// function getTableData(){
//     //获取数据
//     transferData('/api/student/findAll',{},function(data){
//         tableData=data;
//         //console.log(tableData)
//         renderDom(data);
//     })
// }

//表格数据回填
function renderEditForm(data){
    var form = $('#form-list')[0];
    for (var prop in data){
        if(form[prop]){
            form[prop].value=data[prop];
        }
    }
}
//渲染学生列表
function renderDom(dataArr){
    var str='';
    for (var i=0;i<dataArr.length;i++){
        str += ` <tr>
                <td>${dataArr[i].sNo}</td>
                <td>${dataArr[i].name}</td>
                <td>${dataArr[i].sex=='0' ? '男' :'女'}</td>
                <td>${dataArr[i].email}</td>
                <td>${new Date().getFullYear()- dataArr[i].birth}</td>
                <td>${dataArr[i].phone}</td>
                <td>${dataArr[i].address}</td>
                <td>
                    <button class="list-btn list-edit" id='list-edit'>编辑</button>
                    <button class="list-btn list-remove" id='list-remove'>删除</button>
                </td>
    </tr>`
    }
    $('.right-content table tbody').html(str);
}
//格式化表格 校验数据是否填写全
function formatData(dataArr){
    var result ={
        status:'success',
        data:{},
        msg:''
    };
    for (var i=0;i<dataArr.length;i++){
        if(!dataArr[i].value){
            result.status = 'fail';
            result.msg='信息填写不全';
        }
        result.data[dataArr[i].name]=dataArr[i].value;
    }
    return result;
}
// 数据请求
function transferData(url, data, cb) {
    $.ajax({
        url:'https://open.duyiedu.com'+url,
        type:'get',
        data:$.extend({
            appkey:'zhaolixiang_1581772005468'
        },data),
        dataType:'json',
        success: function(res){
            if(res.status == 'success'){
                cb(res.data);
            }else{
                alert(res.msg);
            }
        }
    })
}

bindEvent();
getTableData();



