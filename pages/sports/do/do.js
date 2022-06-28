// pages/my/feedback/feedback.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoUrl:"",
    poster:"",
    name :"",
    category:"",
    recordid:"",
    clickFlag:true //防重复点击 

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  submitt:function(){
    var recordid = this.data.recordid;
    wx.request({
      url: app.serverUrl+'/doMotion',
      method: "POST",
      data: {
        recordid:recordid,
      },
      header: {
        'content-type':  "application/x-www-form-urlencoded", //默认值
        'cookie': wx.getStorageSync("csrftoken") + '; ' + wx.getStorageSync("sessionid"),
        'X-CSRFToken': wx.getStorageSync("csrftoken").split(';')[0].split('=')[1]
      },
      success: function (res) {
        //let data = JSON.parse(res.data)
        if(res.data.returnCode == 200){
          wx.showToast({
            title: '提交成功',
            image: '',
            duration: 1500,
        })
        wx.navigateBack({
          url:"../sport"
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
    let motion = wx.getStorageSync('motion')
    console.log(motion)
    let N = motion.name
    let C = motion.category
    let videoUrl = motion.videoUrl
    this.setData({
      name:N,
      category:C,
      explains:motion.explains,
      videoUrl:videoUrl

    })

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
   * 拍摄或选择视频并上传服务器
   */
  chooseVideo: function () {
    console.log("chooseVideo")
    this.setData({clickFlag: false})


    let that = this
    //1.拍摄视频或从手机相册中选择视频
    wx.chooseVideo({
      sourceType: ['album', 'camera'], // album 从相册选视频，camera 使用相机拍摄
      // maxDuration: 60, // 拍摄视频最长拍摄时间，单位秒。最长支持60秒
      camera: 'back',//默认拉起的是前置或者后置摄像头，默认back
      compressed: true,//是否压缩所选择的视频文件
      success: function(res){
        //console.log(res)
        let tempFilePath = res.tempFilePath//选择定视频的临时文件路径（本地路径）
        let duration = res.duration //选定视频的时间长度
        let size = parseFloat(res.size/1024/1024).toFixed(1) //选定视频的数据量大小
        // let height = res.height //返回选定视频的高度
        // let width = res.width //返回选中视频的宽度
        that.data.duration = duration
        if(parseFloat(size) > 100){
          that.setData({
            clickFlag: true,
            duration: ''
          })
          let beyondSize = parseFloat(size) - 100
          wx.showToast({
            title: '上传的视频大小超限，超出'+beyondSize+'MB,请重新上传',
            //image: '',//自定义图标的本地路径，image的优先级高于icon
            icon:'none'
          })
        }else{
          //2.本地视频资源上传到服务器
          that.uploadFile(tempFilePath)
        }
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },
  /**
   * 将本地资源上传到服务器
   * 
   */
  uploadFile:function(tempFilePath){
    let that = this
    let userid = app.globalData.userid
    wx.showLoading({
      title: '上传进度：0%',
      mask: true //是否显示透明蒙层，防止触摸穿透
    })
    const uploadTask = wx.uploadFile({
      url: app.serverUrl+'/uploadMotion',//开发者服务器地址
      filePath:tempFilePath,//要上传文件资源的路径（本地路径）
      name:'file',//文件对应key,开发者在服务端可以通过这个 key 获取文件的二进制内容
      // header: {}, // 设置请求的 header
      formData: {
        userid:app.globalData.userid,
        motionid: wx.getStorageSync('motion').id
      }, // HTTP 请求中其他额外的 form data
        header: {
          'cookie': wx.getStorageSync("csrftoken") + '; ' + wx.getStorageSync("sessionid"),
          'X-CSRFToken': wx.getStorageSync("csrftoken").split(';')[0].split('=')[1]
        },
      success: function(res){
        console.log("uploadFile",res)
        // success
        let data = JSON.parse(res.data)
        wx.hideLoading()
        if(data.returnCode == 200){
          that.setData({
            recordid:data.recordid,
            clickFlag:true
          })
          wx.showToast({
            title: '上传成功',
            icon: 'success'
          })
        }else{
          that.setData({
            videoUrl: '',
            poster: '',
            duration: '',
            clickFlag:true
          })
          wx.showToast({
            title: '上传失败',
            icon: 'none'
          })
        }
       
      },
      fail: function() {
        // fail
        wx.hideLoading()
        this.setData({
          videoUrl: '',
          poster: '',
          duration: '',
          clickFlag:true
        })
        wx.showToast({
          title: '上传失败',
          icon: 'none'
        })
      }
    })
    //监听上传进度变化事件
    uploadTask.onProgressUpdate((res) =>{
      wx.showLoading({
        title: '上传进度：'+res.progress+'%',
        mask: true //是否显示透明蒙层，防止触摸穿透
      })
      console.log("上传进度",res.progress)
      console.log("已经上传的数据长度，单位 Bytes:",res.totalBytesSent)
      console.log("预期需要上传的数据总长度，单位 Bytes:",res.totalBytesExpectedToSend)
    })
  },
})