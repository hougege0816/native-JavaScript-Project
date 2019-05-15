var page=0;//初始页码
var count=10;//每页多少条
var rowNum=5;//每行多少条
window.onload=function(){
	var indexNum=0;
	getList(page,indexNum);
}
/*
 *@param page页码
 *       indexNum 本页第几个
 * 		 halfPage 为false,每次翻页翻半页count/2,为true,每次翻页为count
 * */
function getList(page,indexNum){
	var url='page.json';
	var data={
		"page":page,
		"count":rowNum
	};
	AjaxGet(url, data, function(result){
    	var result=JSON.parse(result);
    	document.getElementById("program").innerHTML ='';
    	var initIndex='';
    	var lastIndex='';
    	if(page==0){//第一页的时候显示十条数据
    		initIndex=data.page*data.count;
    		lastIndex=data.count*2;
    	}else{
    		initIndex=data.page*data.count;
    		lastIndex=(data.page+1)*data.count+rowNum<=result.length ? (data.page+1)*data.count+rowNum:result.length;
    	}       
		for(var i=initIndex;i<lastIndex;i++){
			var html='';
			html+='<li id="'+result[i].id+'">';
			html+='<div class="programImg">';
			html+='<img src="'+result[i].url+'">';
			html+='</div>';
			html+='<div class="programName">';
			html+='<span>'+result[i].name+'</span>';
			html+='</div>';
			html+='</li>';
			document.getElementById('program').innerHTML+=html;	
		}
		var parent=document.getElementById("program");
		parent.firstChild.setAttribute('class','selected');//初始化时默认第一条选中
		if(indexNum>=1){
			var id=getSelectedId();
			var objId=document.getElementById(id);
			selectId=getDomId(objId,indexNum,"next");
			objId.classList.remove("selected");
			if(selectId=='' || selectId==null){
				parent.lastChild.setAttribute('class','selected');
			}else{
				document.getElementById(selectId).setAttribute('class','selected');
			}
		}
		window.scrollTo({ 
		    top: 0, //滚动到指定位置
		    behavior: "smooth" 
		});
		document.getElementById('pre').onclick=function(){prePage(0)};
		document.getElementById('next').onclick=function(){nextPage(Math.ceil(result.length/data.count))};
		document.getElementById('up').onclick=function(){up(0)};
		document.getElementById('down').onclick=function(){down(Math.ceil(result.length/data.count))};
		document.getElementById('left').onclick=function(){left()};
		document.getElementById('right').onclick=function(){right()};
	}, function(error){
		console.log(error);
	})
}
function left(){
	var id=getSelectedId();
	if(id%rowNum==1){//整除取余等于1,为第n行第一个
		return;
	}
	move(id,"left");
}
function right(){
	var id=getSelectedId();
	if(id%rowNum==0){//整除取余等于0,为第n行最后一个
		return;
	}
	move(id,"right");
}
function up(minPage){
	var id=getSelectedId();
	move(id,"up");
	var objId=document.getElementById(id);
	var indexNum=getAllBrother(objId);
	if(getAllBrother(objId)<5){
		if(page<=minPage){
			return;
		}
		page--;
		getList(page,indexNum);			
	}else{
		return;
	}	
}
function down(maxPage){
	var id=getSelectedId();
	move(id,"down");
	var objId=document.getElementById(id);
	var indexNum=getAllBrother(objId);
	if(getAllBrother(objId)>=5){
		page++;
		if(page>=maxPage-1){
			page=page-1
		}
		getList(page,indexNum);			
	}else{
		return;
	}
}
function position(obj){
	window.scrollTo({ 
	    top: obj.offsetTop-36, //滚动到指定位置
	    behavior: "smooth" 
	});
}
function prePage(minPage){
	var id=getSelectedId();
	var objId=document.getElementById(id);
	var indexNum=getAllBrother(objId);
	page=page-2;
	if(page<=minPage){
		page=0;
	}
	getList(page,indexNum);	
}
function nextPage(maxPage){
	var id=getSelectedId();
	var objId=document.getElementById(id);
	var indexNum=getAllBrother(objId);
	page=page+2;
	if(page>=maxPage-1){
		if(page%2==0){//操作过按down翻页
			page=maxPage-1
		}else{//没用过down翻页
			page=maxPage-2
		}
	}
	getList(page,indexNum);
}
/*
 *@param id被选中li id
 *		 direct操作方向
 */
function move(id,direct){
	var objId=document.getElementById(id);//通过id获取被选中li
	var selectId='';
	if(direct=='left'){
		selectId=getDomId(objId,1,"pre");//获取刚才被选中li的上一个li的id
	}else if(direct=='right'){
		selectId=getDomId(objId,1,"next");
	}else if(direct=='up'){
		selectId=getDomId(objId,5,"pre");
	}else if(direct=='down'){
		selectId=getDomId(objId,5,"next");
	}
	if(selectId=='' || selectId==null){
		return;
	}
	objId.classList.remove("selected");//删掉过去被选中的class
	document.getElementById(selectId).setAttribute('class','selected')//为被选中li附加选中状态
	position(document.getElementById(selectId));	
}
/*
 *@param obj 类似selector
 *		 num 第几个兄弟节点,类似eq(num)中的num
 *		 direct next选取下一个节点,pre选取上一个节点
 */
function getDomId(obj,num,direct){
	if(direct=='next'){
		for(var i=0;i<num;i++){
			if(obj.nextSibling==null){
				return;
			}else{
				obj=obj.nextSibling;
			}
		}
	}else if(direct=='pre'){
		for(var i=0;i<num;i++){
			if(obj.previousSibling==null){
				return;
			}else{
				obj=obj.previousSibling;
			}
		}
	}
	return obj.id
}
/*
 *获取被选中li的id
 *return id
 */
function getSelectedId(){
	var objClass=document.getElementsByClassName('selected');//通过class获取被选中的li
	var id=objClass[0].id;//获取被选中li的id
	return id;
}
/*
 *@param curEle被选元素
 *  return 有几个兄元素
 */
function getAllBrother(curEle){
    var ary=[];
    var pre=curEle.previousSibling;
    while(pre){
          if(pre.nodeType===1){
             ary.push(pre);
             pre=pre.previousSibling; 
          }else{
             pre=pre.previousSibling; 
       }
    }
    return ary.length;
}
/*
 *@param curEle被选元素
 *  return 有几个弟元素
 */
function getAllBrotherYounger(curEle){
    var ary=[];
    var pre=curEle.nextSibling;
    while(pre){
          if(pre.nodeType===1){
             ary.push(pre);
             pre=pre.nextSibling; 
          }else{
             pre=pre.nextSibling; 
       }
    }
    return ary.length;
}

//document.onkeydown=function(e){  //对整个页面文档监听 
//	var keyNum=window.event ? e.keyCode :e.which;  //获取被按下的键值 	
//	if(keyNum==37 || keyNum==65){ 
//		left();
//	}else if(keyNum==39 || keyNum==68){
//		right();
//	}else if(keyNum==38 || keyNum==87){
//		up();
//	}else if(keyNum==40 || keyNum==83){
//		down();
//	}
//	
//}

