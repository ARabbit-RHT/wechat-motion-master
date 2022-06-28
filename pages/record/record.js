// pages/record/record.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: true,
    imgsrc: "../../icon/refresh.png",
         // 0表示不显示，1表示加载中，2表示已加载全部
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    pageIndex = 1
    historyArray = []

    requestData();
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

    requestData()
  },

  onItemClick: function(event){
    let status = event.currentTarget.dataset.item.status;
    console.log(status)
    let item = event.currentTarget.dataset.item;
    if(status!=0){
      wx.setStorageSync('recorditem', item);
      wx.navigateTo({
      url: 'detail/detail'
    })
    }
    if(status==0){
      wx.showToast({
        icon:"none",
        title:"未开始",
       })
    }
    
  },
  /**
   * 用户点击右上角分享
   */
  clickRetry: function(event){
  }
})

var pageIndex = 1
var that
var historyArray = []

function requestData() {
  var BaseUrl = "http://127.0.0.1:8000/api/xadmin/v1/record";
wx.request({
url: BaseUrl,
  data: {current: pageIndex, pageSize: 10,user:app.globalData.userid},
  method: 'GET',
  success: function(res){
    console.log(res)
    if(res.statusCode != 404){
      
      historyArray.push(...res.data.data);
        that.setData({
          items: historyArray,
          hidden: true
        })
      pageIndex = pageIndex + 1;
    }
      else{
        console.log(res)
        wx.showToast({
          icon:'none',
          title:"已经到底了！",
         })
      }

    
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