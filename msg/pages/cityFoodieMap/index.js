// pages/isme/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoading: true,
    myInfo: {
      myId: "研究员333号·",
      conVal: 322,
      niceVal: 43,
      labels: [{ labText: "肉丝爱好者" },
      { labText: "奶爸" },
      { labText: "咖啡" },
      { labText: "老陈醋" },
      { labText: "奶爸无奶" },
      { labText: "咖啡" }]
    },
    articles: [
      {
        title: "吃饱了不能睡",
        authorName: "小马",
        likeNum: 99,
        commentNum: 120
      },
      {
        title: "吃饱了还想吃",
        authorName: "小喵",
        likeNum: 19,
        commentNum: 10
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */


  onLoad: function (options) {
    console.log("真的好烦")

    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo,
        showLoading: false
      })
    })
    console.log(this.data.userInfo)

    // wx.showModal({
    //   title: '提示',
    //   content: '这是一个模态弹窗',
    //   success: function (res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //     } else if (res.cancel) {
    //       console.log('用户点击取消')
    //     }
    //   }
    // })
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
  confirm: function () {
    console.log("点击了确定")
    this.setData({
      dialog: false
    })
  },
  edit: function () {
    console.log("点击了编辑")
    this.setData({
      dialog: true
    })
  }

})