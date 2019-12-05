// pages/mine/coupon/mine/mine.js
const api = require("../../../../config/api.js");
const util = require("../../../../utils/util.js");
var bol = true;
Page({
  data: {
    type: '已领取',
    action: ['action','',''],
    ylqPage: 1,
    ylqList: [],
    ysyPage: 1,
    ysyList: [],
    ygqPage: 1,
    ygqList: [],
    tiptxt: ''
  },
	onLoad: function(option){
		let that = this;
		wx.getSystemInfo({
		  success: (result)=>{
		    let h = 750/result.windowWidth*result.windowHeight;
		    that.setData({
		      scrollHeight: h - 118
		    })
		  }
		});
		this.getList('已领取',1);
	},
	getList: function(type,page){
		let types = '';
		let that = this;
		that.setData({
			tiptxt: '加载中...'
		})
		util.request(api.couponMine,{status:type,page:page},'POST').then(res=>{
      console.log(res)
			if(res.errcode===1){
				if(type=='已领取'){
					if(page==1){
						that.setData({
							ylqList: []
						})
					}
					let ylq = that.data.ylqList;
					res.data.forEach(el => {
						ylq.push(el);
					});
					that.setData({
						ylqList: ylq,
						ylqPage: page + 1
					})
				}
				if(type=='已使用'){
					if(page==1){
						that.setData({
							ysyList: []
						})
					}
					let ysy = that.data.ysyList;
					res.data.forEach(el => {
						ysy.push(el);
					});
					that.setData({
						ysyList: ysy,
						ysyPage: page + 1
					})
				}
				if(type=='已过期'){
					if(page==1){
						that.setData({
							ygqList: []
						})
					}
					let ygq = that.data.ygqList;
					res.data.forEach(el => {
						ygq.push(el);
					});
					that.setData({
						ygqList: ygq,
						ygqPage: page + 1
					})
				}
				that.setData({
					tiptxt: ''
				})
			}else{
				// wx.showModal({
				//   title: '提示',
				//   content: res.errmsg,
				//   showCancel: false
				// });
				that.setData({
					tiptxt: res.errmsg
				})
			}
      bol = true
		}).catch(err=>{
			console.log('错误，',err);
			that.setData({
				tiptxt: '优惠券获取失败，请重试'
			})
		})
	},
	tabNav: function(e){
		let type = e.currentTarget.dataset.type;
		if(type=='已领取'){
			this.setData({
				type: type,
				action: ['action','','']
			})
			if(this.data.ylqList.length==0){
				this.getList(type,1);
			}
		}
		if(type=='已使用'){
			this.setData({
				type: type,
				action: ['','action','']
			})
			if(this.data.ysyList.length==0){
				this.getList(type,1);
			}
		}
		if(type=='已过期'){
			this.setData({
				type: type,
				action: ['','','action']
			})
			if(this.data.ygqList.length==0){
				this.getList(type,1);
			}
		}
	},
	goDetail: function(e){
		let id = e.currentTarget.dataset.id;
		wx.navigateTo({
			url: '../detail/detail?id='+id
		});
	},
	goBottom: function(e){
    console.log(bol)
    var that = this;
    if(bol){
      bol = false;
      let page = 1;
      let type = that.data.type;
      if (type == '已领取') {
        page = that.data.ylqPage
        console.log(page)
      }
      if (type == '已使用') {
        page = that.data.ysyPage
      }
      if (type == '已过期') {
        page = that.data.ygqPage
      }
      that.getList(type, page)
    }
	},
	tabCenter: function(){
		wx.redirectTo({
			url: '/pages/mine/coupon/center/center'
		})
	}
})
