// pages/my/feedback/feedback.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoUrl: "",
    poster: "",
    name: "",
    category: "",
    clickFlag: true //防重复点击 

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  submitt: function () {
    var recordid = this.data.recordid;
    wx.request({
      url: app.serverUrl + '/doMotion',
      method: "POST",
      data: {
        recordid: recordid,
      },
      header: {
        'content-type': "application/x-www-form-urlencoded", //默认值
        'cookie': wx.getStorageSync("csrftoken") + '; ' + wx.getStorageSync("sessionid"),
        'X-CSRFToken': wx.getStorageSync("csrftoken").split(';')[0].split('=')[1]
      },
      success: function (res) {
        //let data = JSON.parse(res.data)
        if (res.data.returnCode == 200) {
          wx.showToast({
            title: '提交成功',
            image: '',
            duration: 1500,
          })
          wx.navigateBack({
            url: "../sport"
          })
        }
      },
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
    let recorditem = wx.getStorageSync('recorditem')
    let statusList = ["识别失败","未开始","识别中","识别完成"];
    let N = recorditem.motion.name
    let statusName = statusList[recorditem.status+1];
    console.log(statusName)
   
    let categoryName = "";
    if (recorditem.motion.category == "static") {
      categoryName = "静态识别";
    } else {
      categoryName = "动态识别";}
      this.setData({
        name: N,
        category: categoryName,
        explains: recorditem.motion.explains,
        status: recorditem.status,
        statusName: statusName,
        suggest: recorditem.suggest,
        fail_reason: recorditem.fail_reason
      })
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  /**
   * 返回
   */
  back: function () {
    wx.navigateBack({
      url: '../record'
    })
  },

  /**
   * 进入详细页面
   */
  more:function(){
    console.log(this.data.category)
    if(this.data.category == "静态识别")
      wx.navigateTo({
        url: './more/more'
      })
    else{
      wx.navigateTo({
        url: './more2/more'
      })
    }
  
    
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




})