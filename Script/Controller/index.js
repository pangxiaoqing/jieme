;!function(){
	var url_arr = [
		'../Script/Services/AppCommonService.js',
		'../Script/Methods/AppCommonMethods.js',
		'../Script/Libs/jquery.cookie-min.js'
	];
	hmd.require(url_arr,function(){
		var methods = hmd.methods,
			service = hmd.service,
			html_arr = ['login_userPhone','login_password','login_code','register_userPhone','register_password','register_password_confirm','register_checkCode','zss_register_password','zss_register_password_confirm','zss_register_submit','zss_username','zss_idcard','zss_forget_userPhone','zss_forget_checkCode']
		
		//加载头部
		$('#header').load('header.html',function(){
			//登录按钮
			$('#login').click(function(){
				methods.operateLayer({$obj:$('#orderForm')},function(){
					methods.clearText(html_arr);
				});
			});
			//注册按钮
			$('#register').click(function(){
				methods.operateLayer({$obj:$('#orderForm2')},function(){
					methods.clearText(html_arr);
				})
			});
			//获取验证码
			$('#imagecode').click(function(){
				methods.operateImageCode($(this));
			});
			
			//免费注册
			$('#login_register').click(function(){
				methods.maskLayerObj.close();
				methods.operateLayer({$obj:$('#orderForm2')},function(){
					methods.clearText(html_arr);
				});
			});
			//立即注册
			$('#register_submit').click(function(){
				var userPhone = $('#register_userPhone').val(),
					password = $('#register_password').val(),
					register_password_confirm = $('#register_password_confirm').val(),
					checkCode = $('#register_checkCode').val();
				if(password != register_password_confirm){
					methods.popupInfo('密码和确认密码不一样！','error');
					return false;
				}
				
				//校验验证码
				service.checkcode({
					userPhone : userPhone,
					code : checkCode,
					codeType : 0,
					codeClass : 1
				},function(response){
					if(response.status == 1){
						service.register({
							userPhone : userPhone,
							password : password,
							checkCode : checkCode,
							codeClass : 1,
							inviteCode : ''
						},function(msg){
							if(msg.status == 1){
								methods.maskLayerObj.close();
								methods.operateLayer({$obj:$('#orderForm')},function(){
									methods.clearText(html_arr);
								});
							}else{
								methods.popupInfo(msg.message,'error');
							}
						});
					}else{
						methods.popupInfo(response.message,'error');
					}
				});
			});
			
			//获取验证码
			$('#register_getcode').click(function(){
				var userPhone = $('#register_userPhone').val(),
					$el = $(this),
					$span = $('#orderForm2').find('span.__code');
				service.getcode({
					userPhone : userPhone,
					codeType : 0,
					codeClass : 1
				},function(response){
					if(response.status == 1){
						methods.countDown({
							$el : $el,
							$span : $span
						}).init();
					}else{
						methods.popupInfo(response.message,'error');
					}
				});
			});
			//登录提交
			$('#login_submit').click(function(){
				var uuid = methods.getCookie('uuid'),
					userPhone = $('#login_userPhone').val(),
					password = $('#login_password').val(),
					code = $('#login_code').val()
				service.login({
					uuid : uuid,
					userPhone : userPhone,
					password : password,
					code : code
				},function(response){
					if(response.status == 1){
						var data = response.data;
						methods.setCookie('token',data.token);
						methods.setCookie('id',data.id);
						methods.maskLayerObj.close();
						methods.loginByStatus();
						
					}else{
						methods.popupInfo(response.message,'error');
					}
				})
			});
			//点击‘我要借款’判断是否跳转login
	        $('#borrow_page').click(function(){
	        	var token = methods.getCookie('token')
        	  if(!token){
        	  	 methods.operateLayer({$obj:$('#orderForm')},function(){
					methods.clearText(html_arr);
				 });
        	  }else{
        	  	$('#wraper').load('borrow.html',function(){
        	  		window.scrollTo(0,0);
        	  	})
        	  }
	        });
	        
			//委托事件到body
			methods.delegate({
				type : 'click',
				$obj : $(document.body),
				callback : function(e){
					var target = e.target;
					if(target.nodeName === 'IMG'){
						if($(target).attr('pxq_status')){
							if($(target).attr('pxq_status') === 'close'){
								methods.maskLayerObj.close();
							}
						}
					}
				}
			});
			//忘记密码
			$('#forgetPwd').click(function(){
				methods.maskLayerObj.close();
				methods.operateLayer({$obj:$('#orderForm5')},function(){
					methods.clearText(html_arr);
				});
			});
			//忘记密码弹出框
			$('#orderForm5').click(function(e){
				var target = e.target;
				if(target.nodeName === 'A'){
					if($(target).hasClass('__getcode')){//获取短信
						var $span = $(this).find('span.__code');
						var userPhone = $('#zss_forget_userPhone').val()
							service.getcode({
								userPhone : userPhone,
								codeType : 2,
								codeClass : 1
							},function(response){
								if(response.status == 1){
									var data = response.data,
										realnamestatus = data.realnamestatus;//是否实名认证(1-以认证   0-未认证)
									methods.pub_data.realnamestatus = realnamestatus;
									methods.pub_data.checkcode = response.data.code;
									methods.pub_data.userPhone = userPhone;
									methods.countDown({
										$el : $(target),
										$span : $span
									}).init();
									methods.popupInfo('验证码已发送，请注意查收！','ok');
								}else{
									methods.popupInfo(response.message,'error');
								}
							});
					}
					if($(target).hasClass('__submit')){//忘记密码下一步
						var _obj = {
									1 : 'zss_orderForm4',
									0 : 'zss_orderForm3'
								};
						if(_obj[methods.pub_data.realnamestatus]){
							methods.maskLayerObj.close();
							methods.operateLayer({$obj:$('#'+_obj[methods.pub_data.realnamestatus])},function(){
								methods.clearText(html_arr);
							});
						}else{
							methods.popupInfo('验证码有误！','error');
						}
					}
				}
				
			});
			
			//修改密码已认证的下一步
			$('#forget_authentication_next').click(function(){
				var realname = $('#zss_username').val(),
					idcard = $('#zss_idcard').val(),
					pub_data = methods.pub_data;
				pub_data.realname = realname;
				pub_data.idcard = idcard;
			});
			
			//修改密码提交
			$('#zss_register_submit').click(function(){
				var pub_data = methods.pub_data,
					realnamestatus = pub_data.realnamestatus,
					userPhone = pub_data.userPhone,
					password = $('#zss_register_password').val(),
					password_confirm = $('#zss_register_password_confirm').val(),
					realname = realnamestatus == 1 ? pub_data.realname : '',
					idcard = realnamestatus == 1 ? pub_data.idcard : '',
					checkCode = methods.pub_data.checkcode;
				methods.alterPassword({
					userPhone : userPhone,
					password : password,
					password_confirm : password_confirm,
					realname : realname,
					idcard : idcard,
					checkCode : checkCode,
					codeClass : 1
				},function(response){
					if(response.status == 1){
						methods.maskLayerObj.close();
						methods.operateLayer({$obj:$('#orderForm')},function(){
							methods.clearText(html_arr);
						});
					}else{
						methods.popupInfo(response.message,'error');
					}
				});
			});
			/*
	         * @description 资金托管
	         */
			$('#fund_deposit').find('a.__deposit').click(function(){
				methods.getInfoFromAccount({
	        		url : 'openaccount',
	        		data : {
	        			userId : methods.getCookie('id')
	        		},
	        		callback : function(response){
	        			if(response.status == 1){
	        				var data = response.data;
	        				methods.submitDataToAccount({
	        					url : data.url,
	        					json : JSON.stringify(data.json)
	        				});
	        			}else{
	        				methods.popupInfo(response.message,'error');
	        			}
	        		}
	        	});
			});
			
			/*
			 * @description 授权
			 */
			$('#authority_handle').find('a.__authority').click(function(){
				methods.getInfoFromAccount({
	        		url : 'authorize',
	        		data : {
	        			userId : methods.getCookie('id')
	        		},
	        		callback : function(response){
	        			if(response.status == 1){
	        				var data = response.data;
	        				methods.submitDataToAccount({
	        					url : data.url,
	        					json : JSON.stringify(data.json)
	        				});
	        			}else{
	        				methods.popupInfo(response.message,'error');
	        			}
	        		}
	        	});
			});
			
			
			$('#footer').load('footer.html',function(){});
		});
	});
	
	
}();
