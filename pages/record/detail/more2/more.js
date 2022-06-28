// pages/my/feedback/feedback.js
const FundCharts = require('../../../../utils/FundCharts.min.js');		// 注意拷FundCharts.min.js
const FundChartsToolTips = require('../../../../utils/FundCharts-tooltips.js');  // 注意拷
const app = getApp()

const LineChart = FundCharts.line;
let line = null;
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
    standard_data:[],
     // line 2 values
     line2Time1: '--',
     line2Sy1: '--',
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
     initData(app.globalData.userid,recorditem.id,recorditem.motion.id).then((result) =>{ 
        this.setData({
          select_options : result.select_options_data,
          user_data : result.user_data,
          standard_data:result.standard_data
        })
        this.setData({
          error:result.score_data.error,
          advice:result.score_data.advice,
          num:result.score_data.num,
          cf:result.cf
        })
        let categories = []
        for(let i=0;i<result.user_data[0].data.length;i++)
        categories.push(i);
    line = new LineChart({
      id: 'chartline',
      yaxisfunc(data) {
        return data.toFixed(0)
      },
      width: 375,
      height: 212,
      noGradient: true,
      grid: {
        yTickLength: 7, // y轴刻度数量
        xTickLength: 5  // x轴刻度数量
      },
      chartLeft: 30,        // 图形区域距离左边距离(px)
      lineWidths: [2],     // 折线粗细
      colors: ['#03c'],   // 折线颜色
      pointStyle: '#f00',			// 点边框颜色
      hoverLineColor: 'orange',		// 触控线的颜色
      xaxis: categories,
      datas: [
        this.data.user_data[0].data,
      ]
    });
    line.init();

    
    })

  },

/**
   * 下拉框选择完成事件
   */
  select: function (even) {
    console.log(even.detail.id)
      line.update({
        datas: [this.data.user_data[even.detail.id].data]
      })
    //line.init();
   // this.lineChart = this.selectComponent('#line');
   // this.lineChart.setOptions(line_options);
    //this.lineChart.initChart(295, 213);
    
  },
  
  /**
   * 返回
   */
  back: function () {
    wx.navigateBack({
      url: '../detail'
    })
  },

  chartTouchstart: function (e) {
    if (e) {
      let event = e.touches[0];
      let index = line.drawer.drawHover(event.x);
      if (index === false) return false;

      let _x = line.opts.xaxis[index],
          _yArr = line.opts.datas;

      this.setData({
        line2Time1: _x,
        line2Sy1: _yArr[0][index].toFixed(0) + '度',
      })
    }
  },
  // line 2 chart demo touch move
  chartTouchmove: function (e) {
    if (e) {
      let event = e.touches[0];
      let index = line.drawer.drawHover(event.x);
      if (!index) return false;

      let _x = line.opts.xaxis[index],
        _yArr = line.opts.datas;

      this.setData({
        line2Time1: _x,
        line2Sy1: _yArr[0][index].toFixed(0) + '度',
      })
    }
  },



})

function initData(user_id,record_id,motion_id) {
  return new Promise((resolve, reject) => {
  wx.request({
    url: app.serverUrl + '/record',
    method: "GET",
    data: {
      user_id:user_id,
      category:"dynamic",
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
          var dict_user_data = {"name":key,"data":res.data.user[key]}
          select_options_data.push(dict_option);
          user_data.push(dict_user_data);
         
          index+=1;
        }
        resolve({"select_options_data":select_options_data,"user_data":user_data,"score_data":res.data.score_data,"cf":res.data.cf});
      }
      }
  })
});
}
function initVideo(id) {
    var http = "http://127.0.0.1:8000/record/"+app.globalData.userid+"/"+id+"/result.mp4";
    //var http = "http://127.0.0.1:8000/record/13/53/result.mp4";
    return http;
}