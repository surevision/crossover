
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

		this._defaultFontSize = UIRichText.DEFAULT_FONT_SIZE;
		this._lineHeight = UIRichText.DEFAULT_LINE_HEIGHT;
		this._width = width;
		this._show_fast = !!show_fast;
		this._height = self._defaultFontSize;
		this:clear();
	},
	clear : function() {
		this._contentStr = "";
	 
		this._texts = this._texts || []; // 文字
		this._images = this._images || [];   // 图片
		this._armatures = this._armatures || []; // 动画
		this._contents = this._contents || [];   // 包含文字图片等实际顺序的数组
		this._currentLine = this._currentLine || []; // 渲染中的本行元素
		this._strIndex = 1; // 遍历的当前字符
		this._currentColor = 1;  // 当前文字颜色
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

		this._texts = {};
		this._images = {};
		this._armatures = {};
		this._contents = {};
		this._renderPos = {
		                        x : 0, 
		                        y : 0,
		                        maxHeight : this._defaultFontSize   // 记录本行最大高度
		                    };
		this._currentLine = {};
	 
		this.unScheduleUpdate();
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
		code = code || 1;
		colors = {
                    cc.color(255, 255, 255),  // 白色
                    cc.color(0, 0, 0),            // 黑色
                    cc.color(255, 0, 0),          // 红色
                    cc.color(0, 255, 0),          // 绿色
                    cc.color(0, 0, 255),          // 蓝色
                    cc.color(0, 255, 255)         // 黄色
                    };
		return colors[code] || colors[1];
	},
	setDefaultFontSize : function(size) {
		size = size || this._defaultFontSize;
		if (size < 0) {
			size = this._defaultFontSize;
		}
		this._defaultFontSize = size;
	},
	setString : function(str) {
		this.clear();
		this._contentStr = str;
		this.refresh();
		this.scheduleUpdate();
	},
	refresh : function() {
		while (this._strIndex <= this._contents.length) {
			this.progressContentString();
		}
		if (this._show_fast) {
			this._seq = this._contents.length;
		}
		this.nextLine();
		this._height = this._renderPos.y;
		this.ignoreAnchorPointForPosition(false);
		this.setAnchorPoint(cc.p(0, 1));
		this.setContentSize(this._width, this._height);
	}
});
function UILabelEx:refresh()
    print(utf8len(self._contentStr))    
    while self._strIndex <= utf8len(self._contentStr) do
        self:progressContentString()
    end
    if self._show_fast then self._seq = #self._contents end
    self:nextLine()
    self._height = self._renderPos.y
    self._rootWgt:ignoreAnchorPointForPosition(false)
    self._rootWgt:setAnchorPoint(cc.p(0, 1))
    self._rootWgt:setBackGroundColorType(ccui.LayoutBackGroundColorType.solid)
    self._rootWgt:setBackGroundColor(cc.c3b(128, 128, 128))
    self._rootWgt:setContentSize(self._width, self._height)
end
 
-- 处理特殊字符
function UILabelEx:progressContentString()
    local str = utf8sub(self._contentStr, self._strIndex, 1)
    self._strIndex = self._strIndex + 1
    -- print("str:"..str)
     
    if str == "\r" then             -- 回车
        return
    elseif str == "\n" then         -- 换行
        self:progressNewLine()
    elseif str == UILabelEx.C_CHR then      -- 控制符
        -- 处理中会影响self._strIndex
        self:progressControlChar()
    else                            -- 普通文字
        self:progressNormalText(str)
    end
     
end
 
-- 换行
function UILabelEx:progressNewLine()
    self:nextLine()
end
 
-- 控制符
function UILabelEx:progressControlChar()
    local chr = utf8sub(self._contentStr, self._strIndex, 1)
    self._strIndex = self._strIndex + 1
    chr = string.upper(chr)
    -- print("char:"..chr)
    local progressFlag = false  -- 是否正常解析
    local s, e, val = string.find(self._contentStr, "<(.-)>", string.len(utf8sub(self._contentStr, 1, self._strIndex)))
    if val and s == string.len(utf8sub(self._contentStr, 1, self._strIndex)) then
        progressFlag = true
        print("val:"..(val ~= nil and val or "nil"))
        if chr == "C" then
            progressFlag = self:changeFontColor(tonumber(val))  -- 修改颜色
        elseif chr == "S" then
            progressFlag = self:changeFontSize(tonumber(val))   -- 修改字号
        elseif chr == "I" then
            progressFlag = self:progressImage(tonumber(val))    -- 插入图片
        elseif chr == "B" then
            progressFlag = self:progressBtn(val)        -- 插入按钮
        elseif chr == "E" then
            progressFlag = self:progressEmoji(tonumber(val))    -- 插入表情
        end
    end
    if progressFlag then
        self._strIndex = self._strIndex + utf8len(val) + 2
    else -- 处理失败，当做通常字符处理       
        self._strIndex = self._strIndex - 2
        local str = utf8sub(self._contentStr, self._strIndex, 1)
        self._strIndex = self._strIndex + 1    
        self:progressNormalText(str)
    end
end
 
