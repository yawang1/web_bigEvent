$(function () {
    var form = layui.form;
    var layer = layui.layer;
    // 或者通过地址存的ID拿到
    // console.log(location.href);
    // 获取当前点击编辑的ID
    var id = localStorage.getItem('id')
    localStorage.removeItem('id')

    // 实现编辑页面功能  获取当前页的文章数据
    getArt();
    // 获取文章的后台数据
    function getArt() {
        $.ajax({
            type: 'GET',
            url: '/my/article/' + id,
            success: res => {
                $('[name=title]').val(res.data.title)
                // $('[name=cate_id]').prop(res.data.cate_id).attr('selected',true)
                    // let value = $('[name=cate_id]').prop(res.data.cate_id).value
                    // console.log(value);
                if ($('[name=cate_id]').prop(res.data.cate_id) === undefined) {
                    layer.msg('这个类别已经被删除了');
                } else {
                    console.log($('[name=cate_id]').prop(res.data.cate_id));
                    let value = $('[name=cate_id]').prop(res.data.cate_id).value
                    $('option').eq(value).attr('selected',true)
                }
                form.render();
                $('[name=content]').val(res.data.content)

                $('#image').attr('src', "http://api-breakingnews-web.itheima.net" + res.data.cover_img)
                // 1. 初始化图片裁剪器
                var $image = $('#image')

                // 2. 裁剪选项
                var options = {
                    aspectRatio: 400 / 280,
                    preview: '.img-preview'
                }

                // 3. 初始化裁剪区域
                $image.cropper(options)
            }
        })
    }

    // 获取文章分类数据
    $.ajax({
        type: 'GET',
        url: '/my/article/cates',
        success: res => {
            if (res.status !== 0) {
                return layer.msg('获取文章分类失败!')
            }
            var selStr = template('tpl-fenlei', res)
            $('[name=cate_id]').html(selStr)
            form.render();
        }
    })
    // 调用 initEditor() 方法，初始化富文本编辑器
    initEditor()

    // 给选择封面按钮绑定点击事件 点击隐藏域
    $('#choose').click(function () {
        $('#hidden').click();
    })
    // 监听隐藏域的改变事件
    $('#hidden').on('change', function (e) {
        // 更换用户裁剪的图片
        var file = e.target.files[0]
        if (file.length == 0) {
            return layer.msg('请选择一张图片')
        }
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })
    // 设置 默认的state值为 '已发布' 当点击存为草稿再更改状态
    var state = '已发布';
    $('#caogao').click(function () {
        state = '草稿'
    })
    // 监听表单的提交事件
    $('#art-form').on('submit', function (e) {
        e.preventDefault();
        // 基于 form 表单，快速创建一个 FormData 对象
        var fd = new FormData($(this)[0]);
        fd.append('state', state)
        fd.append('Id', id)
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                // 调用发表文章的请求函数
                edit(fd)
            })
    })
    function edit(fd) {
        var list = window.parent.document.querySelector('#list')
        var pub = window.parent.document.querySelector('#pub')
        $.ajax({
            type: 'POST',
            url: '/my/article/edit',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: res => {
                if (res.status !== 0) {
                    return layer.msg('修改文章失败!')
                }
                layer.msg('修改成功啦！', {
                    time: 2000,
                    anim: 1
                }, function () {
                    pub.classList.remove('layui-this')
                    list.classList.add('layui-this')
                    location.href = '/article/art_list.html'
                })
            }
        })
    }
})