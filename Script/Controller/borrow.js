;!function(){
	var methods = hmd.methods,
		service = hmd.service;
	$('#mainarea').load('content/loggingin.html',function(){
		//使  我要借款  为高亮选中状态
		methods.operateEventsByAttributes($(document.body));

        hmd.methods.operateMenuLight('borrow_page',function(){
            $(".banner").css("display","block");
            $("#wraper").css("width","1200px");
            $('#wraper').removeClass('w_wraper');
            $("#header").css("border-bottom","1px solid #ccc");
        })

        //加载右侧主体部分高度，使左边部分与右边部分高度一致
        var $height =  $("#mainarea").height();
        $("#sidebar").css("height",$height);
        //点击提交按钮后跳转至  submited界面 并将页面置顶
        $("#sub_login").click(function(){
        	service.loanapply({
        		userId : methods.getCookie('id'),
        		loanAmount : $('#loanAmount').val(),
        		applyDeadline : $('#applyDeadline').find('option:selected').attr('value'),
        		loanUrgent : encodeURIComponent($('#wraper').find('input[type=radio][name=loanUrgent]:checked').val()),
        		monthlyRepaymentMax : $('#monthlyRepaymentMax').val(),
        		loanUse : $('#loanUse').find('option:selected').attr('value'),
        		longitude : '',
        		latitude : ''
        	},function(response){
        		if(response.status == 1){
        			$('#mainarea').load('content/submited.html',function(){
			            window.scrollTo(0,0);
			          });
        		}else{
        			methods.popupInfo(response.message,'error');
        		}
        	});
        });
        //点击充值按钮后跳转至  充值界面 并将页面置顶
        /*$("#recharge_div").click(function(){
            $('#mainarea').load('content/recharge.html',function(){
                window.scrollTo(0,0);
                $("#ins_Recharge").click(function(){
                    $('#mainarea').load('content/suc_Recharge.html',function(){
                        window.scrollTo(0,0);
                    });
                });
            });
        });*/
       /*
        * @description 页面初始化
        */
        function init(){
        	methods.notLogin(function(){
	        	methods.queryAccountInfo(function(response){
	        		if(response.status == 1){
	        			var data = response.data;
	        			if(data.bankCardNum){
	        				$('#accountMoney').html(response.data.usableBalance);
	        				$('#sidebar').find('div.fund_deposit').hide();
	        				if(data.authorize == 0){//判断是否授权 0表示未授权  1表示已授权
	        					methods.operateLayer({$obj:$('#authority_handle')},function(){});
	        				}
	        			}else if(!data.bankCardNum){
	        				methods.operateLayer({$obj:$('#fund_deposit')},function(){
								methods.clearText(methods.pub_data.html_arr);
								$('#sidebar').find('div.fund_deposit').show();
							});
	        			}
	        		}
	        	});
        	});
        }
        init();
        
        /*
         * @description 将方法委托到div#sidebar
         */
        methods.delegate({
        	$obj : $('#sidebar'),
        	callback : function(e){
        		var target = e.target;
        		if(target.nodeName === 'DIV'){
        			if($(target).hasClass('fund_deposit')){//开通资金托管
        				methods.operateLayer({$obj:$('#fund_deposit')},function(){});
        			}
        			if($(target).hasClass('recharge_div')){//充值
        				$('#mainarea').load('content/recharge.html',function(){
			                window.scrollTo(0,0);
			                //获取用户信息
			                methods.queryAccountInfo(function(response){
				        		if(response.status == 1){
				        			var data = response.data,
				        				arr = ['usableBalance','cost'];
				        			$(arr).each(function(index,element){
				        				$('#'+element).html(data[element]);
				        			});
				        		}else{
				        			methods.popupInfo(response.message,'error');
				        		}
				        	});
				        	//获取银行列表
				        	service.getbanklist(function(response){
				        		if(response.status == 1){
				        			methods.operateBankList(response.data,'__banks_list');
				        		}else{
				        			methods.popupInfo(response.message,'error');
				        		}
				        	});
			                $("#ins_Recharge").click(function(){//充值按钮
			                	var _for = $(this).attr('for'),
			                		bankCode;
			                	if(_for === 'one1'){
				                	methods.getInfoFromAccount({
						        		url : 'topup',
						        		data : {
						        			userId : methods.getCookie('id'),
						        			amount : $('#amount').val()
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
			                	}else{
			                		bankCode = $('#__banks_list').find('input[type=radio][name=rad]:checked');
			                		if(bankCode.length == 0){
			                			methods.popupInfo('请选择银行！','error');
			                			return false;
			                		}
			                		methods.getInfoFromAccount({
						        		url : 'uniontopup',
						        		data : {
						        			userId : methods.getCookie('id'),
						        			amount : $('#__bank_amount').val(),
						        			bankCode : bankCode.attr('id')
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
			                	}
			                    /*$('#mainarea').load('content/suc_Recharge.html',function(){
			                        window.scrollTo(0,0);
			                    });*/
			                });
			            });
        			}
        			if($(target).hasClass('cash_div')){//提现
        				$('#mainarea').load('content/cash.html',function(){
			                window.scrollTo(0,0);
			                var $height =  $("#mainarea").height();
			                $("#sidebar").css("height",$height);
			                //获取用户信息
			                methods.queryAccountInfo(function(response){
				        		if(response.status == 1){
				        			var data = response.data,
				        				arr = ['realName','bankName','bankCardNum','usableBalance','cost'];
				        			$(arr).each(function(index,element){
				        				$('#'+element).html(data[element]);
				        			});
				        		}else{
				        			methods.popupInfo(response.message,'error');
				        		}
				        	});
			                
			                $("#apply_cash").click(function(){
			                	methods.getInfoFromAccount({
					        		url : 'withdraw',
					        		data : {
					        			userId : methods.getCookie('id'),
					        			amount : $('#amount').val()
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
			                    /*$('#mainarea').load('content/suc_Cash.html',function(){
			                        window.scrollTo(0,0);
			                    });*/
			                });
			            });
        			}
        		}
        		if(target.nodeName === 'A'){
        			if($(target).hasClass('change_password')){//修改支付密码
        				methods.getInfoFromAccount({
			        		url : 'uppaypwd',
			        		data : {
			        			userId : methods.getCookie('id'),
			        			busiTp : 4
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
        			}
        		}
        	}
        });
        
    });
}();
