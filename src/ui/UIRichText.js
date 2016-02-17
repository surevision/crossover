
/*
var labelEx = new UIRichText(300) -- width
parent.addChild(labelEx, 100)
labelEx.setPosition(100, self.visibleSize.height)
labelEx.setString("文字$C<3>颜色$C<1>普通颜色$S<36>大小$S<0>普通大小$I<res/HelloWorld.png>←图片$A<TuanZi,walk>动画$n换$n行")
 
*/
var UIRichText = UIBase.extend({
	//控制字符
	C_CHR : "$",
	// 单字显示时间间隔
	WAIT_FOR_MESSAGE : 5 / 60,
	//默认字号
	DEFAULT_FONT_SIZE : 24,
	// 行间距
	DEFAULT_LINE_HEIGHT : 12,

	ctor : function(width, show_fast) {
		this._super();

		this._defaultFontSize = this.DEFAULT_FONT_SIZE;
		this._lineHeight = this.DEFAULT_LINE_HEIGHT;
		this._width = width;
		this._show_fast = !!show_fast;
		this._height = this._defaultFontSize;
		this.clear();
	},
	clear : function() {
		this._contentStr = "";
	 
		this._texts = this._texts || []; // 文字
		this._images = this._images || [];   // 图片
		this._armatures = this._armatures || []; // 动画
		this._contents = this._contents || [];   // 包含文字图片等实际顺序的数组
		this._currentLine = this._currentLine || []; // 渲染中的本行元素
		this._strIndex = 0; // 遍历的当前字符
		this._currentColor = 0;  // 当前文字颜色
		this._currentFontSize = this._defaultFontSize;   // 当前文字大小
		
		for (var i = 0; i < this._texts.length; i += 1) {
			this._texts[i].removeFromParent();
		}
		for (var i = 0; i < this._images.length; i += 1) {
			this._images[i].removeFromParent();
		}
		for (var i = 0; i < this._armatures.length; i += 1) {
			this._armatures[i].removeFromParent();
		}

		this._texts = [];
		this._images = [];
		this._armatures = [];
		this._contents = [];
		this._renderPos = {
						x : 0, 
						y : 0,
						maxHeight : this._defaultFontSize   // 记录本行最大高度
					};
		this._currentLine = [];
	 
		this.unscheduleUpdate();
		this._updateDt = 0;

		this._showSeq = 0;
	},
	onEnter : function() {
		this._super();
		this.ignoreAnchorPointForPosition(false);
		this.setAnchorPoint(0, 1);
	},
	onExit : function() {
		this._super();
		this.clear();
	},
	/**
	* 根据代码取文字颜色
	* @code 颜色代码
	*/
	getColor : function(code) {
		code = code || 0;
		colors = [
                    cc.color(255, 255, 255),  // 白色
                    cc.color(0, 0, 0),            // 黑色
                    cc.color(255, 0, 0),          // 红色
                    cc.color(0, 255, 0),          // 绿色
                    cc.color(0, 0, 255),          // 蓝色
                    cc.color(0, 255, 255)         // 黄色
                    ];
		return colors[code] || colors[0];
	},
	setDefaultFontSize : function(size) {
		size = size || this._defaultFontSize;
		if (size < 0) {
			size = this._defaultFontSize;
		}
		this._defaultFontSize = size;
	},
	setString : function(str) {
		console.log("setString %s", str);
		this.clear();
		this._contentStr = str;
		this.refresh();
		this.scheduleUpdate();
	},
	refresh : function() {
		while (this._strIndex < this._contentStr.length) {
			this.progressContentString();
		}
		if (this._show_fast) {
			this._seq = this._contentStr.length;
		}
		this.nextLine();
		this._height = this._renderPos.y;
		this.ignoreAnchorPointForPosition(false);
		this.setAnchorPoint(cc.p(0, 1));
		this.setContentSize(this._width, this._height);
		//this.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
		//this.setBackGroundColor(cc.color(0, 255, 0, 255));
		console.log(this._width, this._height);
	},
	/*
	* 处理特殊字符
	*/
	progressContentString : function() {
		// get one word
		var str = this._contentStr.substr(this._strIndex, 1);
		this._strIndex += 1;
		console.log("progressContentString %s", str);
		if (str == "\r") {
			// 回车
			return;
		} else if (str == "\n") {
			// 换行
			this.progressNewLine();
		} else if (str == this.C_CHR) {
			// 控制符开始
			// 处理控制字符，处理中会影响_strIndex
			this.progressControlChar();
		} else {
			// 普通文字
			this.progressNormalText(str);
		}
	},
	/*
	* 处理换行
	*/
	progressNewLine : function() {
		this.nextLine();
	},
	/*
	* 处理特殊字符
	*/
	progressControlChar : function() {
		var chr = this._contentStr.substr(this._strIndex, 1);
		this._strIndex += 1;
		chr = chr.toUpperCase();
		console.log("chr %s", chr);
		var progressFlag = false;	// 是否正常解析
		var progressLen = 0; // 参数字符数
		// get params( first <.*> regexp)
		var contentToCheck = this._contentStr.substr(this._strIndex);
		console.log("contentToCheck %s", contentToCheck);
		if (chr == "C") {
			// 修改颜色
			var params = contentToCheck.match(/<(\d+?)>/);
			console.log(params);
			if (params) {
				progressFlag = this.changeFontColor(parseInt(params[1]));
				progressLen = params[1].length;
			} else {
				console.log("fail changeFontColor");
			}
		} else if (chr == "S") {
			// 修改字号
			var params = contentToCheck.match(/<(\d+?)>/);
			console.log(params);
			if (params) {
				progressFlag = this.changeFontSize(parseInt(params[1]));
				progressLen = params[1].length;
			} else {
				console.log("fail changeFontSize");
			}
		} else if (chr == "I") {
			// 插入图片
			var params = contentToCheck.match(/<(.+?)>/);
			console.log(params);
			if (params) {
				progressFlag = this.progressImage(params[1]);
				progressLen = params[1].length;
			} else {
				console.log("fail progressImage");
			}
		} else if (chr == "A") {
			// 插入动画
			var params = contentToCheck.match(/<(\w+?),(\w+?)>/);
			console.log(params);
			if (params) {
				progressFlag = this.progressArmature(params[1], params[2]);
				progressLen = params[1].length + params[2].length + 1;
			} else {
				console.log("fail progressArmature");
			}
		}
		if (progressFlag) {
			// 正常解析
			this._strIndex += 2; // "<>"
			this._strIndex += progressLen;
		} else {
			// 处理失败，包含$在内均当做普通字符处理
			console.log("fail progress!, last code : %s", chr);
			this._strIndex -= 2; // $X
			var str = this._contentStr.substr(this._strIndex, 1);
			this._strIndex += 1;
			this.progressNormalText(str);
		}
	},
	/*
	* 处理普通文字
	*/
	progressNormalText : function(chr) {
		console.log("create ccui.Text %s, size %s", chr, this._currentFontSize);
		var uiText = ccui.Text.create(chr, "微软雅黑", this._currentFontSize);
		uiText.setString(chr);
		uiText.setVisible(this._show_fast);
		uiText.setFontSize(this._currentFontSize);
		uiText.setColor(this.getColor(this._currentColor));
		this.addChild(uiText);

		if (uiText.getContentSize().width > this._width) {
			uiText:setScale(this._width / uiText.getContentSize().width);
		}
		if (this._renderPos.x + uiText.getContentSize().width > this._width) {
			this.nextLine();
		}
		this.setElemPosition(uiText, this._renderPos.x, this._renderPos.y);
		this._renderPos.x += uiText.getContentSize().width;
		this._renderPos.maxHeight = (this._renderPos.maxHeight > uiText.getContentSize().height) ? this._renderPos.maxHeight : uiText.getContentSize().height

		this._texts.push(uiText);
		this._contents.push(uiText);
		this._currentLine.push(uiText);
		return true;
	},
	/*
	* 修改颜色
	*/
	changeFontColor : function(code) {
		if (!!code || code == 0) {
			this._currentColor = code;
			return true;
		}
		return false;
	},
	/*
	* 修改字号
	*/
	changeFontSize : function(code) {
		if (!!code || code == 0) {
			if (code <= 0) {
				code = this._defaultFontSize;
			}
			this._currentFontSize = code;
			return true;
		}
		return false;
	},
	/*
	* 插入图片
	*/
	progressImage : function(path) {
		if (!!path) {
			// 暂时只处理单图
			console.log("progress image %s", path);
			var uiImage = ccui.ImageView.create(path, ccui.Widget.LOCAL_TEXTURE);
			uiImage.setVisible(this._show_fast);
			this.addChild(uiImage);

			if (uiImage.getContentSize().width > this._width) {
				uiImage:setScale(this._width / uiImage.getContentSize().width);
			}
			if (this._renderPos.x + uiImage.getContentSize().width > this._width) {
				this.nextLine();
			}
			this.setElemPosition(uiImage, this._renderPos.x, this._renderPos.y);
			this._renderPos.x += uiImage.getContentSize().width;
			this._renderPos.maxHeight = (this._renderPos.maxHeight > uiImage.getContentSize().height) ? this._renderPos.maxHeight : uiImage.getContentSize().height

			this._images.push(uiImage);
			this._contents.push(uiImage);
			this._currentLine.push(uiImage);
			return true;
		}
		return false;
	},
	/*
	* 插入动画
	*/
	progressArmature : function(name, action) {
		if ((!!name) && (!!action)) {
			console.log("progress armature %s %s", name, action);
			var armature = new ArmatureBase(name, this);
			armature.setVisible(this._show_fast);
			armature.play(action);
			if (armature.getContentSize().width > this._width) {
				armature:setScale(this._width / armature.getContentSize().width);
			}
			if (this._renderPos.x + armature.getContentSize().width > this._width) {
				this.nextLine();
			}
			this.setElemPosition(armature, this._renderPos.x, this._renderPos.y);
			this._renderPos.x += armature.getContentSize().width;
			this._renderPos.maxHeight = (this._renderPos.maxHeight > armature.getContentSize().height) ? this._renderPos.maxHeight : armature.getContentSize().height

			this._armatures.push(armature);
			this._contents.push(armature);
			this._currentLine.push(armature);
			return true;
		}
		return false;
	},
	/*
	* 调整位置
	*/
	setElemPosition : function(elem, _x, _y) {
		console.log("setElemPosition %s, %s", _x, _y);
		if (elem instanceof ArmatureBase) {
			elem = elem.armature;
		}
		elem.ignoreAnchorPointForPosition(false);
		elem.setAnchorPoint(cc.p(0,0));
		elem.setVisible(true);
		if (!!_x) {
			var x = _x + elem.getContentSize().width * elem.getAnchorPoint().x;
			elem.setPositionX(x);
		}
		if (!!_y) {
			var y = _y + elem.getContentSize().height * elem.getAnchorPoint().y;
			elem.setPositionY(y);
		}
	},
	/*
	* 换行
	*/
	nextLine : function() {
		// 调整当前行元素高度，适应maxHeight
		for (var i = 0; i < this._currentLine.length; i += 1) {
			this.setElemPosition(this._currentLine[i], null, this._renderPos.y + this._renderPos.maxHeight);
		}
		this._renderPos.x = 0;
		this._renderPos.y += this._renderPos.maxHeight + this._lineHeight / 2;
		this._renderPos.maxHeight = this._defaultFontSize; // 恢复lineheight
		this._currentLine = [];
	},

	update : function(dt) {
		this._updateDt += dt;
		if (this._updateDt > this.WAIT_FOR_MESSAGE) {
			this._updateDt = 0;
			if (this._showSeq < this._contents.length) {
				this._contents[this._showSeq].setVisible(true);
				this._showSeq += 1;
			}
		}
	}

});