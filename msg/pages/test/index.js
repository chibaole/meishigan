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
    isLiked:false,
    likednum: 0,
    agree:0,
    modul:'card'
  },
  // onPageScroll: function (obj) {
  //   console.log(obj)
  // },
  onLoad: function (options) {
    // console.log('加载页面')
    console.log(Bmob.sendMasterMessage)

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
      success: function(res) {
        console.log(res.data)
        collecterid = res.data
        that.setData({
          currentUserid:res.data
        })
      },
    })
    that.getData()
  },

  // 1、获取数先 2、处理显示 3、

  onShow: function () {
    this.getData()
  },


  getData: function (arg) {
    that = this
    var Dirary
    console.log(arg)
    if (arg !== undefined) {
      Dirary = Bmob.Object.extend(arg)
    } else {
      Dirary = Bmob.Object.extend("card")
    }
    var query = new Bmob.Query(Dirary)
    query.include("author");
    var limit = that.data.limit
    var pageSize = that.data.pageSize
    query.find({
      success: function (res) {
        // console.log(res)//所有的card／module0
        var bar_titles = []
        var jsonAs = []
        var jsonA = {}
        for (var i = 0; i < res.length; i++) {
          var bar_title = res[i].get('bar_titles')
          var title = res[i].get("title")
          var author = res[i].get("author")
          var publisherId = res[i].get("author").id
          var brand = res[i].get("brand")
          var case_name = res[i].get("case_name")
          var liked = res[i].get("liked")
          var likeNum = res[i].get("likeNum")
          var name = res[i].get("author").get("nickname");
          // console.log(res[i].get("author"))
          var avatar = res[i].get("author").get("userPic");
          var likedimg ;

          var id = res[i].id
          if (res[i].get('collectNum') < 1) {
            var collectNum = 1
          } else {
            var collectNum = res[i].get('collectNum')
          }
          var collecters = res[i].get("collecter")
          for(var s = 0; s < collecters.length; s ++){
            if (collecters[s].collecter == collecterid ){
              likedimg = collecters[s].likedimg
            }else{
              likedimg = "../../images/icon/praise_gray@3x.png"

            }
          }
          jsonA = {
            "collectNum": collectNum,
            "bar_title": bar_title,
            "title": title,
            "author": name,
            "author_avatar": avatar,
            "brand": brand,
            "case_name": case_name || '',
            "liked": liked,
            "likeNum": likeNum,
            "id": id,
            "likedimg": likedimg || 'http://oxnbz75b8.bkt.clouddn.com/praise_gray@3x.png'
          }

          bar_titles.push(bar_title)
          jsonAs.push(jsonA)
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
            "label_url": '../../images/first/labelling_an_dark.png'
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

        arrs[0].label_url = '../../images/first/labelling_orange.png'


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
    console.log(e.currentTarget.dataset)
    that = this
    var title = e.currentTarget.dataset.title
    var count = e.currentTarget.dataset.count//所有的的数据长度值
    num = count

    var data = that.data.resdata.resdata

    for (var i = 0; i < data.length; i++) {
      if (title == data[i].title && data[i].isHid == false) {
        data[i].isHid = true
        data[i].label_url = '../../images/first/labelling_orange.png'
        current_index = i
      } else if (title == data[i].title && data[i].isHid == true) {
        data[i].isHid = false,
          data[i].label_url = '../../images/first/labelling_an_dark.png'
      }
    }
    console.log(current_index)
    that.data.limit = 3
    that.setData({
      resdata: that.data.resdata,
      limit: that.data.limit
    })
    // wx.pageScrollTo({
    //   scrollTop: 1100
    // })
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
    console.log(limit)

    var orgdata = that.data.resdata.orgdata

    var limitdata = that.data.resdata.orgdata[current_index].data

    // if (limit > limitdata.length ){
    //          common.showModal("别扯了 没有新的内容的")
    //          return false
    // }

    var result = limitdata.slice(0, limit)
    that.data.resdata.resdata[current_index].data = result
    var nowresdata = that.data.resdata
    console.log(nowresdata)
    that.setData({
      resdata: nowresdata
    })
  },
  select_module: function (e) {
    that = this
    console.log(e.currentTarget.dataset)
    var model = e.currentTarget.dataset.mod
    console.log(model)
    that.setData({
      modul: model
    })
    that.getData(model)


  },
  clip(options) {
    console.log('点击了复制')
    console.log(options)
    that = this;
    var clip = options.currentTarget.dataset.case
    // console.log(clip)
    wx.setClipboardData({
      data: clip,
      success: function (res) {
        // 阳澄湖大闸蟹
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data) // data
            console.log('为啥没有弹框')
            wx.showToast({
              title: '已复制到剪切板',

            })
          }
        })
      }
    })

  },

  my_love: function (e) {
    that = this
    // that.onShow()
    console.log(e)
    var currentID = e.currentTarget.dataset.cardid//点击的卡片的id 这是唯一的不同点
    var likeNum = that.data.likednum
    var item_id;

    // 
    let currentUserid = that.data.currentUserid// currentID
    // 

    wx.getStorage({
      key: 'user_id',
      success: function (ress) {
        var Diar = Bmob.Object.extend('card')
        var querylike = new Bmob.Query(Diar)
        querylike.equalTo("objectId", currentID)
        querylike.find({
          success: function (res) {
            console.log(res[0])//点击选中的卡片 
            var isLiked = false
            var collcterArray = res[0].get('collecter')
            var collcterNum = res[0].get('collectNum')
            item_id = res[0].id
            if (collcterArray.length > 0) {
              console.log('收藏者里已经有收藏的人了')
              for (var i = 0; i < collcterArray.length; i++) {
                if (collcterArray[i] == ress.data) {
                  collcterArray.remove(ress.data)//删除已存在的收藏者
                  collcterNum = collcterNum - 1//收藏人数减1
                  collcterNum < 0 ? collcterNum = 1 : collcterNum = collcterNum
                  isLiked = true
                  res[0].set('collecter', collcterArray)//
                  // res[0].ser('likedimg','http://oxnbz75b8.bkt.cloudd')
                  res[0].set('collectNum', collcterNum)//
                  that.setData({
                    isLiked: isLiked,
                    currentCardid: currentID,
                  })
                  break

                }
              }
                  console.log(isLiked)
              if (isLiked == false) {
                // 如果不在当前的收藏者列表里 就添加进去
                console.log('将要添加的收藏者' + ress.data)

                collcterArray.push(ress.data)

                collcterNum < 0 ? collcterNum = 1 : collcterNum = collcterNum + 1

                res[0].set('collecter', collcterArray)

                res[0].set('collectNum', collcterNum)

                that.setData({
                  isLiked: isLiked,
                  currentCardid: currentID,
                })

              }
            } else {
              collcterArray.push(ress.data)
              console.log(collcterArray)
              collcterNum = collcterNum + 1
              res[0].set('collecter', collcterArray)
              res[0].set('collectNum', collcterNum)
              that.setData({
                isLiked: isLiked,
                currentCardid: currentID,
              })
            }
            res[0].save();
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
    console.log(id)
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
  },
  goother:function(){
    wx.navigateTo({
      url: '../other/index',
    })
  },

  chang_img:function(e){
    that = this
    var modul = that.data.modul
    modul == undefined? 'card': modul
    var itemid = e.currentTarget.dataset.cardid
    var Card = Bmob.Object.extend(modul);
    var query = new Bmob.Query(Card);
    query.equalTo("objectId", itemid)
    wx.getStorage({
      key: 'user_id',
      success: function(res) {
        console.log(res.data)
        var current_id = res.data
        var isLiked = false

        query.find({
          success: function (result) {
            // console.log(result);
            var collectNum = result[0].get('collectNum')
            var collecterUser = result[0].get('collecter')
            if(collecterUser.length > 0){
              console.log('本文章已经有收藏的人了')
              for(var i = 0 ;i < collecterUser.length; i++){
                console.log(collecterUser[i].collecter )
                if (collecterUser[i].collecter == current_id){
                  console.log('这个用户已在收藏者列表')//删除此用户

                  collectNum = collectNum - 1
                  collectNum < 0 ? collectNum = 1 : collectNum = collectNum
                  collecterUser.remove(collecterUser[i])
                  result[0].set("collecter",collecterUser)
                  result[0].set("collectNum", collectNum)

                  // result[0].save()
                  isLiked = true
                  that.setData({
                    isLiked: isLiked
                  })

                  break
                }
              }

              if (isLiked == false) {
                console.log('当前的用户还不在收藏的列表里')//添加进来新的用户
                var newUser = new Object()
                newUser.collecter = current_id
                newUser.likedimg = '../../images/icon/praise_orange@3x.png'
                collectNum = collectNum + 1
                collecterUser.push(newUser)

                result[0].set("collecter", collecterUser)
                result[0].set("collectNum", collectNum)

              }

            }else{
              var newUser = new Object()
              newUser.collecter = current_id
              newUser.likedimg = '../../images/icon/praise_orange@3x.png'
              collectNum = collectNum + 1
              collecterUser.push(newUser)
              result[0].set("collecter", collecterUser)
              result[0].set("collectNum", collectNum)
            }

            result[0].save()
           
          },
          error: function (result, error) {
            console.log("查询失败");
          }
        }); 
      },
    }) 
  }
})
