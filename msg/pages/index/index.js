// index.js
var common = require('../../utils/common.js')
var app = getApp()
var Bmob = require("../../utils/bmob.js");

var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 1,
    card: [],
    bar_titles: '',
    labels: [],
    pageSize: 2,
    limit: 0,
    likedPic:'../../images/star.png',
    picUrl:'../../images/weekly.jpg'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log('加载页面')
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


  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    getLabel('labels');
    //首页展示卡片数量
    if (this.data.card.length > 5) {
      this.setData({
        show_more: true
      })
    } else {
      this.setData({
        show_more: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (init_arg) {
    //默认展示第一个标签下的卡片
    that = this;
    var bar_lists;

    if (init_arg === undefined || init_arg === 'labels' || init_arg ===''){
      bar_lists = Bmob.Object.extend('labels');
    }else{
      bar_lists = Bmob.Object.extend('modLabel');
    }

    var query = new Bmob.Query(bar_lists);
    var bar_lists = new Array();
    query.find({
      success: function (res) {
        for (let i = 0; i < res.length; i++) {
          var bar_init = {};

          bar_init.name = res[i].get("label_name")
          bar_init.mod = res[i].get("mod")

          bar_lists.push(bar_init)
        }
        console.log(bar_lists)
        // var mod;
        filterBar(bar_lists[0].name, bar_lists[0].mod);
        that.setData({
          bar_titles: bar_lists[0].name
        })

      }
    })
  },
//这里要大改 
  show_bar_title(e) {
    that = this;
    var curre_bar = e.currentTarget.dataset.bar
    var mod = e.currentTarget.dataset.mod
    console.log(mod)
    // var Cards = Bmob.Object.extend("card");//card 要换
    var Cards;
    if (mod ==='card') {
      Cards = Bmob.Object.extend('card');//---换
      console.log('数据是card')
    } else {
      Cards = Bmob.Object.extend('module0');//---换
      console.log(Cards)
      console.log('数据是module0')
    }
    var query = new Bmob.Query(Cards);
    that.setData({
      bar_titles: curre_bar,
      card: [],
      limit: 2
    })
    filterBar(curre_bar,mod);
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
    // console.log('加载更多')
    var limit = that.data.limit
    // console.log("上拉加载更多...." + that.data.limit)
    that.setData({
      limit: limit + that.data.pageSize,

    });
    this.onShow()
  },

  share_img(e) {
    //本是收藏的函数
    console.log('点击了✨')
    
  if(  this.data.likedPic === '../../images/star.png'){
    this.data.likedPic === '../../images/liked.png'
    this.setData({
      likedPic: '../../images/liked.png'
    })
    } else{
       this.setData({
         likedPic: '../../images/star.png'
       })
       }
  },
  clip(options) {
    console.log('点击了复制')
    console.log(options)
    that = this;
    var opt_id = options.currentTarget.dataset.id
    var clip_mod = options.currentTarget.dataset.clip_mod
    console.log(clip_mod)
    var Clip;
    if (clip_mod === 'module0') {
      Clip = Bmob.Object.extend('module0');//card 要换
    } else {
      Clip = Bmob.Object.extend('card');//card 要换
    }
    // var Clip = Bmob.Object.extend('card');//card 要换
    var query = new Bmob.Query(Clip);
    query.get(opt_id, {
      success: function (results) {
        console.log(results)
        wx.setClipboardData({
          data: results.attributes.case_name,
          success: function (res) {
            // 阳澄湖大闸蟹
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
      }
    })

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    console.log(res)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)

      return {
        title: '来自没事干研究员',
        path: '/pages/index/index',

        success: function (res) {
          // 转发成功
          console.log(res)
        },
        fail: function (res) {
          // 转发失败
          console.log('失败')
        }
      }
    }

  },

  //点击modile会刷新相应的数据


  select_module: function (e) {
    console.log(e)
    var mod = e.currentTarget.dataset.mod
    console.log(mod)//card
    var label = e.currentTarget.dataset.label
    console.log(label)
    this.setData({
      card:[],
      labels:[]
    })
    getLabel(label)

    // formod(mod)
    this.onShow(label)

    // filterBar(arg,mod)
    // var labes = e.currentTarget.dataset.label
    //点击后 样式改变 
  }
})


//获取所有的标签数据
var testArr;
function getLabel(arg) {
  // console.log('标签')
  console.log(arg)
  that.setData({
    loading: false
  });
  var labels = new Array();
  var Labels;
  if (arg === 'labels') {
    Labels = Bmob.Object.extend('labels');
  } else {
    Labels = Bmob.Object.extend('modLabel');
  }
  var query = new Bmob.Query(Labels);
  query.find({
    success: function (results) {
      for (let i = 0; i < results.length; i++) {
        var label = {};
         label.name = results[i].get("label_name")
         label.mod = results[i].get("mod")
        labels.push(label);
      }
      // console.log(labels)
      testArr = labels
      that.setData({
        loading: true,
        labels: labels
      });
    },
    error: function (error) {
      common.dataLoading(error, "loading");
      console.log(error)
    }
  });
}
//根据不同的标签 选择不同标签的卡片数据
function filterBar(arg,mod) {

  //如果是最后一页则不执行下面代码
  // console.log(that.data.limit)
  if (that.data.limit > that.data.pageSize && that.data.limit - that.data.pageSize >= that.data.count) {
    // console.log("stop")
    common.showModal("别扯了 已经到底了")
    return false;
  }
  that.setData({
    loading: false
  });
  var molist = new Array();

  var Cards ;
  if(mod === 'card'){
    Cards = Bmob.Object.extend('card');//---换
  }else{
    Cards = Bmob.Object.extend('module0');//---换
  }
  var query = new Bmob.Query(Cards);
  if (that.data.limit == that.data.pageSize) {
    query.limit(that.data.limit);
  }
  if (that.data.limit > that.data.pageSize) {
    query.limit(that.data.limit)
  }
  //条件查询
  query.equalTo("bar_titles", arg);
  // query.descending("title");
  // query.include("brand");
  // 查询所有数据
  query.find({
    success: function (results) {
      // console.log(results.length)
      that.setData({
        loading: true,
        count: results.length
      });
      for (var i = 0; i < results.length; i++) {
        var title = results[i].get("title");
        var brand = results[i].get("brand");
        var id = results[i].id;
        var clip_mod = results[i].get("clip_mod")
        var case_name = results[i].get("case_name")
        var createdAt = results[i].createdAt;
        var _url;
        var bar_title = results[i].get("bar_titles");
        var author_name = results[i].get("author_name");
        var jsonA;
        jsonA = {
          "bar_title": bar_title || '',
          "title": title || '',
          "brand": brand || '',
          "id": id || '',
          "case_name": case_name || '',
          "created_at": createdAt || '',
          "author_name": author_name || '',
          "clip_mod": clip_mod || ''
        }
        molist.push(jsonA)
        that.setData({
          card: molist,
          // loading: true
        })
        //没有卡片的话就不要写这个卡的标签了 
        // console.log(that.data.card)
      }
    },
    error: function (error) {
      common.dataLoading(error, "loading");
      console.log(error)
    }
    // success:fun
  });
}
function formod(mod) {
  var molist = new Array();
  var Cards = Bmob.Object.extend(mod);//---换
  var query = new Bmob.Query(Cards);
  if (that.data.limit == that.data.pageSize) {
    query.limit(that.data.limit);
  }
  if (that.data.limit > that.data.pageSize) {
    query.limit(that.data.limit)
  }
  //条件查询
  // query.equalTo("bar_titles", arg);
  // query.descending("title");
  // query.include("brand");
  // 查询所有数据
  query.find({
    success: function (results) {
      // console.log(results.length)
      that.setData({
        loading: true,
        count: results.length
      });
      for (var i = 0; i < results.length; i++) {

        var title = results[i].get("title");
        var brand = results[i].get("brand");
        var id = results[i].id;
        var clip_mod = results[i].get("clip_mod")

        var case_name = results[i].get("case_name")
        var createdAt = results[i].createdAt;
        var _url;
        var bar_title = results[i].get("bar_titles");
        var author_name = results[i].get("author_name");
        var jsonA;
        jsonA = {
          "bar_title": bar_title || '',
          "title": title || '',
          "brand": brand || '',
          "id": id || '',
          "case_name": case_name || '',
          "created_at": createdAt || '',
          "author_name": author_name || '',
          "clip_mod": clip_mod || ''

        }
        molist.push(jsonA)
        that.setData({
          card: molist,
          // loading: true
        })
        console.log(molist);
        //没有卡片的话就不要写这个卡的标签了 
        // console.log(that.data.card)
      }
    },
    error: function (error) {
      common.dataLoading(error, "loading");

      console.log(error)
    }
    // success:fun
  });
}

function clearinitdata(){
  // that = this;
  this.setData({
    card:[],
    labels:[]
  })
}