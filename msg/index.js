// index.js
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

  bindBlur: function (e) {
    // var nickname={} ;
    // nickname[e.currentTarget.id] = e.detail.value
    that = this;
    console.log(e.detail.value);
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
                  users.set('nickname', e.detail.value);  // attempt to change username
                  users.save(null, {
                    success: function (user) {
                      wx.setStorageSync('my_nick', e.detail.value);
                      that.setData({
                        userName: e.detail.value,
                      })
                      common.dataLoading("修改昵称成功", "success");
                    },
                    error: function (error) {
                      common.dataLoading(res.data.error, "loading");
                      that.setData({
                        inputValue: that.data.userName
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
  formSubmit(e) {
    console.log(e.detail.value.input)
    that = this;
    var input_invite_code = e.detail.value.input;
    var value = wx.getStorageSync('user_openid')
    var user = Bmob.Object.extend("_User")
    var query = new Bmob.Query(user)
    console.log(value)
    wx.getStorage({
      key: 'user_id',
      success: function (ress) {
        console.log(ress)
        if (ress.data) {
          var isme = new Bmob.User();
          isme.id = ress.data;//此为objectid
          console.log(isme.id)
          query.equalTo("objectId", isme.id);
          query.find({
            success: function (results) {
              console.log(results)
              var init_invite = results[0].attributes.invite_code
              console.log(init_invite)
              if (input_invite_code === init_invite) {
                common.dataLoading("欢迎您加入我们", "success");

                that.setData({
                  invite_code: false
                })
              } else {
                that.setData({
                  codeword: '你的邀请码有误，请核实后再输或者点击“没有”以游客身份登录'
                })
              }
            }
          });
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
  }
})