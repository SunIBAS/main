/*
* @Author: layui-2
* @Date:   2018-08-31 11:40:42
* @Last Modified by:   layui-2
* @Last Modified time: 2018-09-04 14:44:38
*/
layui.define(['jquery','layer'],function(exports){
  "use strict";
  var $ = layui.jquery,layer = layui.layer
      //外部接口
      ,inputTags = {
        config: {}

        //设置全局项
        ,set: function(options){
          var that = this;
          that.config = $.extend({}, that.config, options);
          return that;
        }

        // 事件监听
        ,on: function(events, callback){
          return layui.onevent.call(this, MOD_NAME, events, callback)
        }

      }

      //操作当前实例
      ,thisinputTags = function(){
        var that = this
            ,options = that.config;

        return {
          config: options,
          get value() {
            return this.config.content;
          },
          addTag(tag) {
            that.addTag(tag);
          },
          removeTag(tag) {
            that.removeTag(tag);
          },
          clearTag() {
            that.clearTag();
          },
        }
      }

      //字符常量
      ,MOD_NAME = 'inputTags'

      // 构造器
      ,Class = function(options){
        var that = this;
        that.config = $.extend({
          aldaBtn: false
        }, that.config, inputTags.config, options);
        that.render();
      };

  //默认配置
  Class.prototype.config = {
    close: false  //默认:不开启关闭按钮
    ,theme: ''   //背景:颜色
    ,content: [] //默认标签
    ,aldaBtn: false //默认配置
  };

  // 初始化
  Class.prototype.init = function(){
    var that = this
        ,spans = ''
        ,options = that.config
        ,span = document.createElement("span"),
        spantext = $(span).text("获取全部数据").addClass('albtn');
    if(options.aldaBtn){
      $('body').append(spantext)
    }

    $.each(options.content,function(index,item){
      spans +='<span content="' + item + '"><em>'+item+'</em><button type="button" class="close">×</button></span>';
      // $('<div class="layui-flow-more"><a href="javascript:;">'+ ELEM_TEXT +'</a></div>');
    })
    options.elem.before(spans)
    that.events()
  }

  Class.prototype.render = function(){
    var that = this
        ,options = that.config
    options.elem = $(options.elem);
    that.enter()
  };

  // 回车生成标签
  Class.prototype.enter = function(){
    var that = this
        ,options = that.config;
    options.elem.focus();
    options.elem.keypress(function(event){
      var keynum = (event.keyCode ? event.keyCode : event.which);
      if(keynum == '13'){
        var $val = options.elem.val().trim();
        if(!$val) return false;
        that.addTag($val);
      }
    })
  };
  Class.prototype.addTag = function($val) {
    let that = this;
    let options = that.config;
    let spans = "";
    if(options.content.indexOf($val) == -1){
      options.content.push($val)
      that.render()
      spans ='<span content="' + $val + '"><em>'+$val+'</em><button type="button" class="close">×</button></span>';
      options.elem.before(spans)
    }
    options.done && typeof options.done === 'function' && options.done($val);
    options.elem.val('');
  }
  Class.prototype.removeTag = function($val) {
    let options = this.config;
    let tags = options.elem.parent().find(`span[content='${$val}']`);
    let ind = 0;
    for (;ind < options.content.length;ind++) {
      if (options.content[ind] === $val) {
        break;
      }
    }
    if (tags.length === 1 && ind < options.content.length) {
      tags.remove();
      options.content.splice(ind,1);
    }
  }
  Class.prototype.clearTag = function() {
    this.config.elem.parent().find(`span[content]`).remove();
    this.config.content = [];
  }

  //事件处理
  Class.prototype.events = function(){
    var that = this
        ,options = that.config;
    $('.albtn').on('click',function(){
      console.log(options.content)
    })
    $('.input_tagss').on('click','.close',function(){
      var Thisremov = $(this).parent('span').remove(),
          ThisText = $(Thisremov).find('em').text();
      let rInd = $.inArray(ThisText,options.content);
      if (rInd !== -1) {
        options.content.splice(rInd,1);
      }
    })
  };

  //核心入口
  inputTags.render = function(options){
    var inst = new Class(options);
    inst.init();
    return thisinputTags.call(inst);
  };
  exports('inputTags',inputTags);
  setTimeout(() => {
    document.head.innerHTML += `<style>em{font-style:normal}.input_tagss{width:406px;padding:10px;color:#777;border:1px solid #d5d5d5;background-color:#fff;box-sizing: border-box;}.input_tagss span{font-size:12px;font-weight:normal;line-height:16px;position:relative;display:inline-block;height:16px;margin-right:3px;margin-bottom:3px;padding:4px 22px 5px 9px;cursor:pointer;transition:all .2s ease 0s;vertical-align:baseline;white-space:nowrap;color:#fff;background-color:#009688;text-shadow:1px 1px 1px rgba(0,0,0,.15)}.input_tagss .close{font-size:12px;font-weight:bold;line-height:20px;position:absolute;top:0;right:0;bottom:0;float:none;width:18px;padding:0;cursor:pointer;text-align:center;opacity:1;color:#fff;border:0 none;background:transparent none repeat scroll 0 0;text-shadow:none}.input_tagss .close:hover{background:#ffb800}.input_Tags_input[type='text'],.input_Tags_input[type='text']:focus{line-height:25px;display:inline;width:150px;margin:0;padding:0 6px;border:0 none;outline:0 none;box-shadow:none}.albtn{line-height:30px;display:block;width:100px;height:30px;margin:0 auto;cursor:pointer;text-align:center;color:#fff;background:#ffb800}</style>`;
  },200);
});//.link('./inputTags.css')