
const app=getApp()

Page({

  data: {
  },
  //验证
  next: function(e){
    
    var formObject=e.detail.value;
    console.log(formObject);
    var username = formObject.username;
    var email = formObject.email;
    console.log(username.length);
    //简单验证
    if (username.length == 0 || email.length == 0){
      wx.showToast({
        title: '用户名或邮箱不能为空',
        icon: 'none',
        duration: 3000
      })
    }else{
      var serverUrl=app.serverUrl;
      wx.request({
        url: serverUrl+'/register',
        method: "POST",
        data: {
          type:"forgetpassword",
          step:1,
          username: username,
          email: email
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
                title: "验证成功",
                icon: 'none',
                duration: 3000
              })
              setTimeout(function () {
              wx.redirectTo({
                url: './next/next?email='+email,
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