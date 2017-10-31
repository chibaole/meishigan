// pages/ALL/six/index.js
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
   formSubmit: function (e) {
    that = this
    console.log(e)
    question = e.detail.value.question
    answer = e.detail.value.answer
    var pic = that.data.src
    console.log(question, answer)
    if (question == '' || question == undefined || answer == '' || answer == undefined) {
      common.dataLoading("信息不完整 请认真填写哦", "loading");
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
                  result.set("answer", answer);
                  result.set("count", '1')
                  // result.ser('pic',pic)
                  if (that.data.isSrc == true) {
                    var name = that.data.src;//上传的图片的别名
                    console.log(name)
                    var file = new Bmob.File(name, that.data.src);
                    file.save();
                    result.set("pic", file);
                  }

                  result.save();
                  wx.showToast({
                    title: '成功',
                    icon: 'success',
                    duration: 2000
                  })
                  setTimeout(function () {
                    wx.switchTab({
                      url: '../index',
                    })
                  }, 2500)
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
})