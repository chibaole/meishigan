// index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
          // brand
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {
    console.log('是这个页')
    
    wx.canvasToTempFilePath({
      canvasId: 'build_img',
      destWidth: 300,
      destHeight: 300,
      success: function (res) {
        console.log('fdfd')
        console.log(res.tempFilePath)
        var path = '/images/weapp.png'
        var brand = '史蒂夫技术的房间看了我乌尔济克'
        ctx.drawImage(path, 0, 0, 100, 100);
        ctx.draw();

        ctx.setFontSize(14);
        ctx.setFillStyle("#ff0000");
        ctx.fillText(brand, phoneInfo.windowWidth * 0.34, phoneInfo.windowHeight * 0.2);
        ctx.draw(true);
        
      }
    })

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
  
  }
})