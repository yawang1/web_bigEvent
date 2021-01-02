$(function () {
    // 页面一加载获取用户登录信息
    Getusermsg();
    // 实现退出登录操作
    $('#quit').on('click', function () {
        layer.confirm('你确定要离开人家嘛~', { icon: 3, title: '提示' }, function (index) {
            //do something
            localStorage.removeItem('token')
            location.href = '/login.html'
            layer.close(index);
        });
    })
})
// 注意 这个函数一定要定义在入口函数外边 因为子网页中会调用
function Getusermsg() {
    $.ajax({
        type: 'get',
        // headers: {
        //     Authorization: localStorage.getItem('token')
        // },
        url: '/my/userinfo',
        success: res => {
            if (res.status !== 0) return layer.msg('阿哦 ! 获取失败了耶')
            // 渲染用户的头像
            var name = res.data.nickname || res.data.username;
            $('#welcome').html('欢迎  ' + name)
            if (res.data.user_pic == null) {
                // 如果后台没有图片头像 渲染文字图像
                $('.layui-nav-img').hide()
                $('.text-avatar').html(name[0].toUpperCase()).show();
            } else {
                $('.layui-nav-img').attr('src', res.data.user_pic).show()
                $('.text-avatar').html(name[0]).hide();
            }
        },
        // 不论ajax请求成功与否 都会在success后调用complete这个函数
        // complete: e => {
        //     // 阻止用户不输入账号就进入后台
        //     if(e.responseJSON.status !== 0 && e.responseJSON.message =='身份认证失败！'){
        //         // 1、清空token
        //         localStorage.removeItem('token')
        //         // 2、强跳转到login页面
        //         location.href = '/login.html'
        //     }
        // }
    })
}