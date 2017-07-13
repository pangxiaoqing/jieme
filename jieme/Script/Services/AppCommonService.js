hmd.extend(hmd.service,{
	//公共参数
	getParams : function(data){
		data = data || {};
		var token = hmd.methods.getCookie('token'),
			_data = {
				token : token,
				phoneSystem : '',
				phoneModel : '',
				appVersion : '',
				ip : '',
				channel : 'pc',
				platemform : 'jm'
			}
		return hmd.extend(data,_data);
	},
	//登录
	login : function(data,callback){
		hmd.send({
			url : '/api/user/login.do',
			type : 'post',
			data : this.getParams(data),
			dataType : 'json'
		},callback);
	},
	//登出
	logout : function(data,callback){
		hmd.send({
			url : '/api/user/logout.do',
			type : 'post',
			data : this.getParams(data),
			token : hmd.methods.getCookie('token'),
			dataType : 'json'
		},callback);
	},
	//注册
	register : function(data,callback){
		hmd.send({
			url : '/api/user/regist.do',
			type : 'post',
			data : this.getParams(data),
			dataType : 'json'
		},callback);
	},
	//获取验证码
	getcode : function(data,callback){
		hmd.send({
			url : '/api/code/getcode.do',
			type : 'post',
			data : this.getParams(data),
			dataType : 'json'
		},callback);
	},
	//校验验证码
	checkcode : function(data,callback){
		hmd.send({
			url : '/api/code/checkcode.do',
			type : 'post',
			data : this.getParams(data),
			dataType : 'json'
		},callback);
	},
	//uuid
	get_uuid : function(callback){
		hmd.send({
			url : '/api/code/uuid.do',
			type : 'post',
			dataType : 'json',
			data : this.getParams()
		},callback);
	},
	//找回密码
	findpwd : function(data,callback){
		hmd.send({
			url : '/api/user/findpwd.do',
			type : 'post',
			data : this.getParams(data),
			dataType : 'json'
		},callback);
	},
	//金账户开户
	openaccount : function(data,callback){
		hmd.send({
			url : '/api/gold/openaccount.do',
			type : 'post',
			data : this.getParams(data),
			dataType : 'json',
			token : hmd.methods.getCookie('token')
		},callback);
	},
	//金账户提现
	withdraw : function(data,callback){
		hmd.send({
			url : '/api/gold/withdraw.do',
			type : 'post',
			data : this.getParams(data),
			token : hmd.methods.getCookie('token'),
			dataType : 'json'
		},callback);
	},
	//查询金账户信息
	goldaccount : function(data,callback){
		hmd.send({
			url : '/api/gold/goldaccount.do',
			type : 'post',
			data : this.getParams(data),
			token : hmd.methods.getCookie('token'),
			dataType : 'json'
		},callback);
	},
	//金账户投资/还款授权
	authorize : function(data,callback){
		hmd.send({
			url : '/api/gold/authorize.do',
			type : 'post',
			data : this.getParams(data),
			token : hmd.methods.getCookie('token'),
			dataType : 'json'
		},callback);
	},
	//金账户充值
	topup : function(data,callback){
		hmd.send({
			url : '/api/gold/quicktopup.do',
			type : 'post',
			data : this.getParams(data),
			token : hmd.methods.getCookie('token'),
			dataType : 'json'
		},callback);
	},
	//金账户修改支付密码
	uppaypwd : function(data,callback){
		hmd.send({
			url : '/api/gold/uppaypwd.do',
			type : 'post',
			data : this.getParams(data),
			token : hmd.methods.getCookie('token'),
			dataType : 'json'
		},callback);
	},
	//获取银行列表
	getbanklist : function(callback){
		hmd.send({
			url : '/api/gold/getbanklist.do',
			type : 'post',
			data : this.getParams(),
			token : hmd.methods.getCookie('token'),
			dataType : 'json'
		},callback);
	},
	//金账户网银充值
	uniontopup : function(data,callback){
		hmd.send({
			url : '/api/gold/uniontopup.do',
			type : 'post',
			data : this.getParams(data),
			token : hmd.methods.getCookie('token'),
			dataType : 'json'
		},callback);
	},
	//借款申请接口
	loanapply : function(data,callback){
		hmd.send({
			url : '/api/loan/loanapply.do',
			type : 'post',
			data : this.getParams(data),
			token : hmd.methods.getCookie('token'),
			dataType : 'json'
		},callback);
	},
	//返回状态码对应的汉字
	getAPIStatus : function(callback){
		hmd.getJSON('../Script/JSON/api_status.json',callback);
	},
	//获取银行列表
	getAPIStatus : function(callback){
		hmd.getJSON('../Script/JSON/bank_list.json',callback);
	}
	
});






