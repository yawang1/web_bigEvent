$(function () {
    $('#go_reg').on('click', () => {
        $('.ct_login').stop().hide();
        $('.ct_reg').stop().show();
    })
    $('#go_login').on('click', () => {
        $('.ct_login').stop().show();
        $('.ct_reg').stop().hide();
    })
    // 验证密码的规则
    var form = layui.form;
    form.verify({
        pwd: [    //密码验证
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
        ],
        // 此处的value就是表单用户输入的值
        repwd: value => {
            if(value !== $('#pwd').val()){
                return '两次输入密码不一致！'
            }
        }
    })
    // 监听注册表单的提交事件
    $('#form-reg').on('submit',function(e){
        e.preventDefault();
        var data = $(this).serialize();
        $.post('/api/reguser',data,res=>{
            console.log(res);
        })
    })
})