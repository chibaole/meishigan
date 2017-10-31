// index.js

Array.prototype.indexOf = function (val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == val) return i;
  }
  return -1;
};
Array.prototype.remove = function (val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};

var app = getApp();
var Bmob = require("../../../utils/bmob.js");
var common = require('../../../utils/common.js')
var mylabel
var that;
Page({
  

  /**
   * 页面的初始数据
   */
  data: {
    labels:['电话费','回家','干一宿','好次诋毁森岛宽晃','没的打飞机','们的深深的','深度','快结束的','水淀粉'],
    activeltemIndex:'',
    label: [{ "change": true, "lab_class": "active", "label": "", "title": "标签一" }, { "change": true, "lab_class": "active", "label": "", "title": "标签二" }, { "change": true, "lab_class": "active", "label": "", "title": "标签三" }],
   
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
    var that = this
    var userInfo;

    console.log(that.data.label)
    wx.getUserInfo({
      success: function (res) {
        userInfo = res.userInfo;
        // console.log(userInfo)
        that.setData({
          userInfo: userInfo,
          showLoading: false,
          invite_code: true
        })
      }
    })

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
                  var oldNickname = users.get('nickname')
                  var invite = users.get('invite_code')
                  var currentlabel = users.get('label')

                  var Label = Bmob.Object.extend("foodieLabel");
                  var Labelquery = new Bmob.Query(Label);

                  Labelquery.find({
                    success: function (orglabel) {
                      // console.log(orglabel)
                      var initlabel = []

                      for (var i = 0; i < orglabel.length; i++) {
                        var jsonL = {
                          label: '',
                          change: '',
                          lab_class: ''
                        }
                        jsonL.title = orglabel[i].get('label')
                        jsonL.change = orglabel[i].get('change')
                        jsonL.lab_class = orglabel[i].get('lab_class')
                        initlabel.push(jsonL)

                      }
                 
                      for (var ii = 0; ii < initlabel.length; ii++) {
                        console.log('第一次循环')
                        for (var jj = 0; jj < currentlabel.length; jj++) {
                          console.log('第二次循环')
                          if (currentlabel[jj].title == initlabel[ii].title) {
                            console.log(ii)
                            initlabel[ii].lab_class = 'active'
                          }
                        }
                      }
                    that.setData({
                      label:initlabel
                    })
                      console.log(initlabel)
                    }
                  })




                  // console.log(invite)
                  if (invite != '') {
                    that.setData({
                      oldNickname: oldNickname,
                      uninput: true
                      
                    })
                  } else {
                    that.setData({
                      oldNickname: oldNickname,
                      uninput: false,
                      label: initlabel

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

  formSubmit(e) {
    console.log(e)
    that = this;
    var newname = e.detail.value.nickname//修改的呢称
    var invitation =   e.detail.value.invitation//邀请码
    // console.log(newname,invitation)
    // console.log(mylabel)//选择的吃货标签

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
                  if (users.get('invite_code') === invitation){

                        if (newname === ''){
                          // users.set('nickname', n); 
                        }else{
                          users.set('nickname', newname); 
                        }
                        users.set('type','研究员') // attempt to change username
                        users.set('label',mylabel)
                        users.save(null, {
                          success: function (user) {
                            wx.setStorageSync('my_nick', e.detail.value.changeNick);
                            that.setData({
                              userName: that.data.inputValue,
                              isModifyNick: false,
                              isdisabled: false,
                              modifyLoading: false
                            })
                            common.dataLoading("修改昵称成功", "success");
                          },
                          error: function (error) {
                            common.dataLoading(res.data.error, "loading");
                            that.setData({
                              isModifyNick: false,
                              isdisabled: false,
                              modifyLoading: false,
                              inputValue: that.data.userName
                            })
                          }
                        });

                  } else {
                    users.set('nickname', newname);
                    users.set('type', '游客') // attempt to change username
                    users.set('label', mylabel)
                    users.save(null, {
                      success: function (user) {
                        wx.setStorageSync('my_nick', e.detail.value.changeNick);
                        that.setData({
                          userName: that.data.inputValue,
                          isModifyNick: false,
                          isdisabled: false,
                          modifyLoading: false
                        })
                        common.dataLoading("修改昵称成功", "success");

                      },
                      error: function (error) {
                        common.dataLoading(res.data.error, "loading");
                        that.setData({
                          isModifyNick: false,
                          isdisabled: false,
                          modifyLoading: false,
                          inputValue: that.data.userName
                        })
                      }
                    });
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

  wx.switchTab({
    url: '../index',
  }) 
  console.log('跳转到首页')
  // wx.navigateBack({
  //   delta:2
  // })

  },
  test:function(e){
    var that = this
    var label = that.data.label
    var index = e.target.dataset.index
    var title = e.target.dataset.title
    var newarr = new Array()
    console.log(label)
    console.log(e.target.dataset)
    for(var i = 0 ;i < label.length; i++){
      console.log(label[index])
      if (label[index].change == false){
          label[index].lab_class = 'active'
          label[index].change = true
      }else{
        label[index].lab_class = 'label'
        label[index].change = false
      }
      console.log(label[index])
      break

    }

    //更新数据
    that.setData({
      label:label
    })

// console.log(that.data.label)

      //筛选出change = true 的数据
      var orgdata = that.data.label
      // console.log(orgdata.length)
      for(var j = 0; j < orgdata.length; j++){
      // console.log(j)
        if(orgdata[j].change === true){
          newarr.push(orgdata[j])
        }
      }
      // console.log(newarr) //就是这个数据了

      mylabel = newarr
      console.log(mylabel)

  }
})



