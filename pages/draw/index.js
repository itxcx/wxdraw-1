const opt = require('js/opt.js');
const tpler = require('js/tpler.js');
var _ = tpler();
var c = _.createOptCycle(opt);
console.log(c)

Page({
  data: c.viewData(),
  checkHandler:function(e){
    console.log(e)
    for (var key in c.data.shape){
      if (_.isObject(c.data.shape[key])){
        if (e.detail.value.indexOf(key) >= 0) {
          c.data.shape[key].auto = true;
        } else {
          c.data.shape[key].auto = false;
        }
      }
      
    }
    this.setData(c.viewData());

  },
  configHandler: function () {
    this.motion && this.motion.stop();
    this.setData({ showConfig: !this.data.showConfig, showCanvas: this.data.showConfig });
  },
  tabHandler: function (event) {
    console.log(event)
    var id = event.target.id;
    for (var key in c.data) {
      c.data[key].active = false;
    }
    c.data[id].active = true;
    this.setData(c.viewData());
  },
  startHandler: function () {
    this.setData({ showConfig: false, showCanvas:true });
    var self = this;
    console.log(this)
    var opt = c.init();
    this.motion && this.motion.stop();
    if (opt.motion.switch == "on") {
      this.motion = this.draw.motion(opt);
    } else {
      this.draw.group(opt);
    }
  },
  upper: function (e) {
  },
  lower: function (e) {
  },
  scroll: function (e) {
  },
  onLoad: function () {
  },
  onReady: function () {
    var self = this;
    var context = this.context = wx.createCanvasContext('canvas', this);
    for (var key in c.methods) {
      this[key] = (function (e) {
        console.log(e)
        var key = this;
        c.methods[key] && c.methods[key]();
        self.setData(c.viewData())
      }).bind(key);
    }

    wx.getSystemInfo({
      success: function (res) {
        var w = res.windowWidth, h = res.windowHeight-100;
        self.setData({w:w,h:h})
        self.draw = _.draw({
        }, {
            width: w, height: h,
            context: context,
            callback: function (context) {
              if (!context) return;
              var actions = context.getActions()
              wx.drawCanvas({
                canvasId: 'canvas',
                actions: actions
              })
            }
          });
        self.startHandler.call(self);
      }
    });
  }
})

