
const app=getApp()

Page({

  data: {
    option:{
      email:"test@qq.com"
    },
  },
  onLoad:function(params) {
    console.log(params)
    this.setData({
      option:params
    })
  },
  //确认
  confirm: function(e){
    var formObject=e.detail.value;
    var code = formObject.code;
    var password1 = formObject.password1;
    var password2 = formObject.password2;
    var email = this.data.option.email;
    //简单验证
    if (code.length == 0 || password1.length == 0 || password2.length == 0){
      wx.showToast({
        title: '确保信息不能为空',
        icon: 'none',
        duration: 3000
      })
    }
    else if(password1!=password2){
      wx.showToast({
        title: '密码不一致',
        icon: 'none',
        duration: 3000
      })
    }
    else{
      var serverUrl=app.serverUrl;
      wx.request({
        url: serverUrl+'/register',
        method: "POST",
        data: {
          type:"forgetpassword",
          step:2,
          code: code,
          password: password1,
          email:email
        },
        header:{
          'content-type': 'application/json' //默认值
        },
        success: function(res){
          console.log(res)
          if(res.statusCode==200){
            //登录成功
            if(res.data.status==200){
              wx.showToast({
                title: "修改成功",
                icon: 'none',
                duration: 3000
              })
              setTimeout(function () {
              wx.redirectTo({
                url: '../../login/login',
              })
            }, 2000)
            }
            else{
              wx.showToast({
                title: res.data.message,
                icon: 'none',
                duration: 3000
              })
             }
          }
            
        }
      })
    }
  },
})