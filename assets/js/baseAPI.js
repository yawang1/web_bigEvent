// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
  // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
  // options.url = 'http://ajax.frontend.itheima.net' + options.url
  options.url = 'http://api-breakingnews-web.itheima.net' + options.url

  // 只有含my的url地址有获取数据权限
  if (options.url.includes('my')) {
    // 设置响应头 获取本地token值
    options.headers = {
      Authorization: localStorage.getItem('token') || ''
    }
  };
  // 写在base 全局挂载这个函数 阻止用户在地址跳转
  options.complete = e => {
    // 阻止用户不输入账号就进入后台
    if (e.responseJSON.status !== 0 && e.responseJSON.message == '身份认证失败！') {
      // 1、清空token
      localStorage.removeItem('token')
      // 2、强跳转到login页面
      location.href = '/login.html'
    }
  }
})
