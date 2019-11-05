<template>
    <div class="ui segment" v-if="select">
        <div  v-show="loading" style="text-align:center" ><img :src="select.loading_pic" width="40px" height="40px"></div>
        <div  v-show="select.onlysql"><pre v-text="select.data&&select.data.sql|sql"></pre></div>
        <div  class="outer scroll" v-if="select.data&&select.data.arr&&header" :style="{height:maxheight}">
            <table v-el:container class="ui selectable celled table">
                <thead>
                    <tr class="positive">
                        <th v-show="checkbox.show">
                            <input  type="checkbox" value=1 @click="choosePage()" v-model="checkbox.checkall">
                        </th>
                        <th v-for="h of header" :style="tb_style&&tb_style.th" class="is-leaf is-sortable" :class="align(h&&h.label[0],h.order)"  v-show="show(h)">
                            <div class="cell">{{label(h.label)}}<span class="caret-wrapper" v-if="h.order">
                                <i class="sort-caret ascending"  @click="paiXu(h,1)"></i>
                                <i class="sort-caret descending" @click="paiXu(h,2)"></i></span>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody v-if="select.data && select.data.total==0">
                    <tr>
                        <td :colspan="header.length" style="text-align: center">
                            <div class="ui pointing red  label">
                                OOPS! No Record!
                            </div>
                        </td>
                    </tr>
                </tbody>
                <tbody v-if="select.data && select.data.total>0">
                    <tr v-for="item of select.data.arr">
                        <td v-show="checkbox.show">
                            <input name="update" type="checkbox" :value="item.id" v-model="checkbox.ids">
                        </td>
                        <template v-for="h of header">
            
                           <td v-if="!h.tip" :style="tb_style&&tb_style.td"  :class="align(h.label[0])+' '+add_class(h,value(h,item))"  v-show="show(h)" v-html="value(h,item)" ></td>
                           <td v-else :style="tb_style&&tb_style.td"  :class="align(h.label[0])+' '+add_class(h,value(h,item))"  v-show="show(h)"  >
                                   <span @click="toTip(item,h.tip)">{{value(h,item)}}</span>
                           </td>
                        </template>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="ui segment" v-if="pagenation">
                <tfoot>
                    <tr><th :colspan="header.length" v-show="select.data && !select.data.errcode && select.data.total>0">
                        <div class="ui compact menu">
                            <a class="item">
                                <i class="icon users"></i> 记录总数
                                <div class="floating ui red label" v-text="select.data&&select.data.total"></div>
                            </a>
                            <a class="item">
                                <i class="icon user"></i> 当前记录数
                                <div class="floating ui teal label" v-text="select.data&&select.data.arr&&select.data.arr.length"></div>
                            </a>
                        </div>
                        <div class="ui compact menu" v-if="amtable">
                            <a class="item">
                                <i class="icon users"></i> 报名合同总金额
                                <div class="floating ui red label" v-text="select.data&&select.data.amt"></div>
                            </a>
                            <a class="item">
                                <i class="icon user"></i> 报名合同总数
                                <div class="floating ui teal label" v-text="select.data&&select.data.amt_n"></div>
                            </a>
                        </div>
                        <div v-show="pageTotal>0" class="ui right floated menu">
                            <a href="javascript:void(0)" class="item pager" v-text="'共 '+pageTotal+' 页'"></a>
                            <select class="ui fluid dropdown" id="span" @change="pagenation.pageNow=1" v-model="pagenation.pageSize">
                                <option v-for="p in arr_pageSize" :value="p.val" v-text="p.label" :selected="$index === 0 ? true : false"></option>
                            </select>
                            <a href="javascript:void(0)" class="icon pager" :class="{'disabled':pagenation.pageNow<=1}" v-on:click.prevent="pagenation.pageNow--;"><i class="left chevron icon"></i></a>
                            <a href="javascript:void(0)" v-for="i in pagerSpan" :class="{'active':i+pagerStart==pagenation.pageNow}" v-show="i+pagerStart<=pageTotal" class="item pager" v-text="i+pagerStart" v-on:click.prevent="pagenation.pageNow=i+pagerStart"></a>
                            <a href="javascript:void(0)" class="icon pager" :class="{'disabled':pagenation.pageNow>=pageTotal}" v-on:click.prevent="pagenation.pageNow++;alert(1)"><i class="right chevron icon"></i></a>
                        </div>
                    </th></tr>
                </tfoot>
        </div>    
     </div>      
       <modal :show.sync="tip.show" effect="zoom" width="65%">
            <div slot="title" class="modal-title">
                    <h4 style="text-align:center" v-html="tip.title"></h2>
            </div>
            <div slot="modal-body" class="modal-body">
                <div class="ui segment tip">
                    <alert  v-for="c of tip.content" :type="$index==0?'success':'info'">
                      {{trim(c)}}
                    </alert>
                </div>    
            </div>
            <div slot="modal-footer" >
               <p class="text-center tip">
                 <button type="button" class="btn btn-default btn-block" @click="tip.show=false;">关闭</button>
               </p> 
            </div>
        </modal>
 </template>

