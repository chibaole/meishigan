// index.js
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
        console.log(ress)
        var Diary = Bmob.Object.extend("testRes");
        var query = new Bmob.Query(Diary)
        query.equalTo("publisher", ress.data)//查询发布者数据
        query.find({
          success: function (res) {
            console.log(res)//如果已经参加过考试 就返回false

            // if(res.length !== 0 ){
            //   var count = res[0].get('count')
            //   console.log(count)
            //   if (count == 1) {
            //     common.showModal('你已参加过考试 请等待通知')
            //     that.setData({
            //       allready: false
            //     })
            //   } else {
            //     that.setData({
            //       allready: true
            //     })
            //   }
            // }else{
            //   that.setData({
            //     allready: true
            //   })
            // }
            
          }
        })


      }
    })
  },
  gotest:function(){
        wx.navigateTo({
          url: '../two/index',
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
    console.log(Bmob)
    var temp = {
      "touser": "oUxY3w_jURG89H5wCIvJDPjJ5s2o",
      "template_id": "-ERkPwp0ntimqH39bggQc_Pj55a18CYLpj-Ert8-c8Y",
      "url": "https://www.bmob.cn/",
      "data": {
        "first": {
          "value": "您好，Restful 失效，请登录控制台查看。",
          "color": "#c00"
        },
        "keyword1": {
          "value": "Restful 失效"
        },
        "keyword2": {
          "value": "2017-07-03 16:13:01"
        },
        "keyword3": {
          "value": "高"
        },
        "remark": {
          "value": "如果您十分钟内再次收到此信息，请及时处理。"
        }
      }
    }
    console.log(Bmob.generateCode());
    // Bmob.sendMasterMessage(temp).then(function (obj) {
    //   console.log('发送成功');


    // }, function (err) {

    //   common.showTip('失败' + err);
    // });

    // var temp = {
    //   "touser": "oUxY3w_jURG89H5wCIvJDPjJ5s2o",
    //   "template_id": "aNNNmi7WK4kohleWhCkDRKJiHOZnIpkrhXx5XPx4dx0",
    //   "url": "https://www.bmob.cn/",
    // }
    // console.log(temp);
    // Bmob.sendMasterMessage(temp).then(function (obj) {
    //   console.log('发送成功');


    // }, function (err) {

    //   common.showTip('失败' + err);
    // });
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