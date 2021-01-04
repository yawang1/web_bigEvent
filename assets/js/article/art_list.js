$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }
    xuanran();
    // 渲染文章列表的方法
    function xuanran() {
        $.ajax({
            type: 'GET',
            url: '/my/article/list',
            data: q,
            success: res => {
                var tbstr = template('tpl-table', res)
                $('tbody').html(tbstr)
                page(res.total)
            }
        })
    }
    // 获取分类下拉框数据
    $.ajax({
        type: 'GET',
        url: '/my/article/cates',
        success: res => {
            var flstr = template('tpl-fenlei', res)
            $('#fenlei').html(flstr)
            // 告诉layui 我获取完数据了 需要你再渲染一次
            form.render();
        }
    })
    // 给筛选表单绑定提交事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        var cate_id = $('#fenlei').val()
        var state = $('[name=state]').val()
        q.cate_id = cate_id
        q.state = state
        xuanran();
    })
    // 渲染分页的方法
    function page(total) {
        laypage.render({
            elem: 'page', //注意，这里的 page 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum,   //页码数
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump: function (obj, first) {
                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 如果 first 的值为 true，证明是方式2触发的
                // 否则就是方式1触发的
                // 拿到最新的页码值
                q.pagenum = obj.curr
                // 拿到最新的条目数量
                q.pagesize = obj.limit
                if (!first) {
                    xuanran();
                }
            }
        });
    }
    // 给表格元素绑定删除事件 删除文章
    $('tbody').on('click', '.del', function () {
        var id = $(this).attr('data-id')
        // 得到页面上还有几条数据  有几个删除按钮就是有几条数据
        var len = $('.del').length
        layer.confirm('T.T 真的要删人家嘛?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: res => {
                    if (res.status !== 0) return layer.msg('你删不掉,略略略~')
                    layer.msg('你把我删了,呜呜~')
                    // 如果页面只有一个数据 把它删除后 需要让页面跳转到上一页再渲染
                    if (len == 1) {
                        q.pagenum = q.pagenum == 1 ? q.pagenum : q.pagenum - 1
                    }
                    xuanran();
                    layer.close(index);
                }
            })
        });
    })

})