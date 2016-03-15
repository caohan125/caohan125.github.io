//版权 北京智能社©, 保留所有权利
function $(args){ //工厂
	return new Zquery(args);
}
function Zquery(args){//构造函数
	//args==function  string	object
	this.elements=[];//存东西的	[1,2,3]

	switch(typeof args){
		case 'function':
			ready(args);
			break;	
		case 'string'://抓对象
			this.elements=getEle(args);
			break;	
		case 'object'://包Zquery对象
			if('length' in args){
				this.elements=args;
			}else{
				this.elements.push(args);
			}
			break;	
	}
}
//--------原型方法---------------------------
Zquery.prototype.css=function(name,value){
	if(arguments.length==2){//设置
		for(var i=0;i<this.elements.length;i++){
			this.elements[i].style[name]=value;	
		}
	}else if(arguments.length==1){
		if(typeof arguments[0]=='string'){//获取
			return getStyle(this.elements[0],name);
		}else if(typeof arguments[0]=='object'){//批量设置
			for(var i=0;i<this.elements.length;i++){
				for(var key in name){
					this.elements[i].style[key]=name[key];	
				}
			}
		}
	}
};
Zquery.prototype.attr=function(name,value){
	if(arguments.length==2){//设置
		for(var i=0;i<this.elements.length;i++){
			this.elements[i].setAttribute(name,value);	
		}
	}else if(arguments.length==1){
		if(typeof arguments[0]=='string'){//获取
			return this.elements[0].getAttribute(name);
		}else if(typeof arguments[0]=='object'){//批量设置
			for(var i=0;i<this.elements.length;i++){
				for(var key in name){
					this.elements[i].setAttribute(key,name[key]);
				}
			}
		}
	}
};
'click|mouseover|mouseout|contextmenu|focus|blur'.replace(/\w+/g,function(sEvt){
	//s = click	mouseover	mouseout
	Zquery.prototype[sEvt]=function(fn){
		for(var i=0;i<this.elements.length;i++){
			addEvent(this.elements[i],sEvt,fn);	
		}
	};	
});
Zquery.prototype.toggle=function(){
	var args=arguments;
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].count=0;
		addEvent(this.elements[i],'click',function(ev){
			args[this.count%args.length].call(this,ev);
			this.count++;	
		});
		
	}
};
Zquery.prototype.drag=function(obj){
	var oEvt=ev||event;
	var disX=clientX-obj.offsetLeft;
	var disY=clientY-obj.offsetTop;
	document.onmousemove=function(ev){
		var l=oEvt.clientX+disX;
		var t=oEvt.clientY+disY;
		if(l<0){
			l=0;
		}
		if(t<0){
			t=0;
		}
		if(l<document.documentElement.ClientX-obj.offsetWidth){
			l=document.documentElement.ClientX-obj.offsetWidth;
		}
		if(t<document.documentElement.ClientY-obj.offsetWidth){
			t=document.documentElement.ClientY-obj.offsetWidth;
		}
		obj.style.left=l+'px';
		obj.style.top=t+'px';
	}
}
Zquery.prototype.mouseenter=function(fn){
	for(var i=0;i<this.elements.length;i++){
		addEvent(this.elements[i],'mouseover',function(ev){
			var oFrom=ev.fromElement||ev.releateTarget;//判断来自
			if(oFrom && this.contains(oFrom)) return;
			fn();	
		});	
	}
};
Zquery.prototype.mouseleave=function(fn){
	for(var i=0;i<this.elements.length;i++){
		addEvent(this.elements[i],'mouseout',function(ev){
			var oTo=ev.toElement||ev.releateTarget;//判断去向
			if(oTo && this.contains(oTo)) return;
			fn();	
		});	
	}
};
Zquery.prototype.hover=function(fn1,fn2){
	this.mouseenter(fn1);
	this.mouseleave(fn2);	
};
Zquery.prototype.eq=function(n){
	return $(this.elements[n]);
};
Zquery.prototype.get=function(n){
	return this.elements[n]	
};
Zquery.prototype.hide=function(){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.display='none';	
	}
};	
Zquery.prototype.show=function(){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.display='block';	
	}
};
Zquery.prototype.index=function(){
	//索引从父级开始算
	var parent=this.elements[0].parentNode;//this.lements[0]==#li
	//parent == #div1
	var child=parent.children;	//li*5
	for(var i=0;i<child.length;i++){
		if(child[i]==this.elements[0]) return i;
	}
};
Zquery.prototype.find=function(str){
	//str==.box	子集	/	this.elements父级
	return $(getEle(str,this.elements));
};
Zquery.prototype.addClass=function(str){
	var re=new RegExp('\\b'+str+'\\b');	
	for(var i=0;i<this.elements.length;i++){
		if(!re.test(this.elements[i].className)){
			if(this.elements[i].className){
				this.elements[i].className=this.elements[i].className+' '+str;	
			}else{
				this.element[i].className=str;
			}
		}
	}
};
Zquery.prototype.removeClass=function(str){
	var re=new RegExp('\\b'+str+'\\b');	
	for(var i=0;i<this.elements.length;i++){
		if(re.test(this.elements[i].className)){
			this.elements[i].className=this.elements[i].className.replace(re,'').replace(/^\s+|\s+$/g,'').replace(/\s+/g,' ')	
		}
	}
};
Zquery.prototype.hasClass=function(str){
	var re=new RegExp('\\b'+str+'\\b');	
	for(var i=0;i<this.elements.length;i++){
		if(re.test(this.elements[i].className)){
			return true;	
		}else{
			return false;
		}
	}
};
Zquery.prototype.toggleClass=function(str){
	if(this.hasClass(str)){
		this.removeClass(str);
	}else{
		this.addClass(str);
	}
};
Zquery.prototype.each=function(fn){
	for(var i=0;i<this.elements.length;i++){
		fn.call(this.elements[i],i,this.elements[i]);
	}
};
$.fn=Zquery.prototype;	//引用
Zquery.prototype.extend=function(json){
	for(var key in json){
		Zquery.prototype[key]=json[key];	
	}
};
Zquery.prototype.animate=function(json,opational){
	for(var i=0;i<this.elements.length;i++){
		move(this.elements[i],json,opational);	
	}
};
Zquery.prototype.length=function(){
	return this.elements.length
}
$.ajax=ajax;
//------------内部函数-----------------------
function addEvent(obj,sEvt,fn){

	if(obj.addEventListener){
		obj.addEventListener(sEvt,function(ev){
			if(fn.call(obj,ev)==false){
				ev.cancelBubble=true;//阻止冒泡
				ev.preventDefault();//阻止默认
			}
		},false);//return false无效
	}else{
		obj.attachEvent('on'+sEvt,function(event){//套个函数，点击时
			if(fn.call(obj,event)==false){
				event.cancelBubble=true;
				return false;//阻止默认
			}//在取指定外面的this==被点到的obj
		});
	}
}
function getStyle(obj,attr){
	return obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj,false)[attr];	
}
function ready(fn){
	if(document.addEventListener){
		document.addEventListener('DOMContentLoaded',fn,false);	
	}else{
		document.attachEvent('onreadystatechange',function(){
			if(document.readyState=='complete'){
				fn();	
			}
		});
	}
}
function getByClass(oParent,sClass){	
	if(oParent.getElementsByClassName)
	return oParent.getElementsByClassName(sClass);
	
	var aEle=oParent.getElementsByTagName('*');
	var re=new RegExp('\\b'+sClass+'\\b');
	var result=[];
	for(var i=0;i<aEle.length;i++){
		if(re.test(aEle[i].className)){
			result.push(aEle[i]);
		}
	}
	return result;	
}
function getEle(str,aParent){
	var arr=str.replace(/^\s+|\s+$/g,'').split(/\s+/g);
	//[#div1,ul,li,.box]
	var aParent=aParent||[document];
	var aChild=[];
	
	for(var i=0;i<arr.length;i++){
		//抓到，  --->aChild	父子替换
		//		parent		child
		//i=0	document--->#div1
		//i=1	oDiv--->ul
		//i=2	aUl---->li
		//i=3	ali----->.box
		aChild=getByStr(aParent,arr[i]);
		aParent = aChild;
	}
	
	return  aChild;
}
function getByStr(aParent,str){
	var aChild=[];	
	
	for(var j=0;j<aParent.length;j++){
		//str==	id	class	tagname
		//#div1	.box	ul
		switch(str.charAt(0)){
			case '#'://id
				//alert(str)
				var obj=document.getElementById(str.substring(1));
				obj && aChild.push(obj);
				break;	
			case '.'://class
				var aEle=getByClass(aParent[j],str.substring(1));
				for(var i=0;i<aEle.length;i++){
					aChild.push(aEle[i]);		
				}
				break;	
			default://tagname
				if(/\w+#\w+/.test(str)){//div#div1
					var arr=str.split('#');//['div','div1']
					//alert(arr);
					var obj = document.getElementById(arr[1]);
					obj && aChild.push(obj);
				}else if(/\w+\.\w+/.test(str)){//div.box
					var arr=str.split('.')//['div','box']
					var aEle=aParent[j].getElementsByTagName(arr[0]);
					var re=new RegExp('\\b'+arr[1]+'\\b');
					alert(re)
					for(var i=0;i<aEle.length;i++){
						if(re.test(aEle[i].className)){
							aChild.push(aEle[i]);
						}
					}
				}else if(/\w+:\w+(\(.\))?/.test(str)){//div:first/last/odd/even div:eq(3)/lt/gt
					var arr=str.split(/:|\(|\)/);//['xx','xx','3'][xx,xx]
					var aEle=aParent[j].getElementsByTagName(arr[0]);
					switch(arr[1]){
						case 'first':
							aEle[0] && aChild.push(aEle[0]);
							break;	
						case 'last':
							aEle[aEle.length-1] && aChild.push(aEle[aEle.length-1]);
							break;	
						case 'odd':
							for(var i=0;i<aEle.length;i++){
								i%2==1 && aChild.push(aEle[i]);
							}
							break;	
						case 'even':
							for(var i=0;i<aEle.length;i++){
								i%2!=1 && aChild.push(aEle[i]);
							}
							break;	
						case 'eq':
							aEle[arr[2]]&&aChild.push(aEle[arr[2]]);
							break;	
						case 'lt':
							for(var i=0;i<arr[2];i++){
								aChild.push(aEle[i]);	
							}
							break;	
						case 'gt':
							for(var i=arr[2]-0+1;i<aEle.length;i++){
								aChild.push(aEle[i]);	
							}
							break;	
					}
				}else if(/\w+\[\w+=\w+\]/.test(str)){//input[type=button]
					var arr=str.split(/\[|=|\]/);	//[input,type,button,]
					var aEle=aParent[j].getElementsByTagName(arr[0]);
					for(var i=0;i<aEle.length;i++){
						if(aEle[i].getAttribute(arr[1])==arr[2]){
							aChild.push(aEle[i]);	
						}
					}
				}else{//div
					var aEle=aParent[j].getElementsByTagName(str);
					for(var i=0;i<aEle.length;i++){
						aChild.push(aEle[i]);	
					}	
				}
		}
	}
	return aChild;
}
function move(obj,json,opational){
	
	var opational = opational || {};
	opational.time = opational.time || 300;
	opational.fn = opational.fn || null;
	opational.type = opational.type || 'ease-out';
	
	var start={};
	var dis={};
	for(var key in json){
		start[key]=parseInt(getStyle(obj,key));
		dis[key]=json[key]-start[key];
	}
	
	var count=Math.round(opational.time/30);
	var n=0;
	
	clearInterval(obj.timer);
	obj.timer=setInterval(function(){
		n++;
		
		for(var key in json){
			//办事
			switch(opational.type){
				case 'linear':
					var a = n/count;
					var cur=start[key]+dis[key]*a;
					break;
				case 'ease-in':
					var a=n/count;
					var cur=start[key]+dis[key]*a*a*a
					break;
				case 'ease-out':
					var a=1-n/count;
					var cur=start[key]+dis[key]*(1-a*a*a)
					break;	
			}
			
			if(key=='opacity'){
				obj.style.opacity=cur;
				obj.style.filter='alpha(opacity:'+cur*100+')';
			}else{
				obj.style[key]=cur+'px';
				
			}	
		}
		
		if(n==count){
			clearInterval(obj.timer);
			opational.fn && opational.fn();
		}
	},30);
}
function ajax(options){
	options=options||{};
	options.data=options.data||{};
	options.type=options.type||'get';
	options.timeout=options.timeout||0;
	options.success=options.success||null;
	options.error=options.error||null;
	
	
	options.data.t=Math.random();
	
	//0.整理接口
	var arr=[];
	for(var key in options.data){
		arr.push(key+'='+encodeURIComponent(options.data[key]))	
	}
	var str=arr.join('&');
	
	
	//1创建ajax对象
	if(window.XMLHttpRequest){
		var oAjax=new XMLHttpRequest();	
	}else{
		var oAjax=new ActiveXObject('Microsoft.XMLHTTP');	
	}
	if(options.type=='get'){
		//2.连接
		oAjax.open('get',options.url+'?'+str,true);
		//3.请求
		oAjax.send();	
	}else{
		//2.连接
		oAjax.open('post',options.url,true);
		//oAjax.setRequestHeader('属性',值)
		oAjax.setRequestHeader('Content-Type','application/x-www-form-urlencoded');	//设定头信息
		//3.请求	
		oAjax.send(str);		//post在这里传数据
	}
	//4.接收
	oAjax.onreadystatechange=function(){
		if(oAjax.readyState==4){
			clearTimeout(timer);
			if(oAjax.status>=200&oAjax.status<300||oAjax.stauts==304){
				options.success&&options.success(oAjax.responseText);
			}else{
				options.error && options.error(oAjax.status);
			}
			
		}
	};
	if(options.timeout){
		var timer=setTimeout(function(){
			alert('超时了');
			oAjax.abort();	//中断加载
			
		},options.timeout);	
	}
}







