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
    codeword: '如果你是研究员，请输入没事干研究院给你的邀请码',
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

  bindBlur: function (e) {
    // var nickname={} ;
    // nickname[e.currentTarget.id] = e.detail.value
    that = this;
    console.log(e.detail.value);
    console.log(e)
    // wx.getStorage({
    //   key: 'my_username',
    //   success: function (ress) {
    //     if (ress.data) {
    //       var my_username = ress.data;
    //       wx.getStorage({
    //         key: 'user_openid',
    //         success: function (openid) {
    //           var openid = openid.data;
    //           var user = Bmob.User.logIn(my_username, openid, {
    //             success: function (users) {
    //               users.set('nickname', e.detail.value);  // attempt to change username
    //               users.save(null, {
    //                 success: function (user) {
    //                   wx.setStorageSync('my_nick', e.detail.value);
    //                   that.setData({
    //                     userName: e.detail.value,
    //                   })
    //                   common.dataLoading("修改昵称成功", "success");
    //                 },
    //                 error: function (error) {
    //                   common.dataLoading(res.data.error, "loading");
    //                   that.setData({
    //                     inputValue: that.data.userName
    //                   })
    //                 }
    //               });
    //             }
    //           });
    //           console.log(user)
    //         }, function(error) {
    //           console.log(error);
    //         }
    //       })
    //     }
    //   }
    // })
  },
  formSubmit(e) {
    console.log(e.detail.value.input)
    that = this;
    var input_invite_code = e.detail.value.input;
    var value = wx.getStorageSync('user_openid')
    var user = Bmob.Object.extend("_User")
    var query = new Bmob.Query(user)
    console.log(value)
    // wx.getStorage({
    //   key: 'user_id',
    //   success: function (ress) {
    //     console.log(ress)
    //     if (ress.data) {
    //       var isme = new Bmob.User();
    //       isme.id = ress.data;//此为objectid
    //       // console.log(isme.id)
    //       query.equalTo("objectId", isme.id);
    //       query.find({
    //         success: function (results) {
    //           console.log(results)
    //           var init_invite = results[0].attributes.init_inviteCode//预设的邀请码
    //           console.log(init_invite)
    //           if (input_invite_code === init_invite) {//比较输入的邀请码和预设的是否相等
    //             common.dataLoading("欢迎您加入我们", "success");
    //             that.setData({
    //               invite_code: false
    //             })
    //           } else {
    //             that.setData({
    //               codeword: '你的邀请码有误，请核实后再输或者点击“没有”以游客身份登录'
    //             })
    //           }
    //         }
    //       });
    //     }
    //   }
    // })
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

                  console.log(users)
                  var init_invite = users.get('init_inviteCode')
                  if (input_invite_code == init_invite ){
                      users.set('type','研究员')
                      users.set('invite_code',init_invite)
                      users.save(null,{
                        success:function(){
                          console.log('添加邀请码成功')
                          that.setData({
                            invite_code:false
                          })
                        }
                      })
                  }else{
                    that.setData({
                      invite_code: true
                    })
                  }
                  // if (users.get('invite_code') === invitation) {

                  //   users.set('type', '研究员') // attempt to change username
                  //   users.save(null, {
                  //     success: function (user) {
                        
                  //     },
                  //     error: function (error) {
                  //       common.dataLoading(res.data.error, "loading");
                  //      console.log('上传数据失败')
                  //     }
                  //   });

                  // } else {
                  //   users.set('type', '游客') // attempt to change username
                  //   users.save(null, {
                  //     success: function (user) {
                  //       that.setData({
                        
                  //       })

                  //     },
                  //     error: function (error) {
                  //       common.dataLoading(res.data.error, "loading");
                  //       that.setData({
                   
                  //       })
                  //     }
                  //   });
                  // }
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
  resetSubmit(e) {

  },
  cancle() {
    that = this;
    console.log('取消 没有邀请码')
    wx.getStorage({
      key: 'my_username',
      success: function (ress) {
        if (ress.data) {
          var my_username = ress.data;
          console.log(my_username)
          wx.getStorage({
            key: 'user_openid',
            success: function (openid) {
              var openid = openid.data;
              var user = Bmob.User.logIn(my_username, openid, {
                success: function (users) {
                  users.set('type', '游客');  // attempt to change username
                  users.save(null, {
                    success: function (user) {
                      wx.setStorageSync('type', '游客');

                      common.dataLoading("您目前是以游客身份登录哦", "success");
                      that.setData({
                        invite_code: false
                      })
                    },
                    error: function (error) {
                      common.dataLoading(res.data.error, "loading");
                      that.setData({
                        invite_code: false
                      })
                    }
                  });
                }
              });
              console.log(user)
            }, function(error) {
              console.log(error);
            }
          })
        }
      }
    })
  },
  onShow:function(){
    that = this

 
    console.log('onShow')
  //  setInterval(getReturn, 500);
    //取得当前分用户的信息
    var user_id = wx.getStorageSync('user_id')
    console.log(user_id)
    var reply = Bmob.Object.extend("reply");
    //创建查询对象，入口参数是对象类的实例
    var query = new Bmob.Query(reply);
    //查询单条数据，第一个参数是这条数据的objectId值
    query.equalTo('uid',user_id ); 

    query.find({
      success:function(ress){
              console.log(ress)

              var messages = []
              var jsonA = {}
              var message
              var isread 
              
              for(var i = 0; i < ress.length; i++){
                  // if(ress[i].get('is_read')===0){
                    console.log(i)
                    if( ress[i].get('is_read') === 0){
                      jsonA = {
                        "message": ress[i].get('message'),
                        "isread": ress[i].get('is_read')
                      }
                      console.log(jsonA)
                      messages.push(jsonA)
                      console.log(messages)

                    }
                  
              }
              if (messages.length === 0){
                that.setData({
                  remindscount: messages.length,
                  unread:false
                })
              }else{
                that.setData({
                  remindscount: messages.length,
                  unread: true
                })
              }
             
              

      }
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
  console.log(arg)//card

  var card = Bmob.Object.extend(arg)

  var querycard = new Bmob.Query(card)
      querycard


  wx.getStorage({
    key: 'my_username',
    success: function (ress) {

      if (ress.data) {
        var my_username = ress.data;

        wx.getStorage({
          // key: 'user_openid',
          key:'user_id',
          success: function (openid) {
            var openid = openid.data;
            console.log(openid)
            querycard.find({
              success: function(alldata){
                  console.log(alldata)
                  var newcardArr = []

                  for(var n = 0 ; n < alldata.length; n++){
                    if (alldata[n].get('collecter').length !== 0 ){
                      console.log(alldata[n].get('collecter'))

                      var collecter = alldata[n].get('collecter')

                      for (var coll_i = 0; coll_i < collecter.length; coll_i ++ ){
                        if(collecter[coll_i].collecter == openid){
                          var jsonA = {}
                          jsonA.author = alldata[n].get('author_name')
                          jsonA.title = alldata[n].get('title')
                          jsonA.content = alldata[n].get("brand")
                          jsonA.case_name = alldata[n].get("case_name")
                          jsonA.liked = alldata[n].get("collectNum")
                          jsonA.id = alldata[n].id
                          var pic = alldata[n].get('pic');
                        if (pic) {
                          jsonA.pic = alldata[n].get('pic')._url
                        } else {
                          jsonA.pic = '../../images/weekly.jpg'

                        }
                                                // console.log(res[0].get('author'))
                            newcardArr.push(jsonA)
                        }

                      }
                    }
                  }

                that.setData({
                  my_draft: newcardArr
                })
              }
            })
           
          }, function(error) {
            console.log(error);
          }
        })
      }

    }
  })
  
 
}



