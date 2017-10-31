// index.js
var common = require('../../utils/common.js')
var app = getApp()
var Bmob = require("../../utils/bmob.js");
var that;

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
var newlist = new Array()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titles: ['办公室零食', '这么辣还要吃', '肉食'],
    srclist: newlist,
    max: true,
    keyword: '选择',
    show: false,
    mytheme:'选择所属主题',
    theme: [
      {
        theme: '主题一',
        checkd: false
      }, {
        theme: '主题二',
        checkd: false
      }, {
        theme: '主题三',
        checkd: false
      }, {
        theme: '主题四',
        checkd: false
      }]
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

  radioChange: function (e) {
    console.log(e)
    var theme = e.detail.value//选择的问题
    console.log(theme)
    this.setData({
      mytheme: theme,
      show:false
    })

    // this.onLoad()

  },
  confirm: function () {
    that = this
    var show = that.data.show

    if (show === true) {
      that.setData({
        show: false
      })
    } else {
      that.setData({
        show: true

      })
    }


  },
  select_title: function (e) {
    // console.log(e)
    that = this
    var titles = []

    var title = e.currentTarget.dataset.title

    console.log(title)
    //选择标签 提取标签 存储 点击一次选中 点击取消选中

    that.setData({
      on_line_text: title
    })

  },

  chosePic: function () {//选择图
    that = this;
    var arr = that.data.srclist


    setInterval(function () {
      if (arr.length > 3) {
        // arr = arr.slice(-3)
        that.setData({
          max: false//超过三张 不能再添加图
        })
      }
    }, 500)
    wx.chooseImage({
      count: 3, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        // console.log(that.data.srclist)
        arr = arr.concat(tempFilePaths)
        // console.log(arr)
        that.setData({
          isSrc: true,
          src: tempFilePaths,
          srclist: arr
        })

      },
      fail: function () {
        console.log('fail')
      }
    })

  },
  clearPic: function (e) {//删除图片
    that = this;
    console.log(e.currentTarget.dataset.src)
    var newarr = that.data.srclist
    console.log(newarr)

    newarr.remove(e.currentTarget.dataset.src)
    console.log(newarr)
    that.setData({
      isSrc: false,
      src: "",
      srclist: newarr
    })
  },

  changePublic: function (e) {//switch开关
    that = this;
    console.log(e.detail.value)
    if (e.detail.value == true) {
      wx.showModal({
        title: '发布稿件',
        content: '确定要将该稿件出去吗？（发布出去的稿件将被我们选择展示）',
        showCancel: true,
        confirmColor: "#a07c52",
        cancelColor: "#646464",
        success: function (res) {
          if (res.confirm) {
            that.setData({
              ishide: "1"
            })
          }
          else {
            that.setData({
              isPublic: true
            })
          }
        }
      })

    }
    else {
      wx.showModal({
        title: '退回稿件',
        content: '确定要将该稿退回吗？（退回的稿件将不会被我们收集）',
        showCancel: true,
        confirmColor: "#a07c52",
        cancelColor: "#646464",
        success: function (res) {
          if (res.confirm) {
            that.setData({
              ishide: "0"
            })
          }
          else {
            that.setData({
              isPublic: false
            })
          }
        }
      })

    }
  },

  sendInfo(e) {
    that = this;
    console.log(e)
    var theme = that.data.mytheme;
    var content = e.detail.value.content;
    var title = e.detail.value.title;
    var label = e.detail.value.label;
    var publicmsg = that.data.isPublic;
    var username = wx.getStorageSync('my_username')
    if (content == "" || publicmsg == false) {
      common.dataLoading("投稿内容不能为空", "loading");

    }
    else {
      that.setData({
        isLoading: true,
        isdisabled: true
      })
      wx.getStorage({
        key: 'user_id',
        success: function (ress) {

          var Draft = Bmob.Object.extend("Draft");
          var draft = new Draft();
          var me = new Bmob.User();
          me.id = ress.data;
          draft.set("title", title);
          draft.set("content", content);
          draft.set("is_hide", that.data.ishide);
          draft.set("publisher", me);
          draft.set("likeNum", 0);
          draft.set("commentNum", 0);
          draft.set("liker", []);
          draft.set("label", label);
          draft.set("author", username);
          draft.set("theme", theme);
          if (that.data.isSrc == true) {
            var urlArr = new Array();
            var tempFilePaths = that.data.srclist;
            console.log(tempFilePaths)
            var imgLength = tempFilePaths.length;
            console.log(imgLength)

            if (imgLength > 0) {
              var newDate = new Date();
              var newDateStr = newDate.toLocaleDateString();

              var j = 0;
              //如果想顺序变更，可以for (var i = imgLength; i > 0; i--)
              for (var i = 0; i < imgLength; i++) {
                var tempFilePath = [tempFilePaths[i]];
                var extension = /\.([^.]*)$/.exec(tempFilePath[0]);
                if (extension) {
                  extension = extension[1].toLowerCase();
                }
                var name = username + newDateStr + "." + extension;//上传的图片的别名      

                var file = new Bmob.File(name, tempFilePath);


                file.save().then(function (res) {
                  wx.hideNavigationBarLoading()
                  var url = res.url();
                  console.log("第" + i + "张Url" + url);

                  urlArr.push({ "url": url });
                  j++;
                  console.log(j, imgLength);
                  // if (imgLength == j) {
                  //   console.log(imgLength, urlArr);
                  //如果担心网络延时问题，可以去掉这几行注释，就是全部上传完成后显示。
                  // showPic(urlArr, that)
                  // }

                }, function (error) {
                  console.log(error)
                });


              }


            }

            draft.set("pic", file);


          }
          draft.save(null, {
            success: function (result) {
              that.setData({
                isLoading: false,
                isdisabled: false
              })
              // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
              // common.dataLoading("投稿成功", "success", function () {
              //   wx.navigateBack({
              //     delta: 1
              //   })
              // });

              wx.showModal({
                title: '提交成功',
                content: '感谢你的来信，审核通过后我们将在系统消息通知d',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            },
            error: function (result, error) {
              // 添加失败
              console.log(error)
              common.dataLoading("投稿失败", "loading");
              that.setData({
                isLoading: false,
                isdisabled: false
              })
            }
          });
        }
      })
    }

  }

})
