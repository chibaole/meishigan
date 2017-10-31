// pages/isme/index.js
var app = getApp();
var Bmob = require("../../utils/bmob.js");
var common = require('../../utils/common.js')

var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showitem0: true,
    showitem1: false,
    showLoading: true,
    show_word:'查看全文',
    unread: true,
    myInfo: {
      labels: []
    },
    my_success: [
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    var that = this
    var userInfo;
    wx.getUserInfo({
      success: function (res) {
        userInfo = res.userInfo;
        console.log(userInfo)
        that.setData({
          userInfo: userInfo,
          showLoading: false,
          // invite_code: true
        })
      }
    })

    var value = wx.getStorageSync('user_openid')
    var nickname = wx.getStorageSync('my_nick')
    console.log(nickname)
    that.setData({
      userName: nickname
    })
    wx.getStorage({
      key: 'my_username',

      success: function (ress) {
        console.log(ress)
        if (ress.data) {
          var my_username = ress.data;
          wx.getStorage({
            key: 'user_openid',
            success: function (openid) {
              var openid = openid.data;

              var user = Bmob.User.logIn(my_username, openid, {
                success: function (users) {
                  console.log(users)
                  var labels = users.attributes.label;
                  var spe_val = users.attributes.special_val
                  var con_val = users.attributes.con_val
                  var nickname = users.attributes.nickname
                  var invite_code = users.attributes.invite_code
                  if(invite_code !== ''){

               
                    that.setData({
                      myInfo: {
                        labels: labels,
                        special_val: spe_val,
                        con_val: con_val,
                        nickname: nickname
                      },
                      invite_code:false

                    })
                  }else{
                    that.setData({
                      myInfo: {
                        labels: labels,
                        special_val: spe_val,
                        con_val: con_val,
                        nickname: nickname
                      },
                      invite_code: true

                    })
                  }

                }
              });

            }, function(error) {
              console.log(error);
            }



          })
        }
      }
    })
    //  拉取当前用户的发布的文章
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('1')
    var that = this
    that.setData({
      showLoading: false
    })

    getcard(that, 'Draft');

  },

  shareTo() {
    console.log('点击了分享')
    wx.showShareMenu({
      withShareTicket: true,
      success: function (res) {
        console.log('成功了')
        console.log(res)
      }

    })
  },

  confirm: function () {
    console.log("点击了确定")
    this.setData({
      dialog: false
    })
  },
  edit: function () {
    console.log("点击了编辑")
    wx.navigateTo({
      url: './edit/index',
    })

  },
  message() {
    // wx.navigateTo({
    //   url: './message/index',
    // })
    this.setData({
      remindscount: 0,
      unread: false


    })

  },
  showitem: function (e) {
    var that = this
    var item = e.currentTarget.dataset.item
    console.log(item)//item0/item1

    if (item == 'achievement') {
      getcard(that, 'Draft')
    } else if (item == 'collecter') {
      getcollect(that, 'card')

    }
    that.setData({
      curitem: item
    })
  },
 
 

  onShow:function(){
    that = this
    console.log('onShow')
    //取得当前分用户的信息
    var user_id = wx.getStorageSync('user_id')
    wx.getStorage({
      key: 'my_username',
      success: function (ress) {
        console.log(ress)
        if (ress.data) {
          var my_username = ress.data;
          wx.getStorage({
            key: 'user_openid',
            success: function (openid) {
              var openid = openid.data;
              var user = Bmob.User.logIn(my_username, openid, {
                success: function (users) {
                  var labels = users.attributes.label;
                  var spe_val = users.attributes.special_val
                  var con_val = users.attributes.con_val
                  var nickname = users.attributes.nickname
                  that.setData({
                    myInfo: {
                      labels: labels,
                      special_val: spe_val,
                      con_val: con_val,
                      nickname: nickname
                    }
                  })

                }
              });

            }, function(error) {
              console.log(error);
            }



          })
        }
      }
    })
   
  },
  onReachBottom: function () {
    this.onShow()
    // this.onLoad()
  },
  showall: function (e) {
    //显示全文函数
    that = this
    var id = e.currentTarget.dataset.item
    var show_word = that.data.show_word
    console.log(e)
    //控制显示样式


    if (show_word === '查看全文') {
      that.setData({
        classid: id,
        show_word: '收起'
      })
    } else {
      that.setData({
        classid: '',
        show_word: '查看全文'
      })

    }
  },
  gotourl: function (e) {
    var url = e.currentTarget.dataset.url
    console.log(e)
    wx.redirectTo({
      url: url
    })

  }

})

function getcard(that, arg) {
  //获取当前用户发表过的稿子
  console.log(arg)
  var user_id = wx.getStorageSync('user_id')

  var card = Bmob.Object.extend(arg)

  var querycard = new Bmob.Query(card)

  querycard.equalTo("publisher", user_id)//
  querycard.find({
    success: function (res) {
      console.log(res)
      var a = [];
      var cards = []
      for (var i = 0; i < res.length; i++) {
        var jsonA = {}
        jsonA.author = res[i].get("author");
        jsonA.title = res[i].get('title')
        jsonA.content = res[i].get("content")
        jsonA.case_name = res[i].get("case_name")
        jsonA.id = res[i].id
        var pic = res[i].get('pic');
        if (pic) {
          jsonA.pic = res[i].get('pic')._url
        } else {
          jsonA.pic = '../../images/weekly.jpg'

        }
      
        // jsonA.author = res[i].get('publisher')


        console.log(jsonA)
        cards.push(jsonA)

        // console.log(jsonA.url)
      }
      console.log(cards)
      that.setData({
        my_draft: cards
      })
    }
  })

}

function getcollect(that, arg) {
  //获取当前用户发表过的稿子
  console.log(arg)

  var card = Bmob.Object.extend(arg)

  var querycard = new Bmob.Query(card)

  wx.getStorage({
    key: 'my_username',
    success: function (ress) {

      if (ress.data) {
        var my_username = ress.data;
        wx.getStorage({
          key: 'user_openid',
          success: function (openid) {
            var openid = openid.data;
            var user = Bmob.User.logIn(my_username, openid, {
              success: function (users) {
                var collect = users.get('collecter')
                      console.log(collect)
                      var cards = []

                for (var i = 0; i < collect.length; i++) {

                  querycard.equalTo("objectId", collect[i])//

                  querycard.find({
                    success: function (res) {
                      console.log(res)
                      for (var j = 0; j < res.length; j++) {
                        var jsonA = {}
                        jsonA.author = res[j].get('author_name')
                        jsonA.title = res[j].get('title')
                        jsonA.content = res[j].get("brand")
                        jsonA.case_name = res[j].get("case_name")
                        jsonA.id = res[j].id
                        var pic = res[j].get('pic');
                        if (pic) {
                          jsonA.pic = res[j].get('pic')._url
                        } else {
                          jsonA.pic = '../../images/weekly.jpg'

                        }

                        // jsonA.author = res[j].get('author')
                                                console.log(res[0].get('author'))

                        // var author = res[i].get("author").get("nickname");
                        // jsonA.author = author

                        cards.push(jsonA)

                        // console.log(jsonA.url)
                      }

                      console.log(cards)

                      that.setData({
                        my_draft: cards
                      })

                    }
                  })



               
                }

              }
            });
          }, function(error) {
            console.log(error);
          }
        })
      }

    }
  })
  
 
}