-- 普通文字
function UILabelEx:progressNormalText(chr)
    print("progress normal:"..chr)
    local uiText = ccui.Text:create()   
    uiText:setString(chr)
    uiText:setVisible(self._show_fast)
    uiText:setFontSize(self._currentFontSize)
    uiText:setColor(self:getColor(self._currentColor))
    self:addChild(uiText, 100)
 
    if uiText:getContentSize().width > self._width then
        print("too big width, scaled")
        uiText:setScale(self._width / uiText:getContentSize().width)
    end
    if self._renderPos.x + uiText:getContentSize().width > self._width then
        self:nextLine()
    end
 
    self:setElemPosition(uiText, self._renderPos.x, self._renderPos.y)
    self._renderPos.x = self._renderPos.x + uiText:getContentSize().width
    self._renderPos.maxHeight = (self._renderPos.maxHeight > uiText:getContentSize().height) and self._renderPos.maxHeight or uiText:getContentSize().height
 
    self._texts[#self._texts + 1] = uiText
 
    self._contents[#self._contents + 1] = uiText
    self._currentLine[#self._currentLine + 1] = uiText
    return true
end
 
function UILabelEx:changeFontColor(code)
    if not code then return false end
    self._currentColor = code
    return true
end
 
function UILabelEx:changeFontSize(code)
    if not code then return false end
    if code <= 0 then code = self._defaultFontSize end
    self._currentFontSize = code
    return true
end
 
function UILabelEx:progressImage(code)
    if not code then return end
    print("progress image:"..code)
    local image = t_image[code]
    if not image then return false end
    cc.SpriteFrameCache:getInstance():addSpriteFrames(image.plist)
    local uiImage = ccui.ImageView:create() 
    uiImage:loadTexture(image.name, ccui.TextureResType.plistType)
    uiImage:setVisible(self._show_fast)
    self:addChild(uiImage, 100)
 
    if uiImage:getContentSize().width > self._width then
        print("too big width, scaled")
        uiImage:setScale(self._width / uiImage:getContentSize().width)
    end
    if self._renderPos.x + uiImage:getContentSize().width > self._width then
        self:nextLine()
    end
 
    self:setElemPosition(uiImage, self._renderPos.x, self._renderPos.y)
    self._renderPos.x = self._renderPos.x + uiImage:getContentSize().width
    self._renderPos.maxHeight = (self._renderPos.maxHeight > uiImage:getContentSize().height) and self._renderPos.maxHeight or uiImage:getContentSize().height
 
    self._images[#self._images + 1] = uiImage
 
    self._contents[#self._contents + 1] = uiImage
    self._currentLine[#self._currentLine + 1] = uiImage
    return true
end
 
function UILabelEx:progressBtn(str)
    return false
end
 
function UILabelEx:progressEmoji(code)  
    if not code then return false end
    print("progress emoji:"..code)
    local animation = t_animation[code]
    if not animation then return false end
    ccs.ArmatureDataManager:getInstance():addArmatureFileInfo(animation.json)
    local armature = ccs.Armature:create(animation.name)
    armature:getAnimation():play("effect")
    armature:setVisible(self._show_fast)
    self:addChild(armature, 100)
 
    if armature:getContentSize().width > self._width then
        print("too big width, scaled")
        armature:setScale(self._width / armature:getContentSize().width)
    end
    if self._renderPos.x + armature:getContentSize().width > self._width then
        self:nextLine()
    end
 
    self:setElemPosition(armature, self._renderPos.x, self._renderPos.y)
    self._renderPos.x = self._renderPos.x + armature:getContentSize().width
    self._renderPos.maxHeight = (self._renderPos.maxHeight > armature:getContentSize().height) and self._renderPos.maxHeight or armature:getContentSize().height
 
    self._armatures[#self._armatures + 1] = armature
 
    self._contents[#self._contents + 1] = armature
    self._currentLine[#self._currentLine + 1] = armature
    return true
end
 
function UILabelEx:setElemPosition(elem, _x, _y)
    elem:ignoreAnchorPointForPosition(false)
    elem:setAnchorPoint(cc.p(0,0))
    if _x then
        local x = _x + elem:getContentSize().width * elem:getAnchorPoint().x
        elem:setPositionX(x)
    end
    if _y then
        local y = _y + elem:getContentSize().height * elem:getAnchorPoint().y
        elem:setPositionY(-y)
    end
end
 
function UILabelEx:nextLine()
    -- 调整当前行元素高度，适应maxHeight
    for k, v in pairs(self._currentLine) do
        self:setElemPosition(v, nil, self._renderPos.y + self._renderPos.maxHeight)
    end
    self._renderPos.x = 0
    self._renderPos.y = self._renderPos.y + self._renderPos.maxHeight + self._lineHeight / 2
    self._renderPos.maxHeight = self._defaultFontSize
    self._currentLine = {}
end
 
function UILabelEx:scheduleShow(dt)
    if self._showSeq < #self._contents then     
        self._showSeq = self._showSeq + 1
        self._contents[self._showSeq]:setVisible(true)
    end
end
 
return UILabelEx