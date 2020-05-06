var dl = document.querySelector('dl');
var formAdd = document.getElementById('form-add'); 
var btnAdd= document.getElementById('student-add-btn'); //新增表单提交按钮
var editBtn = document.getElementById('list-edit'); //编辑按钮
var model = document.getElementById('model');//遮罩层
var closeBtn = document.querySelector('.model .header span');
var tbody = document.querySelector('#student-list table tbody');
var tableArr=[]; //定义一个数组，用来保存学生列表数据
var formEdit = document.getElementById('form-list');
var nowPage = 1; //当前第几页
var pageSize = 2; //每页显示的条数
var allPage = 1; //总页数
//点击左侧菜单栏事件
dl.onclick = function(e){
    if(e.target.tagName == 'DD'){
        var activeBtn = document.querySelector('.active');
        if(e.target.classList=='active'){//如果当前点击dom对象有active类，那就不做任何处理
            return;
        }else{
            //如果没有，那就添加active，并且删除除了当前dom元素以外的active
            e.target.classList.add('active');
            activeBtn.classList.remove('active');
            var contentBox = document.getElementsByClassName('content-box');
            for (var i=0;i<contentBox.length;i++){
                contentBox[i].style.display='none';
                document.getElementById(e.target.dataset.id).style.display='block';
            }
        }
    }
}

//获取新增学生表单提交数据
function getStudentData(formData){
     var name=formData.name.value;
     var sex=formData.sex.value;
     var sNo=formData.sNo.value;
     var email=formData.email.value;
     var birth=formData.birth.value;
     var phone=formData.phone.value;
     var address=formData.address.value;
     //表单校验
     if(!name || !sNo || !sex || !address || !email || !birth || !phone ){
         alert('信息填写不全，请检查后提交');
         return;
     }
     if(!(/^\d{4,16}$/.test(sNo))){
         alert('学号应为4-16位数字组成');
         return;
     }
     if(!(/\w+@\w+\.com$/.test(email))){
         alert('邮箱格式不正确');
        return;
     }
     if(!(/^\d{4}$/.test(birth))){
         alert('出生年份格式有误');
         return;
     }
     if(!(/^\d{11}$/.test(phone))){
        alert('手机格式有误');
        return;
     }
     return {
        name,
        sex,
        sNo,
        email,
        birth,
        phone,
        address
     };
}

//像后端发送新增学生数据
btnAdd.onclick = function(e){
    // 阻止默认表单提交事件
    e.preventDefault();
    //e.stopPropagation();
    //获取数据
    var data=getStudentData(formAdd);
    //数据拼接
    transferData('/api/student/addStudent',data,function(){
        alert('添加成功');
        //模拟点击学生列表
        var studentList = document.getElementsByTagName('dd')[0];
        studentList.click();
        getALlStudent();
        formAdd.reset();
    })

    // var param = Object.assign({
    //     appkey:'sunyanmin_1586171551610'
    // },data)
    // console.log(param);
    // var result = saveData('http://open.duyiedu.com/api/student/addStudent',param);
    // if(result.status=='success'){
    //     alert('添加成功');
    //     //模拟点击学生列表
    //     var studentList = document.getElementsByTagName('dd')[0];
    //     studentList.click();
    //     getALlStudent();
    //     formAdd.reset();
    // }else{
    //     alert(result.msg);
    // }
    
}
//点击编辑按钮事件,这个事件有问题，不可以直接添加到按钮身上，应该利用事件委托，加到父级身上
//这样，当页面重新渲染新增数据时，该按钮就会有事件了
tbody.onclick=function(e){
    if(e.target.tagName=='BUTTON' && e.target.classList.contains('list-edit')){//编辑事件
        var isEdit = e.target.classList.contains('list-edit');
        var index = e.target.dataset.index;
        if(isEdit){
            model.style.display='block';
            //编辑表单回填
            renderEditForm(tableData[index]);
        }
    }else if(e.target.tagName=='BUTTON' && e.target.classList.contains('list-remove')){//删除事件
        //获取点击删除当前按钮行的学号
         var data = e.target.parentElement.parentElement.firstElementChild.innerText;
         var isDel = confirm('确认删除？');
         if(isDel){
            //调用删除数据的接口
            removeData({
                sNo:data
            });
            getALlStudent();
        }
    }
}

