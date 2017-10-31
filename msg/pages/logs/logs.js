// index.js
var common = require('../../utils/common.js')
var app = getApp()
var Bmob = require("../../utils/bmob.js");
var that;
var num;
var count;
function unique(arr) {
  return Array.from(new Set(arr))
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // isHidden:true,
    pageSize: 3,
    limit: 3,
    card: [],
    isHidden:true,
    likedPic:'../../images/star.png'
  },

  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var userInfo;
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        var gender = userInfo.gender //性别 0：未知、1：男、2：女
        var province = userInfo.province
        var city = userInfo.city
        var country = userInfo.country
        that.setData({
          userInfo: userInfo
        })
      }
    })
    this.getcard()

  },
  onShow: function () {
    // this.limitCard()
      
  },
  // 上拉触底
  onReachBottom: function () {
    var limit = this.data.limit
    var orgdata = this.data.card
    this.setData({
      limit: limit + this.data.pageSize,
    });
    // limit = this.data.limit
    this.pulldata()
  },

test:function(){
  var limit = this.data.limit;
  var orgdata = this.data.card
  console.log(limit, orgdata)
},
  show_card: function (e) {
    that = this
    console.log(e.currentTarget.dataset)//预设的data-set
    var tipName = e.currentTarget.dataset.name
     num = e.currentTarget.dataset.num
     count = e.currentTarget.dataset.count
     console.log(num)//预设的值
    var limit = that.data.limit;
    console.log(that.data.card)
    for (var i = 0; i < that.data.card.length; i++) {
      //测第一条信息是否进入本循环
      if (that.data.card[i].card.name == tipName) {
        //取出标签名下的卡片
        that.data.card[i].card.isHidden = true
        // that.data.card[i].num = i//加上 个 i
        var data_card = [];
        data_card = that.data.card[i].card.card
        console.log(data_card)//加载的卡片数据
        var new_card = data_card.slice(0,3)
        console.log(new_card)//处理后的卡片数据
        that.setData({
          card: that.data.card,
          pageSize: 3,//跟新每一页的卡片数量及限制
          limit: 3,
          data_card: new_card,
          count: count
        })
      } else {
        that.data.card[i].card.isHidden = false
        that.setData({
          card: that.data.card
        })
      }
    }
  },
  clip(options) {
    console.log('点击了复制')
    console.log(options)
    that = this;
    var clip = options.currentTarget.dataset.clip
    console.log(clip)
    wx.setClipboardData({
          data: clip,
          success: function (res) {
            // 阳澄湖大闸蟹
            wx.getClipboardData({
              success: function (res) {
                console.log(res.data) // data
                console.log('为啥没有弹框')
                wx.showToast({
                  title: '已复制到剪切板',

                })
              }
            })
          }
    })
    
  },
  share_img(options) {
        console.log(options)
    if (this.data.likedPic === '../../images/star.png') {
      this.data.likedPic === '../../images/liked.png'
      this.setData({
        likedPic: '../../images/liked.png'
      })
    } else {
      this.setData({
        likedPic: '../../images/star.png'
      })
    }

  },
  select_module: function(e){
    //点击选择不同的数据块
    // console.log(e.currentTarget.dataset.mod)
    var mod = e.currentTarget.dataset.mod
    console.log(mod)//item/item1
    this.setData({
      card:[]
    })
    this.getcard(mod)
  },
 
  getcard: function (arg) {
    console.log(num)
    // console.log('zhixinle ')
    var that = this;
    var molist = []
    var newCard
    var limit = that.data.limit;
    // if (that.data.limit > that.data.pageSize && that.data.limit - that.data.pageSize >= that.data.count) {
    //   // console.log("stop")
    //   common.showModal("别扯了 已经到底了")
    //   return false;
    // }
    console.log(limit)
    if (arg == '' || arg == undefined) {
      newCard = Bmob.Object.extend('item')
      //
    } else {
      newCard = Bmob.Object.extend(arg)
    }
    // var newCard = Bmob.Object.extend('arg')
    var query = new Bmob.Query(newCard);
    query.find({
      success: function (res) {
        // console.log(res)
        var namelist = []
        var newNamelist = []
        var item = res[0].get('card_arr');
        // console.log(item)
        molist = item
        // console.log(molist)
        that.setData({
          card: molist
        })
        // console.log(that.data.card)
        // that.limitCard()
        that.pulldata()
     
      }
    })
  },
  pulldata:function(){
    var that = this
    var data_card = [];//最终卡片数据
    var molist =  that.data.card
    var limit = that.data.limit;
     if (that.data.limit > that.data.pageSize && that.data.limit - that.data.pageSize >= that.data.count) {
      console.log("stop")
      common.showModal("别扯了 已经到底了")
      return false;
    }

    for (var i = 0; i < molist.length; i++) {
      that.data.card[i].num = i//加上 个 i
      console.log(limit)
      //取出每一块卡片的数据组成新数组
      if (num == undefined || num == '') {
        console.log("加载")
        that.setData({
          data_card: that.data.card[0].card.card.slice(0, limit)
        })
      } else {
        console.log('加载第' + num + "shuju")
        that.setData({
          data_card: that.data.card[num].card.card.slice(0, limit)
        })
      }
    }
  }
})



