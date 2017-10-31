// pages/ALL/thr/index.js
var common = require('../../../utils/common.js')
var app = getApp()
var Bmob = require("../../../utils/bmob.js")
var that
var question
var answer
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { question: '你吃过最贵的一顿饭是什么？你觉得值得么？' },
      { question: '你最擅长的美食中的哪个领域呢，为什么？' },
      { question: '你对美食有什么特殊的看法，说来听听？' },
      { question: '你晚餐吃什么，那完美的晚餐应该是怎样的?' },
      { question: '你吃过最贵的一顿饭是什么，感觉如何？' },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  radioChange: function (e) {
    console.log(e)
    question = e.detail.value//选择的问题
    this.setData({
      question: question
    })

    // this.onLoad()

  },
  choosePic: function () {//选择图标
    that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        // console.log()
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)

        that.setData({
          isSrc: true,
          src: tempFilePaths
        })
      }
    })

  },
  clearPic: function () {//删除图片
    that = this;
    that.setData({
      isSrc: false,
      src: ""
    })
  },
  formSubmit: function (e) {
    that = this
    console.log(e)
    question = e.detail.value.question

    console.log(question)
    if (question == '' || question == undefined) {
      common.dataLoading("请选择一个问题哦", "loading");
    } else {
      wx.getStorage({
        key: 'user_id',
        success: function (ress) {
          var Diary = Bmob.Object.extend("testRes");
          var query = new Bmob.Query(Diary)

          query.equalTo("publisher", ress.data)//查询发布者数据
          query.find({
            success: function (res) {
              console.log(res)
              var id = res[0].id
              
              query.get(id, {//如果已有数据 就修改当前的数据
                success: function (result) {
                  console.log(result)
                  result.set('question', question)
                  result.set("count",'1')
                  result.save();
                  wx.navigateTo({
                    url: '../fou/index',
                  })
                },
                error:function(){
                  wx.showToast({
                    title: '失败',
                    icon: 'loading',
                    duration: 2000
                  })
                }
              })
            }
          })
        }
      })
    }
  }
})