//编辑表单按钮提交事件
var editFormBtn = document.getElementById('student-edit-btn');
editFormBtn.onclick = function(e){
    e.preventDefault();
    //向后端发送请求
    editData();
}
//获取需要修改的学生数据
function renderEditForm(data){
    for(var prop in data){
        if(formEdit[prop]){
            formEdit[prop].value = data[prop];
        }
    }
}
//修改数据接口方法
function editData(){
     //获取表单数据
     var data=getStudentData(formEdit);
     //发送修改后的数据给后端
    //  var param=Object.assign({
    //     appkey:'sunyanmin_1586171551610'
    //  },data)
    //  var result =saveData('http://api.duyiedu.com/api/student/updateStudent',param);
    //  if(result.status=='success'){
    //      alert('修改成功');
         
    //  }else{
    //      alert(result.msg);
    //  }

    transferData('/api/student/updateStudent',data,function(){
        alert('修改成功');
    });
     getALlStudent();
     model.style.display='none';
}
//删除数据接口方法
function removeData(data){
    // console.log(data);
    // var param = Object.assign({
    //     appkey:'sunyanmin_1586171551610',
    // },data)
    // var result=saveData('http://api.duyiedu.com/api/student/delBySno',param);
    transferData('/api/student/delBySn',data,function(){
        alert('删除成功');
    })

}
//关闭遮罩层按钮事件
closeBtn.onclick=function(){
    model.style.display='none';
}


//点击上一页按钮事件
var prevBtn = document.getElementById('prev');
var nextBtn = document.getElementById('next');

//分页按钮事件
prevBtn.onclick = function (){
    if(nowPage <=1){
        nowPage=1;
       
    }else{
        nowPage --;
        getALlStudent();
    }
}
nextBtn.onclick = function (){
    if( nowPage < allPage){
        nowPage ++;
        getALlStudent();
    }else{
        nowPage=allPage;
    }
    
    
}
//分页展示学生信息
function getALlStudent(){
    // var param = Object.assign({
    //     appkey:'sunyanmin_1586171551610',
    //     page:nowPage,
    //     size:pageSize
    // })
    // var result=saveData('http://api.duyiedu.com/api/student/findByPage',param);
    // var data = result.data;
    transferData('/api/student/findByPage',{
        page:nowPage,
        size:pageSize
    },function(data){
        //获取所有的页数
        allPage = Math.ceil(data.cont / pageSize);
        //把获取到的学生列表数据保存到数组中
        tableData=data.findByPage;
        //获取到数据之后渲染学生列表
        render(tableData || []);
    })
    
    
}


getALlStudent();
//渲染学生列表方法
function render(studentArr){
    var str='';
    studentArr.forEach(function(ele,index){
        str +=`<tr>
                    <td>${ele.sNo}</td>
                    <td>${ele.name}</td>
                    <td>${ele.sex == '0' ? '男' : '女'}</td>
                    <td>${ele.email}</td>
                    <td>${new Date().getFullYear() - ele.birth}</td>
                    <td>${ele.phone}</td>
                    <td>${ele.address}</td>
                    <td>
                    <button class="list-btn list-edit" id='list-edit' data-index=${index}>编辑</button>
                    <button class="list-btn list-remove" id='list-remove' data-index=${index}>删除</button>
                    </td>
                </tr>`;
        
    });
    tbody.innerHTML = str;
    
}
//降低代码冗余
function transferData(url,data,callback){
    var result = saveData('https://open.duyiedu.com'+url,Object.assign({
        appkey:'sunyanmin_1586171551610',
    },data))
    if(result.status=='fail'){
        alert(result.msg);
    }else{
        callback(result.data);
    }
}



// var s=saveData('http://open.duyiedu.com/api/student/addStudent',{
//     appkey:'sunyanting_1581072528975',
//     sNo:'6666669963',
//     name:'甄嬛',
//     sex:1,
//     birth:1800,
//     phone:13318008888,
//     address:'甄府',
//     email:'1234579@qq.com'
// })
// console.log(s);






// var result=saveData('http://api.duyiedu.com/api/student/findAll','appkey=sunyanting_1581072528975');
// console.log(result);
