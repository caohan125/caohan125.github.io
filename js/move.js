// JavaScript Document
function getStyle(obj,attr){
	return obj.currentStyle?obj.cuurentStyle[attr]:getComputedStyle(obj,false)[attr];
}
function move(obj,json,opational){
	opational=opational||{};
	opational.type=opational.type||'linear';
	opational.timer=opational.timer||300;
	opational.fn=opational.fn||null;
	
	var start={};
	var dis={}
	for(var key in json){
		start[key]=parseFloat(getStyle(obj,key));
		dis[key]=json[key]-start[key];
	}
	var count=Math.round(opational.timer/30);
	var n=0;
	clearInterval(obj.time);
	obj.time=setInterval(function(){
		n++;
		for(var key in json){
			switch(opational.type){
				case 'linear':
					var a=n/count;
					var cur=start[key]+dis[key]*a;
					break;
				case 'ease-in':
					var a=n/count;
					var cur=start[key]+dis[key]*a*a*a;
					break;
				case 'ease-out':
					var a=1-n/count;
					var cur=start[key]+dis[key]*(1-a*a*a);
					break;
			}
			if(key=='opacity'){
				obj.style.opacity=cur;
				obj.style.filter='alpha(opacity='+cur*100+')';
			}else{
				obj.style[key]=cur+'px';	
			}
		}
		if(n==count){
			clearInterval(obj.time);
			opational.fn&&opational.fn();
		}
	},30);
}