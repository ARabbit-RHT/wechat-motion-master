const app=getApp()

Page({
  //定义全局变量data
  data: {

  },
  //跳转注册页面
  goRegister: function () {
    wx.redirectTo({
      url: '../register/register',
    })
  },

  //普通登录
  doLogin: function (e) {
    var formObject = e.detail.value;
    //console.log(formObject);
    var username = formObject.username;
    var password = formObject.password;
    //简单验证
    if (username.length == 0 || password.length == 0) {
      wx.showToast({
        title: '用户名或密码不能为空',
        icon: 'none',
        duration: 3000
      })
    } else {
      var serverUrl = app.serverUrl;
      wx.request({
        url: serverUrl+'/login',
        method: "POST",
        data: {
          'type':'userLogin',
          username: username,
          password: password
        },
        header: {
          'content-type': 'application/json' //默认值
        },
        success: function (res) {
            if(res.statusCode==200){
             //登录成功
             if(res.data.status==200){
              wx.showToast({
                title: "登录成功",
                icon: 'success',
                duration: 3000
              });
              wx.setStorageSync('csrftoken', res.cookies[0])
              wx.setStorageSync('sessionid', res.cookies[1])
              app.globalData.userid = res.data.data.userid;
              setTimeout(function () {
                wx.switchTab({
                              url: "/pages/sports/sports",
                            })
                          },2000)
             }
            }
             else{
              wx.showToast({
                title: res.data.fields_errors.message[0],
                icon: 'none',
                duration: 3000
              })
             }
        },
      })
    }
  },
  // 微信登录  
  goWxLogin: function (e) { 
    wx.login({
      success: function (res) {
        var code = res.code;
        wx.request({
          url: app.serverUrl+'/login',
          data:{"code":code,"type":"wxLogin"},
          header: {
            'content-type': 'application/json' //默认值
          },
          method: "POST",
            success: function (res) {
              if(res.statusCode==200){
               //登录成功
               if(res.data.status==200){
                wx.showToast({
                  title: "登录成功",
                  icon: 'success',
                  duration: 3000
                });
                wx.setStorageSync('csrftoken', res.cookies[0])
                wx.setStorageSync('sessionid', res.cookies[1])
                app.globalData.userid = res.data.data.userid;
                setTimeout(function () {
                      wx.switchTab({
                                    url: "/pages/sports/sports",
                                  })
                                },2000)
               }
              }
               else{
                 console.log(res)
                 var openid = res.data.fields_errors.openid;
                 console.log(openid)
                wx.showModal({
                  title: '提示',
                  content: '未绑定用户，确认是否随机初始化？',
                  success: function (sm) {
                    if (sm.confirm) {
                        wx.request({
                          url: app.serverUrl+'/login',
                          method: "POST",
                          data: {
                            'type':'register',
                            openid: openid
                          },
                          header: {
                            'content-type': 'application/json' //默认值
                          },
                          success: function (res) {
                              if(res.statusCode==200){
                               //登录成功
                               if(res.data.status==200){
                                wx.showToast({
                                  title: "登录成功",
                                  icon: 'success',
                                  duration: 3000
                                });
                                wx.setStorageSync('csrftoken', res.cookies[0])
                                wx.setStorageSync('sessionid', res.cookies[1])
                                app.globalData.userid = res.data.data.userid;
                                setTimeout(function () {
                                  wx.switchTab({
                                    url: "/pages/sports/sports",
                                  })
                                },2000)}
                              }
                          },
                        })
                      } else if (sm.cancel) {
                        console.log('用户点击取消')
                      }
                    }
                  })
               }
          }
        })
      }
    })
  },

  /**
   * 忘记密码
   */
  forgetPassword:function(params) {
    wx.redirectTo({
      url: '../forget/forget_password',
    })
  }
})