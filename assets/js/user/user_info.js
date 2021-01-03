$(function () {
    var form = layui.form;
    // 验证用户昵称的规则
    form.verify({
        nickname: function (value) {
            if (value.length < 3) {
                return '你怎么这么短！重新输！'
            }
        }
    })
    // 获取表单数据 渲染页面
    function xuanran() {
        $.ajax({
            type: 'GET',
            url: '/my/userinfo',
            success: res => {
                if (res.status !== 0) return layer.msg('获取数据失败!')
                form.val('quickfz', res.data)
            }
        })
    }
    xuanran();
    // 重置按钮  渲染后台数据
    $('#reset').click(function (e) {
        e.preventDefault();
        xuanran();
    })
    // 修改数据
    $('.layui-form').submit(function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: res => {
                if (res.status !== 0) return layer.msg('更新失败,请重试')
                layer.msg('修改成功啦~！')
                // 当用户修改数据成功时,渲染父页面的头像和用户名
                // window是当前页面窗口 window.parent是夫页面
                window.parent.Getusermsg();
            }
        })
    })

})