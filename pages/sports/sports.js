// pages/sports/sports.js

let staticPageNumber = 20;

// 空白页tip
function getEmptyTip(index) {
  return ["无动态识别动作", "无静态识别动作"][index % 2];
}

// 分页 list
class TabItem {
  constructor(title) {
    this.title = title;            // 标题
    this.list = [];                // 数据列表
    this.placeholder = "点击刷新";  // 占位提示（刷新、网络错误、空白）
    this.load_type = 0;            // 0表示不显示，1表示加载中，2表示已加载全部
  }
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      new TabItem("动态识别"),
      new TabItem("静态识别"),
    ],
    stv: {
      windowWidth: 0,
      lineWidth: 0,
      offset: 0,
      tStart: false
    },
    activeTab: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try {
      let { tabs } = this.data;
      var res = wx.getSystemInfoSync()
      this.windowWidth = res.windowWidth;
      this.data.stv.lineWidth = res.windowWidth / this.data.tabs.length;
      this.data.stv.windowWidth = res.windowWidth;
      this.setData({ stv: this.data.stv })
      this.tabsCount = tabs.length;
    } catch (e) {
      // 
    }
  },
  
  
  // 刷新
  refresh(e) {
    let currentIndex = e.currentTarget.dataset.index;
    let currentTab = this.data.tabs[currentIndex];
    if (currentTab.list.length <= 0) {
      this.loadCouponsAtIndexRefresh(currentIndex);
    }
  },

  loadCouponsAtIndexRefresh(index = 0, isRefresh = true) {
    //console.log(this.data.activeTab);
    // loading
    wx.showLoading({
      title: '加载中',
    });// 显示加载更多
    if (!isRefresh) {
      // 已经加载全部，则不再请求
      let config = this.data.tabs[index];

      // 已经全部加载完毕
      if (!config.load_type == 2) {
        return;
      }
      var tabs = this.data.tabs;
        tabs[index].load_type = 1;
      this.setData({
        tabs: tabs
      })
    }
      var tabs = this.data.tabs;
      tabs[index].load_type = 1;
      this.setData({
        tabs: tabs
      })
      wx.hideLoading();
      //  访问
      var that = this ; 
      var current = parseInt(index / staticPageNumber) + 1;
      var category = ["dynamic","static"];
      var BaseUrl = "http://127.0.0.1:8000/api/xadmin/v1/video_category";
      //console.log(this.data.activeTab);
      //console.log(category[that.data.activeTab]);
      wx.request({
        url: BaseUrl,
          data: {current: current, pageSize: staticPageNumber,category:category[that.data.activeTab],status:"finish"},
          method: 'GET',
          success: function(res){
            var List = [];
            for (let i = 0; i < res.data.total; i++){
              var itemData = res.data.data[i]
              List.push({ id:itemData.id,title: itemData.name, image_url: itemData.image_url,explains:itemData.explains,file:itemData.file})
            }
            let item = that.data.tabs[index];
            var tips = item.placeholder;
            var list = item.list;
            if (List && List.length > 0) {
            if (isRefresh) {
              list = List;
            } else {
              list.push(...List);
            }}
            else {
              tips = getEmptyTip(index);
            }
            that.data.tabs[index].load_type = res.data.total < staticPageNumber ? 2 : 0;
            that.data.tabs[index].list = list;
            that.setData({
              tabs: tabs
            });
          },
          fail: function(res){
            tips = res.msg.length > 0 ? res.msg : "网络错误";
          },
      });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 加载更多
  loadMore(e) {
    let currentIndex = e.currentTarget.dataset.index;
    let currentTab = this.data.tabs[currentIndex];
    if (currentTab.list.length > 0 && currentTab.load_type != 2) {
      this.loadCouponsAtIndexRefresh(currentIndex, false);
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.loadCouponsAtIndexRefresh();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
   // 手势开始
   handlerStart(e) {
    let { clientX, clientY } = e.touches[0];
    this.startX = clientX;
    this.tapStartX = clientX;
    this.tapStartY = clientY;
    this.data.stv.tStart = true;
    this.tapStartTime = e.timeStamp;
    this.setData({ stv: this.data.stv })
  },
  // 手势移动
  handlerMove(e) {
    let { clientX, clientY } = e.touches[0];
    let { stv } = this.data;
    let offsetX = this.startX - clientX;
    this.startX = clientX;
    stv.offset += offsetX;
    if (stv.offset <= 0) {
      stv.offset = 0;
    } else if (stv.offset >= stv.windowWidth * (this.tabsCount - 1)) {
      stv.offset = stv.windowWidth * (this.tabsCount - 1);
    }
    this.setData({ stv: stv });
  },

 
  // 手势取消
  handlerCancel(e) {

  },

  // 滑动手势完成
  handlerEnd(e) {
    let { clientX, clientY } = e.changedTouches[0];
    // 如果是点击手势，则屏蔽当前手势的事件处理
    if (Math.abs(this.tapStartX - clientX) < 1 && Math.abs(this.tapStartY - clientY) < 1) {
      return;
    }
    // 阻止干预scrollview的上下滑动体验
    if (Math.abs(this.data.stv.offset - 0) < 1 || Math.abs(this.data.stv.offset - this.data.windowWidth) < 1) {
      return;
    }
    let endTime = e.timeStamp;
    let { tabs, stv, activeTab } = this.data;
    let { offset, windowWidth } = stv;

    //快速滑动
    if (endTime - this.tapStartTime <= 300) {
      //向左
      if (Math.abs(this.tapStartY - clientY) < 50) {
        if (this.tapStartX - clientX > 5) {
          if (activeTab < this.tabsCount - 1) {
            let page = ++activeTab;
            this.reloadPageIfEmpty(page);
            this.setData({ activeTab: page })
          }
        } else {
          if (activeTab > 0) {
            let page = --activeTab;
            this.reloadPageIfEmpty(page);
            this.setData({ activeTab: page })
          }
        }
        stv.offset = stv.windowWidth * activeTab;
      } else {
        //快速滑动 但是Y距离大于50 所以用户是左右滚动
        let page = Math.round(offset / windowWidth);
        if (activeTab != page) {
          this.setData({ activeTab: page })
          this.reloadPageIfEmpty(page);
        }
        stv.offset = stv.windowWidth * page;
      }
    } else {
      let page = Math.round(offset / windowWidth);

      if (activeTab != page) {
        this.setData({ activeTab: page })
        this.reloadPageIfEmpty(page);
      }
      stv.offset = stv.windowWidth * page;
    }

    stv.tStart = false;
    this.setData({ stv: this.data.stv })
  },

  // item点击
  itemTap(e) {
    console.log(e.currentTarget)
    let currentIndex = this.data.activeTab;
    let Category = this.data.tabs[currentIndex].title
    var motion = {id:e.currentTarget.dataset.item.id,name:e.currentTarget.dataset.item.title,category:Category,explains:e.currentTarget.dataset.item.explains,videoUrl:e.currentTarget.dataset.item.file}
    wx.setStorageSync('motion', motion);
    wx.navigateTo({
      url: 'do/do',
    })
    //console.log(e.currentTarget.dataset);
    //console.log(e.currentTarget.dataset.item.status);
  },

  // 更新选中的page
  updateSelectedPage(page) {
    // 屏蔽重复选中
    if (this.data.activeTab == page) {
      return;
    }
    let { tabs, stv, activeTab } = this.data;
    activeTab = page;
    this.setData({ activeTab: activeTab })
    stv.offset = stv.windowWidth * activeTab;
    this.setData({ stv: this.data.stv })
    this.reloadPageIfEmpty(page);
  },

  reloadPageIfEmpty(page) {
    // 重新请求
    if ( this.data.tabs[page].list.length <= 0) {
      this.loadCouponsAtIndexRefresh(page);
    }
  },

  // item view 点击
  handlerTabTap(e) {
    this.updateSelectedPage(e.currentTarget.dataset.index);
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

  }
})