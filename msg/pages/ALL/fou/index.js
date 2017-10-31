// pages/ALL/fou/index.js

var common = require('../../../utils/common.js')
var app = getApp()
var Bmob = require("../../../utils/bmob.js")
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
        
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    wx.getStorage({
      key: 'user_id',
      success: function (ress) {
        var Diary = Bmob.Object.extend("testRes");
        var query = new Bmob.Query(Diary)

        query.equalTo("publisher", ress.data)//查询发布者数据

        query.find({
          success: function (res) {
            console.log(res)
            var question = res[0].get('question')
            console.log(question)
            that.setData({
              question: question 
            })
          }
        })
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

  formSubmit: function (e) {
    that = this
    console.log(e)
    var answer = e.detail.value.answer
    console.log(answer)
    if (answer == '' || answer == undefined) {
      common.dataLoading("请写下你的回答吧", "loading");
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
                  result.set("answer", answer);
                  result.save();
                  wx.navigateTo({
                    url: '../fiv/index',
                  })
                  console.log('到这就好的')

                 
                },
                error: function () {
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
  // goout:function(){
  //   wx.navigateTo({
  //     url: '../fiv/index',
  //     success: function(res) {},
  //     fail: function(res) {},
  //     complete: function(res) {},
  //   })
  // }
})