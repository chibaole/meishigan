//index.js
//获取应用实例
var app = getApp();
var that;
// var common = require('../template/getCode.js');
var Bmob = require("../../utils/bmob.js");
Page({
  data: {
    showLoading:true,
    motto: 'Hello World',
    userInfo: {},
    city:[{
      name:"宁波",
      num:89
    },
      {
        name: "杭州",
        num: 909
      },
      {
        name: "上海",
        num: 9
      },
      {
        name: "鬼晓得",
        num: 20
      }
    ],
    articles: [
      {
        title:"吃饱了不能睡",
        authorName:"小马",
        likeNum:99,
        commentNum: 120
      },
      {
        title: "吃饱了还想吃",
        authorName: "小喵",
        likeNum: 19,
        commentNum: 10
      }
    ],
    currentDay:"今天",
    beforeDay:[
      {
        day:"8月22日"
      },
      {
        day: "8月21日"
      }

    ]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this

    var userInfo ;
    wx.getUserInfo({
      success: function(res){
        userInfo = res.userInfo;
      }
    })

  
    //调用应用实例的方法获取全局数据
    that.setData({
      userInfo:userInfo,
      showLoading:false
    })
  }
})
