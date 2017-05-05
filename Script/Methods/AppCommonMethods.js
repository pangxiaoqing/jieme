hmd.extend(hmd.methods,{
	/*
	 * @接收一些公共信息
	 */
	pub_data : {
		//获取短信信息
		checkcode : null,
		realnamestatus : '',
		userPhone : '',
		realname : '',
		idcard : '',
		form_id : 'odiv201609021635',//生成一个form表单的id，根据此id来删除form表单
		html_arr : ['login_userPhone','login_password','login_code','register_userPhone','register_password','register_password_confirm','register_checkCode','zss_register_password','zss_register_password_confirm','zss_register_submit','zss_username','zss_idcard','zss_forget_userPhone','zss_forget_checkCode'],
		time : 60//倒计时
	},
	/*
	 * @description 对遮罩层的操作
	 */
	maskLayerObj : {
		maskLayer : function(_label){
			var _doc = document,
				getHTMLSize = this.getHTMLSize(),
				_width = getHTMLSize.width,
				_height = getHTMLSize.height,
				_mask = _doc.createElement(_label);
			_mask.id = 'masklayer201608241556';
			_mask.style.cssText = 'position: absolute;top:0;left: 0;width:'+_width+'px;height:'+
			_height+'px;background-color:#000;opacity:0.7;filter:alpha(opacity=70);z-index:9999';
			$(_doc.body).append(_mask);
		},
		//获取遮罩层的宽度和高度
		getHTMLSize : function(win){
			win = win || document.body;
			var _doc =document;
			var _width = $(win).width(),
				_height = $(win).height();
			return {width:_width,height:_height}
		},
		layer_id : 'masklayer201608241556',
		//关闭遮罩层
		_close : function(){
			$('#'+this.layer_id).remove();
		},
		//打开遮罩层
		_open : function(_label){
			this.maskLayer(_label);
		},
		//记录弹出层
		$currentDiv : null,
		//关闭弹出层
		close : function(){
			if(this.$currentDiv){
				this._close();
				this.$currentDiv.hide();
				this.$currentDiv = null;
			}
		}
	},
	/*
	 * @description 弹出层的操作
	 * @this作用域改变成页面元素
	 * @params obj 一个对象里面包括 label(标签):你要创建什么页面元素，比如label:'div'
	 * $obj 表示页面元素，是jquery对象
	 * hmd.methods.maskLayerObj.close();关闭
	 * hmd.methods.operateLayer({$obj:$('#orderForm2')},function(){
					methods.clearText(html_arr);
				});
	 */
	operateLayer : function(obj,callback,$img){
		var label = obj && obj.label ? obj.label : 'div',
			$obj = obj.$obj,//弹出层的jquery对象
			self = this,
			$img = $img || $('#imagecode'),
			__maskLayerObj = this.maskLayerObj;
		__maskLayerObj.$currentDiv = $obj;
		__maskLayerObj._open(label);
		var getHTMLSize = __maskLayerObj.getHTMLSize(window),
			_scroll_top = $(window).scrollTop(),
			_top = getHTMLSize.height/2 - $obj.height()/2+_scroll_top,
			_left = getHTMLSize.width/2 - $obj.width()/2;
		$obj[0].style.cssText = 'position:absolute;top:'+_top+'px;left:'+_left+'px;z-index:10000';
		$obj.show();
		callback();
		if($obj[0].id === 'orderForm'){
			//获取验证码
			this.operateImageCode($img);
		}
	},
	/*
	 * @description 获取登录图片验证码
	 * @params $img 验证码图片元素jquery对象
	 */
	operateImageCode : function($img){
		var self = this;
		this.getimagecodeByUUID.call($img,hmd.service,function(response){
			var token = self.getCookie('token'),
				params = 'token='+token+'&phoneSystem=&phoneModel=&appVersion&ip=&channel=pc&platemform=jm'
			self.setCookie('uuid',response.data);
			this.attr('src','/api/code/getimagecode.do?uuid='+response.data+'&'+params);
		});
	},
	/*
	 * @description 将后台信息弹出
	 * @params 如果参数是汉字，那么status(1:成功，2：失败)
	 * @ current_class包括(ico-ok,ico-error)
	 */
	popupInfo : function(code,status){
		var _doc = document,
            _div = _doc.createElement('div'),
            _scroll_top = $(window).scrollTop(),
            _width = $(window).width()/2,
            _height = $(window).height()/2,
            current_class,_code,_status,str = ''
        _div.id = 'error_info_201608261009';
        _div.className = 'zjtg_up';
        
        if(arguments.length == 1){//
        	
        }
        if(arguments.length > 1){
        	if(status === 'ok'){
        		current_class = 'ico-ok';
        		str = '<p>'+code+'</p>';
        	}else if(status === 'error'){
        		current_class = 'ico-error';
        		str = '<p style="color:red;">'+code+'</p>';
        	}
        }
        _div.innerHTML = str;
        _doc.body.appendChild(_div);
        _div.style.cssText = 'top:'+(_height-$(_div).height()/2+_scroll_top)+'px; left: '+(_width-$(_div).width()/2)+'px; z-index:10001;padding:25px;height:auto; ';
        setTimeout(function(){
            $(_div).remove();
        },1000);
	},
	/*
	 * @description 委托代理
	 * @params obj 里面的参数包括：type(代表事件类型，默认为click)
	 * $obj 代表页面元素，jquery对象
	 * callback 代表函数
	 */
	delegate : function(obj){
		var type = obj && obj.type ? obj.type : 'click',
			$obj = obj.$obj,
			callback = obj.callback;
		$obj.bind(type,function(e){
			callback.call(this,e);
		})
		
	},
	/*
	 * @description 验证集合
	 * @params type 输入验证类型  如果没有输入这个参数，可以从元素上取_type这个属性
	 * @作用域改变成页面元素
	 * @return 返回验证结果 boolean
	 * @调用方法  hmd.methods.validate.call($(''))
	*/
	validate : (function(){
		var __validation_reg = {
			'phone' : /^1[3|4|5|7|8]\d{9}$/ 
		};
		return function(type){
			type = type || this.attr('_type');
			var txt = this.val();
			return __validation_reg[type].test(txt);
		}
	}()),
	/*
	 * @description 根据uuid获取图形验证码
	 * @作用域为jquery对象
	 */
	getimagecodeByUUID : function(service,callback){
		service = service || hmd.service;
		var self = this;
		service.get_uuid(function(response){
			if(response.status == 1){
				callback.call(self,response,service);
			}
		});
	},
	setCookie : function(key,value){
		$.cookie(key,value);
	},
	getCookie : function(key){
		return $.cookie(key);
	},
	removeCookie : function(key){
		$.removeCookie(key);
	},
	/*
	 * @description 根据id数组清除文本框内容
	 */
	clearText : function(arr){
		$(arr).each(function(index,element){
			$('#'+element).val('');
		});
	},
	/*
	 * @description 根据cookie切换页面
	 */
	changePageByCookie : function(token,callback){
		callback.call(this,token);
	},
	/*
	 * @登录前后后的状态
	 */
	loginByStatus : function(callback){
		var token = this.getCookie('token');
		if(!token){
			$('#wraper').load('index_con.html')
			$('.logout').hide();
			$('.enten').show();
		}else{
			$('#wraper').load('borrow.html');
			$('.logout').show();
			$('.enten').hide();
			hmd.service.goldaccount({
				userId : this.getCookie('id')
			},function(response){
				if(response.status == 1){console.log(response.data.realName);
					$('#user').html(response.data.realName);
				}
			});
		}
		if(callback){
			callback.call(this,token);
		}
	},
	/*
	 * @description 判断是否登录，如果登录执行callback,否则返回首页面
	 */
	notLogin : function(callback){
		var token = this.getCookie('token'),
			flag = !token ? true : false;
		if(!token){
			$('#wraper').load('index_con.html')
			$('.logout').hide();
			$('.enten').show();
			this.operateMenuLight('index_page')
		}else{
			this.skipPageByLocationSearch();
			if(callback){
				callback.call(this);
			}
		}
	},
	/*
	 * @description 根据location中的search来跳转页面
	 * @search location中的search有type和flag
	 * type中的值有（a表示从金账户注册页面跳转过来，b表示从金账户提现页面跳转过来，c表示金账户出问题404，
	 * d表示快捷充值，e表示修改支付密码，f表示授权）
	 * flag表示成功与否，0表示成功，1表示失败
	 */
	skipPageByLocationSearch : function(){
		if(!window.location.search){
			return false;
		}
		var _location = window.location.search.substring(1),
			obj = this.changeLocationSearchToObject(_location),
			_config = {
				a : {
					0 : 'content/submited.html',
					1 : '资金存管开通失败！'
				},
				b : {
					0 : 'content/suc_Cash.html',
					1 : '提现失败！'
				},
				c : {
					url : './404.html'
				},
				d : {
					0 : 'content/suc_Recharge.html',
					1 : '充值失败！'
				},
				e : {
					0 : 'content/submited.html',
					1 : '修改支付密码失败！'
				},
				f : {
					0 : 'content/submited.html',
					1 : '资金托管授权失败！'
				}
			}
		if(_config[obj.type] && _config[obj.type]['url']){
			window.location.href = _config[obj.type]['url'];
		}else{
			if(obj.flag == 0){
				$('#mainarea').load(_config[obj.type][obj.flag],function(){
		            window.scrollTo(0,0);
		        });
			}else{
				this.popupInfo(_config[obj.type][obj.flag],'error');
			}
		}
	},
	/*
	 *@description 对菜单高亮的操作
	 */
	operateMenuLight : function(id,callback,classname){
		callback = callback || function(){};
		classname = classname || 'navBar_a';
		$('ul.navBar li.'+classname).removeClass('active');
		$('#'+id).closest('li').addClass('active');
		callback.call(this)
	},
	/*
	 * @description 倒计时，默认60秒
	 * @params obj {$el:$el,$span:$span}  $el为按钮 $span为显示时间的标签
	 * @call hmd.methods.countDown({
			$el : $(this),
			$span : $('#ospan')
		}).init();
	 */
	countDown : function(obj){
		var self = this,
			$el = obj.$el,
			$span = obj.$span,
			_time = this.pub_data.time;
		return {
				count : function(){
					var pub_data = self.pub_data;
					if(_time == 0){
						this.clearTime();						
					}else{
						_time--;
						this.operateFn($el,$span,1);
					}
				},
				setTime : function(){
					this.operateFn($el,$span,1);
					var _self = this;
					self.pub_data._count_down_time = setInterval(function(){
						_self.count(obj);
					},1000);
				},
				clearTime : function(){
					clearInterval(self.pub_data._count_down_time);
					_time = self.pub_data.time;
					this.operateFn($el,$span,0);
				},
				/*
				 * @description 获取验证码按钮和显示框的操作
				 * @params $a 代表按钮  $b代表显示框，status 代表状态 1代表按钮操作，0代表显示框
				*/
				operateFn : function($a,$b,status){
					$b.html(_time);
					if(status == 1){
						$a.hide();
						$b.parent().show();
					}else{
						$a.show();
						$b.parent().hide();
					}
				},
				init : function(){
					this.setTime();	
				}
		}
	},
	/*
	 * @description 修改密码通用方法
	 * @params data修改密码的参数，callback为返回函数
	 */
	alterPassword : function(data,callback){
		var self = this;
		hmd.service.findpwd(data,function(response){
			callback.call(self,response)
		});
	},
	/*
	 * @description 生成一个form表单
	 * @params eg:{
			id : 'form_template',
			params : {'%s':'id','%t':'name','%d':'url'},
			data : [{id:'aaa',name:'bbb','url':'aaasdadasda'},{id:'ccc',name:'ddd',url : 'sdfsdfsfsd'}]	
		}
	 */
	generateForm : function(obj){//form_template
		var _doc = document,
			odiv = _doc.createElement('div');
		odiv.id = 'odiv201609021635';
		$(odiv).html(this.generateStringByTemplate(obj)).hide();
		$(_doc.body).append(odiv);
	},
	/*
	 * @description 根据模板和参数生成html串
	 * @params obj {id:id,params : {'%s':'id','%t':'name'},data:[{id:'aaa',name:'bbb'},{id:'ccc',name:'ddd'}]}id表示模板的id,
	 * params表示模板里面的参数 eg:%s可以取到数组每一项里面的key
	 * data表示数据
	 */
	generateStringByTemplate : function(obj){
		var id = obj.id,
			params = obj.params,
			data = obj.data,
			$script = $('#'+id),
			txt = $script.text(),
			param_arr = [],
			param_str = '',
			reg = null,
			_arr = [];
		for(var index in params){
			param_arr.push(index);
		}
		
		param_str = param_arr.join('|');
		reg = new RegExp(param_str,'g');
		$(data).each(function(index,element){
			_arr.push(txt.replace(reg,function(a,b){
				return element[params[a]];
			}));
		});
		return _arr.join('');
			
	},
	/*
	 * @description 将后台返回的数据提交给金账户(通过submit的方式)
	 */
	submitDataToAccount : function(data){
		var pub_data = this.pub_data,
			self = this;
		this.generateForm({
			id : 'form_template',
			params : {'%s':'url','%t':'json'},
			data : data	
		});
		setTimeout(function(){
			var $form = $('#'+pub_data.form_id).find('form');
			$form.submit();
		},500);
	},
	/*
	 * @description 根据id来删除元素
	 */
	delete_element : function(id){
		id = typeof id === 'string' ? $('#'+id) : id;
		id.remove();
	},
	/*
	 * @description 与金账户交互前取回url和json
	 * @params obj 包含参数
	 */
	getInfoFromAccount : function(obj){
		var data = obj.data || {},
			callback = obj.callback,
			url = obj.url;
		hmd.service[url](data,callback);
	},
	/*
	 * @description 查询金账户信息
	 */
	queryAccountInfo : function(callback){
		hmd.service.goldaccount({
			userId : this.getCookie('id')
		},callback);
	},
	/*
	 * @description 把location的search转换成对象
	 * @param s 表示search
	 */
	changeLocationSearchToObject : function(s){
		var arr = s.split('&'),
			obj = {};
		$(arr).each(function(index,element){
			var el = element.split('='),
				_key = el[0],
				_value = el[1];
			obj[_key] = _value;
		});
		return obj;
	},
	operateEventsByAttributes : function($el){
		var self = this;
    	$el.keyup(function(e){
    		var target = e.target;
    		if(target.nodeName === 'INPUT'){
				if(target.type === 'text'){
					if($(target).attr('reg')){
						if($(target).attr('reg') === 'integer'){
							target.value = target.value.replace(/[^\d]/g,'');
						}
						if($(target).attr('reg') === 'decimal' || $(target).attr('reg') === 'decimalII' || $(target).attr('reg') === 'decimalIII'){
							target.value = target.value.replace(/[^\d\.]/g,'');
						}
						if($(target).attr('reg') === 'intAndEnglish'){
							target.value = target.value.replace(/[^\da-zA-Z]/g,'');
						}
					}
				}
			}
    	});
	},
	/*
	 * @description 生成银行列表页面
	 * @params banks后台返回的银行列表  id为父元素
	 */
	operateBankList : function(banks,id){
		var self = this;
			_arr = [],
			$obj = $('#'+id);
		hmd.service.getAPIStatus(function(response){
			$(banks).each(function(index,element){
				_arr.push({
					bankCode : element.bankCode,
					bankName : element.bankName,
					bankImage : response[element.bankCode]['bankImage']
				});
			});
			$obj.html(self.generateStringByTemplate({
				id : 'banks_template',
				params : {'%s':'bankCode','%t':'bankImage','%r':'bankName'},
				data : _arr	
			}));
		});
	}
	
});