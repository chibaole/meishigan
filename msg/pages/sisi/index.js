// index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      img:'../../images/weekly.jpg'
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
  showimg: function(){
    console.log('执行得分')
    var that = this
    wx.downloadFile({
      url:'http://oxl5leo53.bkt.clouddn.com/279759ee3d6d55fb75ed26e764224f4a21a4ddcc.jpg', //仅为示例，并非真实的资源
      success: function (res) {
      
        console.log(res.tempFilePath)
        that.setData({
          imgurl: res.tempFilePath
        })

        
        
      }
    })

    
  },
  preimg: function(e){
    console.log(e.currentTarget)
    var that = this
    var url = e.currentTarget.dataset.src
    wx.previewImage({
      current: that.data.imgurl,
      urls: [that.data.imgurl],
      success: function () {
        console.log('借口OK')
      }
    })

    // wx.previewImage({
    //   urls: [url],
    //   success:function(){
    //     console.log('sji')
    //   }
    // })
  },
  scoll: function(){
    //kejianquyu
    var seeheigth = this.data.clientthit;
  }


})