// pages/ALL/two/index.js
var common = require('../../../utils/common.js')
var app = getApp()
var Bmob = require("../../../utils/bmob.js")
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gender: ['男', '女', '其它'],
    genderd: "",
    hasbuy: true
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
  checkbox: function (e) {

    console.log(e)

    if (this.data.hasbuy == true) {
      this.setData({
        hasbuy: false
      })
    } else {
      this.setData({
        hasbuy: true
      })
    }
    console.log(this.data.hasbuy)
  },
  radioChange: function (e) {
    console.log(e)
    var gender = e.detail.value
    this.setData({
      genderd: gender
    })

  },
  formSubmit: function (e) {
    that = this
    console.log(e.detail.value)
    var yourname = e.detail.value.youname
    // console.log(yourname)
    console.log(e.detail.value.yourname)

    var phonenum = e.detail.value.phonenum
    console.log(phonenum)

    var othernum = e.detail.value.othernum
    var hasbuy = this.data.hasbuy
    var gender = this.data.genderd
    var testres = Bmob.Object.extend("testRes")

    if (yourname == "" || phonenum == "" || othernum == "" || hasbuy == false) {
      common.dataLoading("信息不完整 请认真填写哦", "loading");
    }
    else {

      wx.getStorage({
        key: 'user_id',
        success: function (ress) {
          var Diary = Bmob.Object.extend("testRes");
          var query = new Bmob.Query(Diary)

          query.equalTo("publisher", ress.data)//查询发布者数据
          query.find({
            success: function (res) {
              console.log(res)
              if(res.length == 0){//没有数据就添加新的数据
                var diary = new Diary();
                var me = new Bmob.User();
                me.id = ress.data;
                diary.set("yourname", yourname);//名字
                diary.set("yourPhonenum", phonenum);//手机号
                diary.set("hasbuy", hasbuy);//是否购买零食包
                diary.set("publisher", me);//实际用户
                diary.set("yourOthernum", othernum);//其它的社交账号
                diary.set("gender", gender);//性别
                diary.save(null, {
                  success: function (result) {

                    // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
                    console.log('数据添加成功')
                  },
                  error: function (result, error) {
                    // 添加失败
                    console.log(error)
                    // common.dataLoading("提交失败", "loading");
                  }
                });



              }else {
                var id = res[0].id
                query.get(id,{//如果已有数据 就修改当前的数据
                  success:function(result){
                          console.log(result)
                          result.set('yourname',yourname)
                          result.set("yourPhonenum", phonenum);
                          result.set("hasbuy", hasbuy);
                          result.set("publisher", me);
                          result.set("yourOthernum", othernum);
                          result.set("gender", gender);
                          result.save();
                  }
                })
              }

             
            }
          })
          

        }
      })
      wx.navigateTo({

        url: "../thr/index",
        success: function (res) {
          console.log('跳转到了第三页')
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  }

})