<script> 
import tooltip from '@/src/Tooltip.vue';
import Popover from '@/src/Popover.vue';
import modal from '@/src/Modal.vue';
import Alert from '@/src/Alert.vue';
export default {
   components:{
       tooltip,
       modal,
       Alert
   },
   props: {
       //loading进度
       loading: {
           type: Boolean,
           default: false
       },
       amtable:{
           type: Boolean,
           default: false
       },
       checkbox: {
           type: Object,
           default: {}
       },
       tb_style:{
           
       },
       //显示高度
       maxheight: {
	       type: String,
           default: "auto"
       },
       //输入表头
       header: {
           type: Array,
           default:[] 
       },
       //表格填充数据
       select: {
           type : Object,
           default: {}
       },
	   pagenation:{
	       type : Object
	   }
   },
   data:function(){
       return {
         tip:{show:false,title:"",content:[]},
		 pagerSpan:6,
		 arr_pageSize:[
		    {val:10,label:"每页 10 条"},{val:20,label:"每页 20 条"},{val:30,label:"每页 30 条"},{val:50,label:"每页 50 条"},
		    {val:100,label:"每页 100 条"},{val:200,label:"每页 200 条"},{val:500,label:"每页 500 条"},{val:1000,label:"每页1000条"}
         ]
       }
   },
   computed:{
       isScoll:function(){
           return this.maxheight&&this.maxheight!='auto'&&this.pagenation.pageSize>10;
       },
       pageTotal:function(){
	     if(this.select.data&&this.select.data.total){
		    return Math.ceil(this.select.data.total/this.pagenation.pageSize)
		 }
		 return 0;
	   },
       pagerStart:function(){
	     return (Math.ceil(this.pagenation.pageNow/this.pagerSpan)-1)*this.pagerSpan+1;
	   }
   },
   methods:{
      trim(c){
         return c.replace(/(^\|)|([;；]$)/g,"");
      },
      toTip(row,key){
          let content=row[key];
          content=content.replace(/(^\|)|([;；]$)/g,"");
          content=content.split("|");
          this.tip.title=`与${row['家长姓名']}(${row['家长手机']})<b>最近沟通记录</b>`;
          this.tip.content=content.reverse();
          this.tip.show=true
      },
      add_class:function(h,val){
        if(!h.class) return '';
        var cl=JSON.stringify(h.class);
        //带elemnt的value处理
        if(/\>(.*)\</.test(val)){
            val=RegExp.$1;
        } 
        cl=cl.replace(/val/ig,val);
        cl=JSON.parse(cl);
        var res=[]
        if(typeof cl=='object'){
            for(var i in cl ){
                if (eval(cl[i])) res.push(i);
            }  
         }        
        return res.join(" ");
      },
      choosePage:function(){
        this.checkbox.ids=[];
        //迟缓
        if(!this.checkbox.checkall){
            let data=this.select.data.arr;
            data=data.reduce(function(item,next){
                item.push(next.id);
                return item;
            },[])  
            this.checkbox.ids=data;
        }
      },
	  paiXu:function(h,order){
         this.header.map(function(h){
		   if(h.order)h.order=-1;
		 })
         h.order=order;
         this.pagenation.order=(h.value[2]||this.label(h.label))+" "+(order==1?"asc":"desc")+",";
         this.pagenation.pageNow=1;
	  }, 
      show:function(h){
	    if(!h) return true;
	    var isShow=h.label[1];
        var key=h.value[2]||h.label[0]&&h.label[0].split("|")[0];
        // if(key=="m_code"){
        //     console.error(isShow)
        // }
        //数据不存在的key字段,不显示
        if(key!="row"&&this.select.data&&this.select.data.arr[0]&&
          !this.select.data.arr[0].hasOwnProperty(key)){
            return false;
        //其他附加不显示
		}else if (typeof isShow ==="boolean"){
		    return isShow;
		}else if(typeof isShow ==="function"){
		    return isShow(key);
		}else{
		    return true;
		}
	  },
      label:function(l){
	    var decr=l[2];
        var name=l[0]&&l[0].split("|")[0];
		if(typeof decr==="function"){
		   return decr(name);
		}else{
		   return name;
		}
	  },
	  value:function(h,item){
	    var key=h.value[2]||h.label[0].split("|")[0];
	    var def=h.value[0];
		var method = h.value[1];
		if(key){
            var res =(key=='row'?item:item[key])||h.value[0]; 
		    if(typeof method==="function"){
                res=method(res);
			}else if(['age','num','amt','dt'].indexOf(method)!=-1){
                //console.error(this[method])
                res=this[method](res);
            }
		}else{
		    res='';
        }
        res=res||'';
        res=res.replace(/(^[,;\s]+|[,;\s]+$)/,""); //去首尾多余字符
        return res;
	  },
      align:function(lname,order){
	    var p= "";
	    p = lname&&lname.split("|")[1]||"";
        p = p.toLowerCase();
        var cls="";
		switch (p){
		  case "l":
             cls= "left aligned";
             break;
		  case "r":
		     cls= "right aligned";
		  default:
		     cls= "center aligned";
        }
        if(order>-1){
            cls+=order==1?' ascending':' descending';
        }
        return cls;
	  },
      age:function(a){
          if(a&&(a.length>2||a.indexOf('-')!=-1||a.indexOf('/')!=-1)){
            return a;
          }else if(a&&a>'0'){ 
            return a+'岁';
          }else{
            return '';
          }
      },
      dt:function(n){
          if(n==0||!n) return '';
          return  this.fmtDt_s(n)
      },
	  num:function(num){
	     if(!num) return 0;
	     return parseInt(num);
	  },
	  amt:function(num){
	     if(!num) return '￥0.00';
	     return '￥'+num.toFixed(2);
	  }	  
   },
   watch:{
        select:{
            handler(newValue, oldValue) {
                $('.tooltips')&&$('.tooltips').toolTip();
    　　　　 },
    　　    deep: true
        }
   },
   created:function(){
       //console.error(this.amtable);
      // console.log(JSON.stringify(this.header))
   }
}
</script>
<style scoped>
    .highlight{
         font-weight:bold;
    }
    .scroll{
        overflow-y: scroll;
    }
    .text-danger{
        font-weight:bold;
    }
    a.disabled {
        pointer-events: none;
        filter: alpha(opacity=50); /*IE滤镜，透明度50%*/
        -moz-opacity: 0.5; /*Firefox私有，透明度50%*/
        opacity: 0.5; /*其他，透明度50%*/
    }
    #span{
        padding-top:2.2%!important;
        height: 150%;   
        border: none;
    }
    pre {
        display: block;
        padding: 9.5px;
        margin: 0 0 10px;
        font-size: 13px;
        line-height: 1.42857143;
        color: #333;
        word-break: break-all;
        word-wrap: break-word;
        background-color: #f5f5f5;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
    pre {
        white-space: pre-wrap;
    }
    .container{
        width: 58%;
    }
    .checkbox{
        cursor: pointer;
    }
    .alert-icon-float-left {
        font-size: 32px;
        float: left;
        margin-right: 5px;
    }
    .pager {
        margin: 0!important;
    }
    .icon.pager {
        position: relative;
        padding-top:;
        vertical-align: middle;
        line-height: 1;
        text-decoration: none;
        -webkit-tap-highlight-color: transparent;
        -webkit-box-flex: 0;
        -webkit-flex: 0 0 auto;
        -ms-flex: 0 0 auto;
        flex: 0 0 auto;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        background: 0 0;
        padding: 0 0.6em;
        padding-top:1em; 
        text-transform: none;
        color: rgba(0,0,0,.87);
        font-weight: 400;
        -webkit-transition: background .1s ease,box-shadow .1s ease,color .1s ease;
        transition: background .1s ease,box-shadow .1s ease,color .1s ease;
    }

    .sort-caret {
        width: 0;
        height: 0;
        border: 5px solid transparent;
        position: absolute;
        left: 7px;
    }
    .sort-caret.ascending {
        border-bottom-color: #c0c4cc;
        top: 5px;
    }
    .sort-caret.descending {
        border-top-color: #c0c4cc;
        bottom: 7px;
    }



    .ascending .sort-caret.ascending {
        border-bottom-color: #409EFF
    }

    .descending .sort-caret.descending {
        border-top-color: #409EFF
    }

    th {
        white-space: nowrap;
        overflow: hidden;
        user-select: none;
        text-align: left;
    }
    th.is-sortable {
        cursor: pointer;
    }

    td,th.is-leaf {
    border-bottom: 1px solid #ebeef5;
    }
    .caret-wrapper {
        display: -webkit-inline-box;
        display: -ms-inline-flexbox;
        display: inline-flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -ms-flex-direction: column;
        flex-direction: column;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        height: 34px;
        width: 24px;
        vertical-align: middle;
        cursor: pointer;
        overflow: initial;
        position: relative;
    }
    .cell {
        position: relative;
        word-wrap: normal;
        text-overflow: ellipsis;
        vertical-align: middle;
        width: 100%;
        box-sizing: border-box;
    }
    .ui.table tr td{
        vertical-align: middle;
    }
    .tip{
        font-size: 1.3rem!important;
    }
</style>