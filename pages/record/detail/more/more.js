// pages/my/feedback/feedback.js
const app = getApp()
const color = ['0,255,255','127,255,212','0,0,0','0,0,255','138,43,226','165,42,42','127,255,0','0,0,139','154,205,50']
const line_options = {
  data: [],
  xLabel: [],
  style: 'line',
  lineStyle: 'curve',
  xWordsCnt: 2,
  xRows: 2,
  area: true,
  showTooltip: true,
  tooltip: '{a}：{b}',
  showLabel: true,
};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoUrl: "http://127.0.0.1:8000/media/3.mp4",
    poster: "",
    name: "",
    category: "",
    select_options: [],
    user_data:[],
    standard_data:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let recorditem = wx.getStorageSync('recorditem')
    let N = recorditem.motion.name
    let categoryName = "";
    let videoUrl = initVideo(recorditem.id);
    if (recorditem.motion.category == "static") {
      categoryName = "静态识别";
    } else {
      categoryName = "动态识别";}
      this.setData({
        name: N,
        category: categoryName,
        videoUrl:videoUrl
      })
      console.log(app.globalData.userid)
      initData(app.globalData.userid,recorditem.id,recorditem.motion.id).then((result) =>{ 
      //initData(6,41,2).then((result) =>{ 
        console.log(result)
        
        this.setData({
          select_options : result.select_options_data,
          user_data : result.user_data,
          standard_data:result.standard_data
        })
        line_options.xLabel.push('0');
        for(let i=0;i<result.user_data[0].data.length;i++)
        line_options.xLabel.push('');
        var __score_data = [{ name: "时长", value: result.score_data.total_data, color: "#80e0ed" },
        { name: "不太标准", value: result.score_data.not_good_all, color: "#9197ed" },
        { name: "标准", value: result.score_data.good, color: "#00FF00" },
        { name: "不标准", value: result.score_data.bad, color: "#FF0000" }]
        var rose_options = {
          data: __score_data,
          legend: '{c}',
          chartRatio: 0.95,
          style: 'rose',
          showLegend: true,
          showLabel: true,
          animation: true,
          showTooltip: true,
          tooltip: '{a}：{b}',
        }
        this.roseComp = this.selectComponent('#rose');
    this.roseComp.setOptions(rose_options);
    this.roseComp.initChart(295, 213);
        //line_options.data = [result.user_data[0],result.standard_data[0]];
        //this.lineChart.setOptions(line_options);
        //this.lineChart.initChart(295, 213);
      
      })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
/**
   * 下拉框选择完成事件
   */
  select: function (even) {
    console.log(even.detail.id)
    line_options.data = [this.data.user_data[even.detail.id],this.data.standard_data[even.detail.id]];
    this.lineChart = this.selectComponent('#line');
    this.lineChart.setOptions(line_options);
    this.lineChart.initChart(295, 213);
    
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
      url: '../detail'
    })
  },

  /**
   * 进入详细页面
   */


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

function initData(user_id,record_id,motion_id) {
  return new Promise((resolve, reject) => {
  wx.request({
    url: app.serverUrl + '/record',
    method: "GET",
    data: {
      user_id:user_id,
      category:"static",
      record_id:record_id,
      motion_id:motion_id
    },
    header: {
      'content-type': "application/x-www-form-urlencoded", //默认值
      'cookie': wx.getStorageSync("csrftoken") + '; ' + wx.getStorageSync("sessionid"),
      'X-CSRFToken': wx.getStorageSync("csrftoken").split(';')[0].split('=')[1]
    },
    success: function (res) {
      if(res.data){
        var index = 0;
        var select_options_data = []
        var user_data = []
        var standard_data = []
        for(var key in res.data.user)
        {
          var index_str = index+"";
          var dict_option = {"id":index_str,"value":key};
          var dict_user_data = {"name":key,"data":res.data.user[key],"color":'rgb('+color[index]+')'}
          select_options_data.push(dict_option);
          user_data.push(dict_user_data);
          var each_standard_data = []
          for(let i=0;i<res.data.user[key].length;i++)
          each_standard_data.push(res.data.standard[index]);
          var dict_standard_data = {"name":"标准","data":each_standard_data,"color":'rgb(255,0,0)'}
          standard_data.push(dict_standard_data);
          index+=1;
        }
        resolve({"select_options_data":select_options_data,"user_data":user_data,"standard_data":standard_data,"score_data":res.data.score_data});
      }
      }
  })
});
}
function initVideo(id) {
    var http = "http://127.0.0.1:8000/record/"+app.globalData.userid+"/"+id+"/result.mp4";
    return http;
}