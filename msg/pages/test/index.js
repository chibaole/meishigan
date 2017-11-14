// index.js
var common = require('../../utils/common.js')
var app = getApp()
var Bmob = require("../../utils/bmob.js");

var that;
var num;
var current_index = 0;
var allData;
var collecterid;
// var likedimg;
// var unlikedimg;
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
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 1,
    likedimg: '../../images/icon/praise_orange@3x.png',
    praise_img: '../../images/icon/praise_gray@3x.png',
    nolikedimg: '../../images/icon/praise_gray@3x.png',
    picUrl: '../../images/weekly.jpg',
    isHid: true,
    pageSize: 1,
    limit: 3,
    show_more: true,
    show_word: '查看全文',
    collect: [],
    isLiked: false,
    likednum: 0,
    agree: 0,
    modul: 'card'
  },

  onLoad: function (options) {
    // console.log('加载页面')
    // console.log(Bmob.sendMasterMessage)


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

    wx.getStorage({
      key: 'user_id',
      success: function (res) {
        // console.log(res.data)
        collecterid = res.data
        that.setData({
          currentUserid: res.data
        })
      },
    })

  },

  // 1、获取数先 2、处理显示 3、

  onShow: function () {
    that = this
    var Diary = Bmob.Object.extend("card");
    var query = new Bmob.Query(Diary);
    // 只返回score和playerName字段值
    query.select("module");
    query.find().then(function (results) {
      // 返回成功
      // console.log(results)
      var arr_module = []

      for (var i = 0; i < results.length; i++) {
        if (results[i].get('module') !== ''){
          arr_module.push(results[i].get('module'))
        }
       
      }
      // console.log(arr_module)
      var init_module = Array.from(new Set(arr_module))
      console.log(init_module)
      that.setData({
        module: init_module
      })
      var init_arg = that.data.module[1]
      console.log(that.data.module)
      that.getData(init_arg)
    });

  },
  onShareAppMessage: function (res) {


    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }

    var path = '/pages/test/index'
    return {
      title: '吃饱了没事干',
      path: path,
      imageUrl: '../../images/weapp.jpg',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  getData: function (arg) {
    that = this
    var Dirary
    console.log(arg)
    Dirary = Bmob.Object.extend("card")
    var query = new Bmob.Query(Dirary)
    query.include("author");
    if (arg !== undefined) {
      query.equalTo('module', arg)
    } else {
      query.equalTo('module', '最新热门研究成果')
    }
    var limit = that.data.limit
    var pageSize = that.data.pageSize

    query.find({
      success: function (res) {
        console.log(res)//所有的card／module0
        var bar_titles = []
        var jsonAs = []
        var jsonA = {}
        for (var i = 0; i < res.length; i++) {
          var bar_title = res[i].get('bar_titles')
          var title = res[i].get("title")
          // console.log(title)
          title == "''" ? title = "" : title = title
          // console.log(title)
          var pic 

          // if (res[i].get('pic') != undefined && res[i].get('pic')._url != undefined) {
          //   pic = res[i].get('pic')._url
          // }
          console.log(res[i].get('pic'))
          if (res[i].get('pic') !== undefined){
            console.log(i)
            pic = res[i].get('pic')._url
          }else{
            pic  = undefined
          }
          var author = res[i].get("author")
          var publisherId
          res[i].get("author") != undefined ? publisherId = res[i].get("author").id : publisherId = ""
          var brand = res[i].get("brand")
          var wordlimit;
          // console.log(brand.length)
          brand.length < 65 ? wordlimit = false : wordlimit = true
          var case_name = res[i].get("case_name")
          // var liked = res[i].get("liked")
          var likeNum = res[i].get("likeNum")
          var name 
          res[i].get("author") != undefined ? name = res[i].get("author").nickname : name = '没事干' 

          var author_name = res[i].get("author_name") 
          // console.log(res[i].get("author"))
          var avatar 

          res[i].get("author") != undefined ? avatar = res[i].get("author").get("userPic") : avatar = ""
          var likedimg;
          var id = res[i].id
          if (res[i].get('collectNum') < 1) {
            var collectNum = 1
          } else {
            var collectNum = res[i].get('collectNum')
          }

          var is_liked;
          var collecters = res[i].get("collecter")
         
          for (var s = 0; s < collecters.length; s++) {
            if (collecters[s].collecter == collecterid) {
              likedimg = collecters[s].likedimg
              is_liked = collecters[s].is_liked
            } else {
              likedimg = "../../images/icon/praise_gray@3x.png"
              is_liked = 0
            }
          }
          jsonA = {
            "collectNum": collectNum,
            "bar_title": bar_title,
            "title": title,
            "author": name || '没事干',
            "author_name": author_name || '没事干',
            "author_avatar": avatar || "../../images/weapp.jpg",
            "brand": brand,
            "case_name": case_name || '',
            "likeNum": likeNum,
            "id": id,
            "likedimg": likedimg || 'http://oxnbz75b8.bkt.clouddn.com/praise_gray@3x.png',
            "is_liked": is_liked || 0,
            "wordlimit": wordlimit,
            "pic":pic || ''
          }
          bar_titles.push(bar_title)
          jsonAs.push(jsonA)
          // console.log(jsonA)
        }
        let newbar = Array.from(new Set(bar_titles));
        var arrs = []
        var arr = new Object()
        var arrs1 = []
        var arr1 = new Object()
        var resdata = new Object()//-----数据的对象结构
        //另做一个数据  做数据刷新时源 
        for (var i = 0; i < newbar.length; i++) {
          var resdata = []//++++++对象内部的数组结构
          var teptitle;
          for (var j = 0; j < jsonAs.length; j++) {
            if (jsonAs[j].bar_title == newbar[i]) {
              resdata.push(jsonAs[j])//出一个数组
              teptitle = newbar[i]
            }
          }

          var init_resdata;
          var orgdata;//定义一个源数据
          orgdata = JSON.parse(JSON.stringify(resdata));

          if (limit <= resdata.length) {

            init_resdata = resdata.splice(0, limit)
          } else {
            init_resdata = resdata
          }
          arr = {
            "data": init_resdata,
            "title": teptitle,
            "isHid": false,
            "label_url": '../../images/first/labelling_orange.png'
          }
          arr1 = {
            "data": orgdata,
            "title": teptitle,
            "isHid": false
          }
          arrs1.push(arr1)
          arrs.push(arr)
        }
        arrs[0].isHid = true

        arrs[0].label_url = '../../images/first/labelling_an_dark.png '


        resdata = {
          "resdata": arrs,
          "orgdata": arrs1
        }
        // console.log(resdata)//-----数据的对象结构

        that.setData({
          resdata: resdata,
          onlydata: resdata.resdata[0]
        })

        // console.log(that.data.resdata.resdata)
      }
    })
  },

  show_bar_title: function (e) {
    // console.log(e.currentTarget.dataset)
    that = this
    var title = e.currentTarget.dataset.title
    var count = e.currentTarget.dataset.count//所有的的数据长度值
    num = count

    var data = that.data.resdata.resdata

    for (var i = 0; i < data.length; i++) {
      if (title == data[i].title && data[i].isHid == false) {
        data[i].isHid = true
        data[i].label_url = '../../images/first/labelling_an_dark.png '
        current_index = i
      } else if (title == data[i].title && data[i].isHid == true) {
        data[i].isHid = false,
          data[i].label_url = '../../images/first/labelling_orange.png'
      }
    }
    // console.log(current_index)
    that.data.limit = 3
    that.setData({
      resdata: that.data.resdata,
      limit: that.data.limit
    })

    console.log(that.data.resdata)
  },

  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom: function () {
    that = this
    var limit = that.data.limit
    that.setData({
      limit: limit + that.data.pageSize,
    });
    // that.getData()
    that.pullData();
  },

  pullData: function () {
    that = this
    var limit = that.data.limit
    // console.log(limit)

    var orgdata = that.data.resdata.orgdata

    var limitdata = that.data.resdata.orgdata[current_index].data



    var result = limitdata.slice(0, limit)
    that.data.resdata.resdata[current_index].data = result
    var nowresdata = that.data.resdata
    // console.log(nowresdata)
    that.setData({
      resdata: nowresdata
    })
  },
  select_module: function (e) {
    that = this
    // console.log(e.currentTarget.dataset)
    var module = e.currentTarget.dataset.mod
    console.log(module)
    // that.setData({
    //   modul: model
    // })


    that.getData(module)
  },
  clip(options) {
    // console.log('点击了复制')
    // console.log(options)
    that = this;
    var clip = options.currentTarget.dataset.case
    // console.log(clip)
    wx.setClipboardData({
      data: clip,
      success: function (res) {
        // 阳澄湖大闸蟹
        wx.getClipboardData({
          success: function (res) {
            // console.log(res.data) // data
            // console.log('为啥没有弹框')
            wx.showToast({
              title: '已复制到剪切板',

            })
          }
        })
      }
    })

  },
  showall: function (e) {
    //显示全文函数
    that = this
    var id = e.currentTarget.dataset.showall
    var show_word = that.data.show_word

    // console.log(id)
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

  goother: function () {
    wx.navigateTo({
      url: '../other/index',
    })
  },

  chang_img: function (e) {
    that = this
  
    var itemid = e.currentTarget.dataset.cardid
    var Card = Bmob.Object.extend('card');
    var query = new Bmob.Query(Card);
    query.equalTo("objectId", itemid)
    wx.getStorage({
      key: 'user_id',
      success: function (res) {
        // console.log(res.data)
        var current_id = res.data
        var isLiked = false

        query.find({
          success: function (result) {
            // console.log(result);
            var collectNum = result[0].get('collectNum')
            var collecterUser = result[0].get('collecter')
            // console.log(collecterUser.length)
            console.log(collecterUser)
            if (collecterUser.length > 0) {
              // console.log('本文章已经有收藏的人了')
              for (var i = 0; i < collecterUser.length; i++) {
                // console.log(collecterUser[i].collecter )
                if (collecterUser[i].collecter == current_id) {
                  // console.log('这个用户已在收藏者列表')//删除此用户

                  collectNum = collectNum - 1
                  collectNum < 0 ? collectNum = 1 : collectNum = collectNum
                  collecterUser.remove(collecterUser[i])
                  result[0].set("collecter", collecterUser)
                  result[0].set("collectNum", collectNum)
                  // result[0].set('is_liked','0')

                  // result[0].save()
                  isLiked = true
                  that.setData({
                    isLiked: isLiked
                  })
                  wx.showToast({
                    title: '已取消收藏',
                    icon: 'success',
                    duration: 2000
                  })
                  break
                }
              }

              if (isLiked == false) {
                // console.log('当前的用户还不在收藏的列表里')//添加进来新的用户
                var newUser = new Object()
                newUser.collecter = current_id
                newUser.likedimg = '../../images/icon/praise_orange@3x.png'
                newUser.is_liked = 1
                collectNum = collectNum + 1
                collecterUser.push(newUser)

                result[0].set("collecter", collecterUser)
                result[0].set("collectNum", collectNum)
                wx.showToast({
                  title: '已收藏',
                  icon: 'success',
                  duration: 2000
                })
              }

            } else {
              var newUser = new Object()
              newUser.collecter = current_id
              newUser.likedimg = '../../images/icon/praise_orange@3x.png'
              newUser.is_liked = 1
              collectNum = collectNum + 1
              collecterUser.push(newUser)
              result[0].set("collecter", collecterUser)
              result[0].set("collectNum", collectNum)
              wx.showToast({
                title: '已收藏',
                icon: 'success',
                duration: 2000
              })
            }

            result[0].save()
            console.log('ok')
          },
          error: function (result, error) {
            console.log("查询失败");
          }
        });
      },
    })
  }
})
