$(function () {
    var layer = layui.layer;
    var form = layui.form;
    initArtList();
    // 渲染文章数据列表
    function initArtList() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: res => {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                var tbstr = template('tpl-list', res)
                $('tbody').html(tbstr)
            }
        })
    }
    // 为添加类别添加点击事件
    var addindex;
    $('#addList').click(function () {
        addindex = layer.open({
            title: '添加文章分类',
            type: 1,
            area: ['500px', '250px'],
            content: $('#tianjia').html()
        });
    })
    // 通过事件委派 给动态添加的表单添加提交事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: res => {
                if (res.status !== 0) {
                    return layer.msg('增加文章失败!')
                }
                layer.msg('增加文章成功!')
                initArtList();
                layer.close(addindex)
            }
        })
    })
    // 通过事件委派 给动态添加的表单添加编辑事件
    var editindex;
    $('tbody').on('click', '#btn-edit', function () {
        editindex = layer.open({
            title: '修改文章分类',
            type: 1,
            area: ['500px', '250px'],
            content: $('#edit').html()
        });
        var id = $(this).attr('data-id')
        $.ajax({
            type: 'GET',
            url: '/my/article/cates/' + id,
            success: res => {
                // console.log(res);
                if(res.status !== 0) return layer.msg('获取信息失败！')
                form.val('form-edit', res.data)
            }
        })
        // 这样写 可以减少一次发送ajax的请求 缓解服务器压力
        // $('[name=name]').val($(this).parents('tr').children().eq(0).html())
        // $('[name=alias]').val($(this).parents('tr').children().eq(1).html())
    })
    // 更新文章数据
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        // console.log($(this).serialize());
        $.ajax({
            type: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: res => {
                if (res.status !== 0) {
                    return layer.msg('更新失败了耶！')
                }
                layer.msg('更新成功了耶！')
                layer.close(editindex)
                initArtList();
            }
        })
    })
    // 删除文章
    $('tbody').on('click', '#del', function () {
        var id = $(this).attr('data-id');
        console.log(id);
        layer.confirm('确定要删人家嘛?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                type: 'GET',
                url: '/my/article/deletecate/' + id,
                success: res => {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    layer.close(index);
                    initArtList();
                }
            })
        });
    })
})