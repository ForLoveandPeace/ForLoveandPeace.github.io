var WeuiUtils = {
	// 获取select 对象
	getPickerList (arrList) {
		let arrNew = new Array();
		arrList.forEach((item, index) => {
			let obj = {};
			obj.label = item.sName;
			obj.value = item.sCode;
			arrNew.push(obj);
		})
		return arrNew;
	},
	// 检测当前浏览器是否 微信浏览器
	isWeiXin () {
		let ua = navigator.userAgent.toLowerCase(); 
		if(ua.match(/MicroMessenger/i)=="micromessenger") { 
		return true; 
		} else { 
		return false; 
		} 
	},
	// 判断 非微信浏览器 处理
	checkWeiXin () {
		WeuiUtils.isWeiXin() == false ? window.location.href = "../wxerror.html" : "";
	},
	// 指定位置转成星号,  frontLen：前面保留位数，endLen：后面保留位数。
	plusXing (str, frontLen, endLen) {
		var len = str.length-frontLen-endLen;
		var xing = '';
		for (var i=0;i<len;i++) {
			xing+='*';
		}
		return str.substr(0,frontLen)+xing+str.substr(str.length-endLen);
	},
	// 获取base64图片大小
	getBaseSize (base64url) {
		var baseStr;
		if (base64url.indexOf("data:image/png;base64,") != -1) { baseStr = base64url.replace('data:image/png;base64,', '') }
		if (base64url.indexOf("data:image/jpg;base64,") != -1) { baseStr = base64url.replace('data:image/jpg;base64,', '') }
		if (base64url.indexOf("data:image/jpeg;base64,") != -1) { baseStr = base64url.replace('data:image/jpeg;base64,', '') } 

		var egTagIndex = baseStr.indexOf("=");
		baseStr = egTagIndex != -1 ? baseStr.substring(0, egTagIndex) : baseStr;
		var strLen = baseStr.length;
		var fileSize = strLen-(strLen/8)*2;
		return fileSize;
	},
	// 单按钮弹窗
	oneBtnAlert (val, isClose, title) {
		weui.alert(val || "网络异常", {
			title: title || "提示",
			buttons: [{
				label: '确认',
				type: 'primary',
				onClick: function(){ 
					if (isClose == true) {
						wx.closeWindow();
					}
				}
			}]
		});
	},
	// 弹窗-刷新页面
	refreshPage () {
		weui.alert("页面出错，请检查网络或授权！", {
			buttons: [{
				label: '刷新页面',
				type: 'primary',
				onClick: function(){ window.location.reload(); }
			}]
		});
	},
	// 显示loading
	isShowLoading (type, text) {
		if(type) {
			$(".loading_mask").show();
			$(".loading_tip").css("display","flex");
			text && $(".loading_tip .loading_text").text(text);
		} else {
			$(".loading_mask").hide();
			$(".loading_tip").hide();
		}
	},
	// 成功时的提示
	isShowToast (val, time) { // val - 内容  time - 提示显示时间
		weui.toast(val, time || 2500);
	},
	// 公共dialog
	showWeuiDialog (title, content, callback, cancelLabel, confirmLabel) {
		var dialog = weui.dialog({
			title: title || "提示",
			content: content,
			className: 'custom-classname',
			buttons: [{
				label: cancelLabel || '取消',
				type: 'default',
				onClick: function () {callback("cancel")}
			}, {
				label: confirmLabel || '确定',
				type: 'primary',
				onClick: function () { callback("confirm")},
			}]
		});
	},
	//配置微信SDK
	configWxSDK (url, iWxSdkFlog, bForceGet, wxSdkApiList) { 
		let sSignUrl = window.location.href.split('#')[0];
		var wxSdkApiList = wxSdkApiList || ['checkJsApi','chooseImage','uploadImage','openLocation','getLocation',"hideMenuItems","showMenuItems","closeWindow",'hideAllNonBaseMenuItem','previewImage'];
		$.ajax({
			url: url,
			method: "post",
			data: {
				sSignUrl: sSignUrl,
				bForceGet: bForceGet
			},
			success: function(data) {
				console.log(iWxSdkFlog);
				iWxSdkFlog += 1;
				console.log(iWxSdkFlog);
				console.log("wx.config() ---> 接收后台返回的参数" + data);
				let config = data.data;
				wx.config({
					debug: false,
					appId: config.appid,
					timestamp: config.timestamp,
					nonceStr: config.nonceStr,
					signature: config.signature,
					jsApiList: wxSdkApiList
				});
				wx.ready(function (res) {
					// callback && callback();
				});
				wx.error(function(res) {
					// callback && callback();
					//config信息验证失败会执行error函数，如签名过期导致验证失败
					console.log(iWxSdkFlog);
					if(iWxSdkFlog <= 1) {
						console.log("触发了");
						//再配置一次
						WeuiUtils.configWxSDK(url, iWxSdkFlog, true);
					} else {
						window.location.href = "../wxerror.html";
					}
				});
			}
		});
	},
	// 获取人员类型
	getPersonType (iPersonType) {
	  let sPersonType = "";
	  switch (iPersonType) {
	    case 1:
	      sPersonType = "学生";
	      break;
	    case 2:
	      sPersonType = "老师";
	      break;
	    case 3:
	      sPersonType = "B岗/合同工";
	      break;
	    case 4:
	      sPersonType = "老师家属";
	      break;
	    case 5:
	      sPersonType = "B岗/合同工家属";
	      break;
	    case 6:
	      sPersonType = "住户及家属";
	      break;
	    case 7:
	      sPersonType = "租户及家属";
	      break;
	    case 8:
	      sPersonType = "商铺人员";
	      break;
	    case 9:
	      sPersonType = "幼小学生接送人员";
	      break;
	    case 10:
	      sPersonType = "外单位工勤人员";
	      break;
	    case 11:
	      sPersonType = "合作单位人员";
	      break;
	    case 12:
	      sPersonType = "钢研所人员";
	      break;
	    case 13:
	      sPersonType = "冶金公司人员";
	      break;
	    case 14:
	      sPersonType = "访客";
	      break;
	    case 15:
	      sPersonType = "其他";
	      break;
	  }
	  return sPersonType;
	},
	// 根据经纬度计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
	getDistance (lat1, lng1, lat2, lng2) {
		var radLat1 = this.rad(lat1);
		var radLat2 = this.rad(lat2);
		var a = radLat1 - radLat2;
		var b = this.rad(lng1) - this.rad(lng2);
		var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
			Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
		s = s * 6378.137; // EARTH_RADIUS;
		s = Math.round(s * 10000) / 10000; //输出为公里
	
		var distance = s;
		var distance_str = "";
	
		if (parseInt(distance) >= 1) {
			distance_str = distance.toFixed(1) + "km";
		} else {
			distance_str = distance * 1000 + "m";
		}
	
		//s=s.toFixed(4);
		// console.info('lyj 距离是', s);
		// console.info('lyj 距离是', distance_str);
		return s;
	},
	// 经纬度转换成三角函数中度分表形式。
	rad (d) {
		return d * Math.PI / 180.0; 
	},
	// 图片压缩裁剪
	canvasImgSigle (path, obj, callback) {
		var img = new Image();
		img.src = path;
		img.onload = function () {
			var that = this;
			// 默认按比例压缩
			var w = that.width,
			h = that.height,
			scale = w / h;
	
			// 获取base64大小
			var fileSize = WeuiUtils.getBaseSize(path);
	
			if (fileSize > 1024000) {
				// 判断尺寸 大于 1024
				var ratio = 1;
				var imgRatio = w / h;
				
				if (imgRatio > 1) {
					w = 1024;
					h = 1024 / imgRatio;
				} else if (imgRatio < 1) {
					h = 1024;
					w = 1024 * imgRatio;
				} else {
					w = 1024;
					h = 1024;
				}
			}
	
			var quality = 0.8; // 默认图片质量为0.7
			//生成canvas
			var canvas = document.createElement('canvas');
			var ctx = canvas.getContext('2d');
			// 创建属性节点
			var anw = document.createAttribute("width");
			anw.nodeValue = w;
			var anh = document.createAttribute("height");
			anh.nodeValue = h;
			canvas.setAttributeNode(anw);
			canvas.setAttributeNode(anh);
			ctx.drawImage(that, 0, 0, w, h);
			// 图像质量
			if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
				quality = obj.quality;
			}
			// quality值越小，所绘制出的图像越模糊
			var base64 = canvas.toDataURL('image/jpeg', quality);
			// 回调函数返回base64的值
			callback(base64);
		}
	},
	// 表单验证
	formVerify (value, type) { // isMobile - 手机号格式
		console.log(value);
		console.log(type);
		
		// 检验是否手机格式 val:手机格式
		if (type == "isMobile") {
			if (!new RegExp("^[1]([3-9])[0-9]{9}$").test(value)) {
				return '亲，手机号格式有误~';
			}
		}
		
		// 检验是否学号 val:学号
		if (type == "isPersonCode") {
			if (!new RegExp("^[A-Za-z0-9]$").test(value)) {
				return '亲，学号格式有误~';
			}
		}
		
		// 检验是否中文数字字母 
		if (type == "isHZOrEnglishOrNum") {
			if (!new RegExp("^[\u4E00-\u9FA5A-Za-z0-9]$").test(value)) {
				return '亲，格式要求为中文数字字母~';
			}
		}

		// 检验是否常规输入框
		if (type == "standard") {
			if (new RegExp("^[\a-\z\A-\Z0-9\u4E00-\u9FA5\,\，\·\：\。\、\！\?\r\n]+$").test(value)) {
				return '符合'
 			} else {
				return '不符合'
			}
		}

		// if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
		// 	return '用户名不能有特殊字符';
		// }
		
		return true
	},
	// 返回首页
	returnIndex () {
		var flag = 0; //标记是拖曳还是点击
		var oDiv = document.createElement('div');
		document.body.appendChild(oDiv);
		oDiv.setAttribute("id", "returnIndex");
		oDiv.style.position = "fixed";
		oDiv.style.top = "70%";
		oDiv.style.left = "0";
		oDiv.style.width = "1.2rem";
		oDiv.style.height = ".64rem";		
		oDiv.style.backgroundImage = "url(" + SysUtils.getHttpRoot() + "/img/home_icon.png" +")";
		oDiv.style.backgroundSize = "1.2rem .64rem";
		oDiv.style.backgroundRepeat = "no-repeat";
		oDiv.style.backgroundPositionX = "center";
		oDiv.style.backgroundPositionY = "center";
		oDiv.style.zIndex = "9999";
		oDiv.style.opacity = "70%";

		var disX, moveX, L, T, starX, starY, starXEnd, starYEnd;
		oDiv.addEventListener('touchstart', function(e) {
			flag = 0;
			e.preventDefault(); //阻止触摸时页面的滚动，缩放
			disX = e.touches[0].clientX - this.offsetLeft;
			disY = e.touches[0].clientY - this.offsetTop;
			//手指按下时的坐标
			starX = e.touches[0].clientX;
			starY = e.touches[0].clientY;
			//console.log(disX);
		});
		oDiv.addEventListener('touchmove', function(e) {
			flag = 1;
			L = e.touches[0].clientX - disX;
			T = e.touches[0].clientY - disY;
			//移动时 当前位置与起始位置之间的差值
			starXEnd = e.touches[0].clientX - starX;
			starYEnd = e.touches[0].clientY - starY;
			//console.log(L);
			if (L < 0) { //限制拖拽的X范围，不能拖出屏幕
					L = 0;
			} else if (L > document.documentElement.clientWidth - this.offsetWidth) {
					L = document.documentElement.clientWidth - this.offsetWidth;
			}
			if (T < 0) { //限制拖拽的Y范围，不能拖出屏幕
					T = 0;
			} else if (T > document.documentElement.clientHeight - this.offsetHeight) {
					T = document.documentElement.clientHeight - this.offsetHeight;
			}
			moveX = L + 'px';
			moveY = T + 'px';
			//console.log(moveX);
			this.style.left = 0;
			// 左右拖动
			// this.style.right = moveX;
			this.style.top = moveY;
		});
		oDiv.addEventListener('touchend', function(e) {
			//alert(parseInt(moveX))
			// 判断滑动方向
			if (flag === 0) { //点击
				window.location.href = SysUtils.getHttpRoot() + "/index_h5.html";
			}
		});
	},
}