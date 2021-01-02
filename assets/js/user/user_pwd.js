$(function () {
    var form = layui.form;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        newPwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新密码和旧密码不能相同喔！'
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致！糊弄谁呢？'
            }
        }
    })
    // 这里不能用es6箭头函数
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: res => {
                if(res.status !==0) {
                    return layer.msg('修改失败！请重试')
                }
                layer.msg('恭喜！修改成功啦~',function(){
                    // 修改成功后 清除缓存 跳回登录页面
                    // 这里 方法不管用  明天问老师！！
                    // $('.layui-form')[0].reset()
                    localStorage.removeItem('token');
                    window.parent.location.href = '/login.html'
                })
            }
        })
    })
})