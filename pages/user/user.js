const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      username:"用户名",
      image_url:"/imge/logo.png",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
      var serverUrl=app.serverUrl;
      wx.request({
        url: serverUrl+'/user',
        data:{type:"user",id:app.globalData.userid},
        method:'GET',
        header: {
          'content-type': 'application/json' //默认值
        },
        success:function(res){
          console.log(res)
          if(res.statusCode==200){
            let U = res.data.username;
            let I = "http://127.0.0.1:8000/media/"+res.data.image;
            that.setData({
              username :U,
              image_url:I,
            })
           
              //获取
          }
        }
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  /**
   * 修改用户信息
   */
  to_edit:function(){
    console.log(this.url);
    wx.showToast({
      title: "未开放",
      icon: 'none',
      duration: 3000
    })
  },

  /**
   * 退出
   */
  logout:function(){
    var serverUrl = app.serverUrl;
    wx.request({
      url: serverUrl+'/logout',
      method: 'GET',
      success:function(res){   
        if(res.data.status=="ok"){
          console.log(res);
          wx.showToast({
           title: "退出成功",
           icon: 'none',
           duration: 3000
         });
         wx.redirectTo({
          url: '../login/login',
        })
        }
      }
    })
  },

  /**
   * 详细数据
   */
  toMoreRecord:function(){
    wx.showToast({
      title: "未开放",
      icon: 'none',
      duration: 3000
    })
  },
  /**
   * 更新身体数据
   */
  toUpdateBody:function(){
    wx.showToast({
      title: "未开放",
      icon: 'none',
      duration: 3000
    })
  },
  
})

function requestData() {
  //var category = ["dynamic","static"];
  var BaseUrl = "http://127.0.0.1:8000/api/xadmin/v1/record";
wx.request({
url: BaseUrl,
  data: {current: pageIndex, pageSize: 10},
  method: 'GET',
  success: function(res){
    historyArray.push(...res.data.data);
    that.setData({
      items: historyArray,
      hidden: true
    })
    pageIndex = pageIndex + 1;
  },
  fail: function(res){
    wx.showToast({
      title: '加载数据失败',
     })
     that.setData({
      hidden: false
    })
  },
});}