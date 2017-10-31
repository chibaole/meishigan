// index.js
//获取应用实例
var common = require('../../../utils/getCode.js')
var Bmob = require("../../../utils/bmob.js");
var app = getApp()
var that;
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
    var that = this
    var userInfo;
    // console.log('通知')
    wx.getUserInfo({
      success: function (res) {
        userInfo = res.userInfo;
        that.setData({
          userInfo: userInfo 
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
    that = this
    console.log('查询数据')
          var user_id =  wx.getStorageSync("user_id")
          var objectId =  user_id
          var me =  new Bmob.User()
          me.id =  objectId
          var Diary = Bmob.Object.extend('reply')
          var query = new Bmob.Query(Diary)
          var messages = [];
          query.equalTo("fid",user_id);
          query.find({
            success:function(res){
                console.log(res)
                for(var i = 0 ; i < res.length; i ++){
                  var obj  = res[i]
                  var message = new Object();

                   message.content = obj.get("message")
                   message.time = obj.createdAt
                  // console.log(time)

                  messages.push(message)

                  res[i].set('is_read',1)
                  res[i].save()
                }
                // var message =  res[0].get('message')
                console.log(messages)
                // var currentTime = res[0].get('')
                that.setData({
                  messages:messages
                })
            }
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
  
  }
})