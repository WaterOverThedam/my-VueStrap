<template>
	<div class="ui segments">
			<div class="ui segment">
				<div class="ui three column stackable grid">
					<div class="column left aligned">
						<div class="input-group">
							<span class="input-group-addon">家庭视图</span>          
							<v-select :value.sync="familyType" :options="typeGroup" options-label="label" options-value="val" close-on-select></v-select>				
						</div>
					</div>
					<div class="column left aligned">
						<bs-input label="With dropdown and button" :value.sync="search" placeholder="手机号/家长/孩子"  showClear style="width:72%" type="text">
							<dropdown slot="after">
								<button slot="before" type="button" class="btn btn-default" @click.prevent="init()"><span class="glyphicon glyphicon-search"></span>&nbsp;搜索</button>
								<li><a href="#dropdown"></a></li>
								<ul slot="dropdown-menu" class="dropdown-menu">
									<li><a href="#dropdown" @click.prevent="toAdv()">高级筛选</a></li>
								</ul>
							</dropdown>
						</bs-input> 
					</div>
					<div class="column center aligned">
						<div class="ui small action input">
							<a type="submit" href="https://bbk.800app.com/index.jsp?mfs=crm_sj&mid=-1&menu=3" target="_blank" class="btn btn-default">新建家庭</a> 
						</div>
						<div v-show="isadmin" class="ui small action input">
							<a type="submit" @click="goSave()" class="btn btn-primary">批量修改负责老师</a> 
						</div>
					</div>
				</div>	
			</div>
			<div class="ui segment">
				<div class="ui form">
					<div class="inline fields" v-if="familyType=='potential'">
						<label>筛选条件：</label>
						<div class="field">
							<div class="ui checkbox">
								<input id="onlyNoItro" type="checkbox" v-model="onlyNoItro">
								<label for="onlyNoItro" >{{notroTip}}</label>
							</div>
						</div>
						<div class="field" v-if="isSaleMan">
							<div class="ui checkbox">
								<input id="onlyNoSign" type="checkbox" v-model="onlyNoSign">
								<label for="onlyNoSign" >仅显示8月12日后录入且30天内体验未签约的</label>
							</div>
						</div>
					</div>
					<div class="inline fields" >
						<label>打印SQL</label>
						<div class="field">
							<div class="ui checkbox">
								<input id="sql" type="checkbox" v-model="select.onlysql">
								<label for="sql">仅打印SQL</label>
							</div>
						</div>
					</div>
				</div>   
			</div>
			
			<tlg-table :select="select" :checkbox="tchecked" :tb_style="tb_style" :maxheight="tbl_maxheight"  :header="theader" :pagenation=pagenation :loading="select.start" ></tlg-table>
		
			<modal :show.sync="dialogAdv.show" effect="fade" :width="450" >
				<span slot="title">
					{{dialogAdv.title}}
				</span>
				<div slot="modal-body" class="modal-body">
				  <div class="ui grid">
						<template v-for="t in Tp" track-by="$index">
								<div class="sixteen wide column filter">
									<div class="ui labeled  input">
										<i class="plus icon" @click="plus(t)" v-if="$index==0"></i>
										<i class="minus icon" @click="minus($index)" v-else></i>
										<v-select :value.sync="t"  placeholder="请选择条件" clearable :options="searchTypesFilter" options-value="val" options-label="label" style="width:135px"></v-select>	
										<v-select :value.sync="Tm" placeholder="无"  :options="followTime" options-value="val" v-show="t=='follower'"></v-select>	
										<v-select v-for="s of searchTypes['quality'].sub_option" :options="s.vals" :value.sync="s.val" v-if="t=='quality'" ></v-select>	
										<datepicker v-for="s of t&&searchTypes[t].sub_option" :value.sync="s.val" :format="s.fmt" :clear-button="clear" :placeholder="s.placeholder"  width="120px" v-if="t=='dtzx'"></datepicker>
										<bs-input :class="{'optionval':t&&searchTypes[t].sub_option.length==2}" v-for="s of t&&searchTypes[t].sub_option" type="text" :value.sync="s.val" :placeholder="s.placeholder" @change="val_match(s)"  v-if="t!='quality'&&t!='dtzx'"></bs-input>
									</div>								
								</div>					   
						</template>	
                  </div>
				</div>
				<div slot="modal-footer" class="modal-footer">
					<button type="button" class="btn btn-success" @click="goSearch(true)">搜索</button>
					<button type="button" class="btn btn-default" @click="dialogAdv.show = false">取消</button>
				</div>
			</modal>
			<modal :show.sync="typeModal.show" effect="fade" :width="400">
				<div slot="modal-header" class="modal-header">
					<h4 class="modal-title">
					<b>{{typeModal.title}}</b> 
					</h4>
				</div>
				<div slot="modal-body" class="modal-body">
					<v-select :value.sync="updateType" required>
						<v-option v-for="t of updateTypes" :value="$index+1">{{t}}</v-option>
					</v-select>	
				</div>
				<div slot="modal-footer" class="modal-footer">
					<button type="button" class="btn btn-success" @click="goSave(1)">确定</button>
					<button type="button" class="btn btn-default" @click="goCancel()">退出</button>
				</div>
			</modal>
			<modal :show.sync="saveLsModal.show" effect="fade" small>
				<div slot="modal-header" class="modal-header">
					<h4 class="modal-title">
					<b>{{saveLsModal.title}}</b> 
					</h4>
				</div>
				<div slot="modal-body" class="modal-body">
					<div class="ui form">
						<div class="field">
							<bs-input class="header" maxlength=10 disabled :value="updateType&&updateTypes[updateType-1]" icon></bs-input>
						</div>
					</div>
					<div class="ui form">
						<div class="two fields">
							<div class="field" v-show="updateType!=5"><v-select :value.sync="saveLsModal.former" placeholder="原负责老师"  clearable multiple :options="saveLsModal.formers" options-label="name" options-value="id" required></v-select></div>	
							<div class="field"><v-select :value.sync="saveLsModal.newer" placeholder="新负责老师" clearable :options="saveLsModal.newers" options-label="name" options-value="id" required></v-select></div>
						</div>
					</div>
				</div>
				<div slot="modal-footer" class="modal-footer">
					<button type="button" class="btn btn-success" @click="save()">转换</button>
					<button type="button" class="btn btn-danger" @click="reset()">重置</button>
				</div>
			</modal>
			<alert :show.sync="alertError.show" placement="top" duration="4000" type="danger" width="400px" dismissable>
					<span class="glyphicon glyphicon-info-sign"></span>
					<strong>{{alertError.title}}</strong>
					<p style="padding-left:8%" v-html="alertError.msg"></p>
			</alert>
			<alert :show.sync="alertSuccess.show" placement="top" duration="3000" type="success" width="400px" dismissable>
					<span class="ion-information-circled alert-icon-float-left"></span>
					<strong>{{alertSuccess.title}}</strong>
					<p v-html="alertSuccess.msg"></p>
			</alert>
			<alert :show.sync="alertInfo.show" placement="top" duration="0" type="info" width="400px" dismissable>
					<span class="ion-information-circled alert-icon-float-left"></span>
					<strong>{{alertInfo.title}}</strong>
					<p v-html="alertInfo.msg"></p>
			</alert>
	</div>
</template>
 

<script>
import vSelect from '@/src/Select.vue'
import vOption from '@/src/Option.vue'
import alert from '@/src/Alert.vue'
import modal from '@/src/Modal.vue'
import bsInput from '@/src/Input.vue'
import tlgTable from '@/src/Table.vue'
import tooltip from '@/src/Tooltip.vue'
import dropdown from '@/src/Dropdown.vue'
import datepicker from 'src/Datepicker.vue'
import formGroup from 'src/formGroup.vue'

export default {
  props: {
    select: {
       type:Object
    }
  },
  components:{
	vSelect,
	vOption,
	alert,
	modal,
	bsInput,
	tlgTable,
	dropdown,
	datepicker,
	tooltip,
	formGroup
  },
  data(){
    return{
		  tbl_maxheight:"480px",	 
		  familyType:'',
		  updateType:null,
		  updateTypes:['转移老师负责的所有例子','转移老师负责的全部潜在客户','转移老师负责的全部活跃会员','转移老师负责的全部历史会员','仅转移复选框选中的记录'],
		  searchTypes:{
			  age:{label:"孩子年龄",sub_option:[{val:"",opr:">=",placeholder:"年龄下限(个月)",match:"^[1-9]\\d*$",errmsg:"请输入正确的年龄月数"},{val:"",opr:"<=",placeholder:"年龄上限(个月)",match:"^[1-9]\\d*$",errmsg:"请输入正确的年龄月数"}],context:"active,history,potential"},
			//   kid:{label:"孩 子",sub_option:[{val:"",opr:"like",placeholder:"姓名任意字符"}],context:"all"},
			//   parent:{label:"家长姓名",sub_option:[{val:"",opr:"like",placeholder:"姓名任意字符"}],context:"recent"},
			//   phone:{label:"家长手机",sub_option:[{val:"",opr:"=",placeholder:"手机号"}],context:"all"},
			  dtzx:{label:"咨询日期",sub_option:[{val:"",opr:">=",fmt:'yyyy-MM-dd',placeholder:"开始日期"},{val:"",opr:"<=",fmt:'yyyy-MM-dd',placeholder:"结束日期"}],context:"potential"},
			  tutor:{label:"负责老师",sub_option:[{val:"",opr:"like",placeholder:"老师姓名"}],context:"all"},
			  follower:{label:"老师跟进",sub_option:[{val:"",opr:"like",placeholder:"老师姓名"}],context:"all"},
              quality:{label:"客户质量评估",sub_option:[{val:undefined,opr:"=",vals:['希望非常大，加油！','比较有希望，努力！','还行，继续跟！','拼一拼，还是可以的！','缘分暂时没到！']}],context:"potential"},
			  channel:{label:"获得家长信息的渠道",sub_option:[{val:"",opr:"like",placeholder:"任意字符"}],context:"potential"}
		  },
		  Tp:[undefined],
		  Tm:6,
		  followTime:[{val:0,label:"今天"},{val:6,label:"一周内"}],
		  pagenation:{
            pageSize :10,
			pageNow:1,
			order:""
		  },
          alertError:{show:false,title:'错误提示',msg:''},
		  alertInfo:{show:false,title:'操作提示',msg:''},
		  alertSuccess:{show:false,title:'操作提示',msg:'导入成功'},
		  onlyNoItro:false,
		  onlyNoSign:false,
		  sql_cur:sql_recent,
		  getQuery:this.getEnrol,
		  theader:[],
		  tchecked:{
			  show:false,
			  ids:[],
			  checkall:false
		  },
		  tb_style:{
			  th:{padding: ".22857143em .998571429em"},
			  td:{padding: ".38571429em",fontSize:"13px"}
		  },
		  typeModal:{show:false,title:'批量修改方式选择',dropback:false},
		  saveLsModal:{show:false,title:'批量转换负责老师',dropback:false,formers:[],newers:[],former:null,newer:null},
		  dialogAdv:{
			show:false,
			title:"高级筛选",
			conditions:[{label:"报名日期(选填)",type:'daterange',item:'dtenrol',value:[]},{label:"姓名(选填)",type:'string',item:"babyname",value:undefined},{label:"手机(选填)",type:'string',item:"phone",value:undefined}]
		  },
		  search:"",
		  adv:""
	}
  },
  computed:{
	    notroTip(){
		   if(this.isSaleMan) return '仅显示8月12日后录入且30天内未跟进或未体验的';
           return '仅显示未体验的';
		},
		typeGroup:function(){
			if(this.isSaleMan){
				this.familyType="potential";
                return [{val:'potential',label:'我负责的潜在客户'}];
			}else if(this.isadmin||(this.select.gym_selected&&this.select.gym_selected.split("|")[1]==1)){
				return [
					{val:'recent',label:'本中心今天查看过的家庭'},{val:'potential',label:'我负责的潜在客户'},
					{val:'active',label:'我负责的活跃会员'},{val:'history',label:'我负责的历史会员'}	 
				];
			}else{
				return  [{val:'recent',label:'本中心今天查看过的家庭'}];
			}
		},
		isSaleMan:function(){
           return this.select.acl.indexOf('销售培训师')!=-1;
		},
		isadmin:function(){
			if(this.select.acl.indexOf('系统管理员')!=-1
			||this.select.acl.indexOf('运营顾问')!=-1
			||this.select.acl.indexOf('中心运营总监')!=-1){
				return true;
			}
			return false;
		},
		searchTypesFilter:function(){
			var res=[],item,self=this;
			for(var i in this.searchTypes){
				item=this.searchTypes[i];
				if(item['context']=="all"||item['context'].indexOf(this.familyType)!=-1){
                    res.push({label:item.label,val:i});
				}
			}
			return res;
		},
		condition:function(){
			var self=this,c=[];
			//console.error(this.onlyNoItro&&this.isSaleMan)
			if(this.onlyNoItro&&this.isSaleMan)c.push("charindex('出勤',最近体验)<=0");
			//普通条件或高级条件
			if(this.adv){
				let c_join=function(label,opr,val){
					label=label.replace(/\s+/ig,"")+" ";
					var res="";
					if(opr=="like"){
						res=label+opr+" '%"+val.trim()+"%'";
					}else{
						res=label+opr+((typeof val=='nummber')?val:" '"+val+"'");
					}
					return res;
				}
				var item=undefined;
				this.Tp.forEach(function(t){
					item=t&&self.searchTypes[t];
					if(t!='follower'&&t!='age'&&item){
						item.sub_option.map(function(p){
							if(p.val&&p.val.trim()!=""){
								c.push(c_join(item.label,p.opr,p.val))
							}
						})
					}
					//age特殊
					if(t=="age"){
						var p=self.searchTypes['age'].sub_option;
						if(p&&p[0].val.trim()!=""&&p[0].val.trim()!="") c.push("孩子<>''");
					}
				})
            }else{
				if(this.search&&this.search.trim()!=""){
					c.push("charindex('"+this.search.trim()+"',search)>0");
				}
			}
			//共用条件及最终join条件字串
			if(this.onlyNoItro&&!this.isSaleMan)c.push("孩子<>''");
			if(this.onlyNoSign) c.push("孩子<>''");

			c = Array.from(new Set(c));
			c = c.join(" and ");
			return c;
		},
		whereLs:function(){
			if(this.isSaleMan){
                return 'and zx.crmzdy_87692991=1';
			}else if(this.isadmin){
                return '';
			}else{
				return 'and zx.crmzdy_81636452_id=iduser';
			}
		},
     	whereAge:function(){
		   var con='';
		   var indx=this.Tp.indexOf('age')
		   if(indx!=-1&&this.adv){
			 var option=this.searchTypes['age'].sub_option;
		     if(option[0].val.trim()!=''){
		        con += "and hz.crmzdy_80653845>=dateadd(d,-@up*30,getdate())";
			 }
			 if(option[1].val.trim()!=''){
			    con +=" and hz.crmzdy_80653845<=dateadd(d,-@down*30,getdate())";
			 }
             con = con.replace('@down',option[0].val).replace('@up',option[1].val);	
			 return con;
           }
           return '';		   
		},
		WhereNoIntro:function(){
			if(this.onlyNoItro){
               return " and not exists(select 1 from crm_zdytable_238592_23576_238592_view ty where zx.id=ty.crmzdy_81620307_id and ty.crmzdy_80653847_id=hz.id and datediff(d,getdate(),ty.crmzdy_80650731)>0 and ty.crmzdy_80650306<>'请假') and /*无出勤体验*/ not exists(select 1 from crm_zdytable_238592_23576_238592_view ty where zx.id=ty.crmzdy_81620307_id and ty.crmzdy_80653847_id=hz.id and datediff(d,getdate(),ty.crmzdy_80650731)<=0 and ty.crmzdy_80650306='出勤')";
			}
			//体验出勤30内未报名
			if(this.onlyNoSign) return "and  exists(select 1 from crm_zdytable_238592_23576_238592_view ty where zx.id=ty.crmzdy_81620307_id and ty.crmzdy_80653847_id=hz.id and datediff(d,getdate(),ty.crmzdy_80650731)<-30 and ty.crmzdy_80650306='出勤')";
			return '';
		},
	    options:function(){
          return {pageSize:this.pagenation.pageSize,pageNow:this.pagenation.pageNow,order:this.pagenation.order,condition:this.condition} 
		}, 
		theader_comm: function(){
		    return [
				//{lable:['name','fn_show','fn_label_handle'],value:['default','fn_value_handle','key_override']}
			   {label:['操作'],value:['',this.urlView_zx(),'row']},
			   {label:['家长手机'],value:['',this.urlView_zx("家长手机"),'row']},
			   {label:['家长姓名|l'],value:[''],order:-1},
			   {label:['孩子|l'],value:[''],order:-1},
			   {label:['咨询日期',this.field_show("potential")],value:[''],order:-1},
			   {label:['获得家长信息的渠道',this.field_show("potential")],value:[''],order:-1},
			   {label:['客户质量评估|l',this.field_show("potential")],value:[''],order:-1},
			   {label:['最近体验|l',this.field_show("potential",'ty')],value:[''],order:-1},
			   {label:['负责老师'],value:[''],order:-1},
			   {label:['报名课程情况|l',this.field_show("active,history")],value:[''],order:-1},
			   {label:['合同到期日期',this.field_show("history")],value:['','dt'],order:-1},
			   {label:['最近沟通记录|l'],value:['','','recent'],order:-1},
			   {label:['是否报名2019飞跃挑战赛|r',this.field_show("active")],value:[''],order:-1,class:{"highlight":"true"}},
			   {label:['最新清单显示日期',this.isSaleMan],value:[''],order:2},
			   {label:['最近浏览时间'],value:['',this.fmtDt("yyyy-MM-dd hh:mm:ss")],order:2,tip:"gt"}
			]   
		},
		sqlBuilder:function () {
			var sql=this.sql_cur;
			var indx=this.Tp.indexOf('follower');
			if(indx!=-1){
			   sql +=" cross apply(select top 1 convert(varchar(20),create_time,120)+ ', '+cust_name+'：'+crmzdy_81748934 recent from crm_zdytable_238592_25121_238592_view gt where gt.crmzdy_81748926_id=zx.id and crmzdy_81762823<>'短信' and datediff(d,gt.create_time,getdate())<=@limit and cust_name like '%@ls%' order by id desc)gt";
			   sql =sql.replace('/*main*/','/*main*/ gt.recent,').replace("@limit",this.Tm).replace("@ls",this.searchTypes['follower'].sub_option[0].val||'');
			}
			//console.log("2:"+this.sql_cur);
			sql=sql.replace("@whereAge",this.whereAge)
			sql=sql.replace("@idGym",this.select.gym_selected&&this.select.gym_selected.split("|")[0])
			sql=sql.replace("@whereNoIntro",this.WhereNoIntro)
			sql=sql.replace("@whereLs",this.whereLs)
			//console.log(this.sql(sql))
			sql=this.fn_pager(sql,this.options) 
			//console.log(this.sql(sql))
			sql = this.convertor.ToUnicode(sql);
			return sql; 
		}
  },
  methods:{	 
	    toAdv(){
			this.dialogAdv.show=true
			if(!this.searchTypes.tutor.sub_option[0].val)this.searchTypes.tutor.sub_option[0].val=this.select.user;
		},
	    plus:function(t){
		   if(this.Tp.length>=this.searchTypesFilter.length) return;
           this.Tp.push(undefined);
		},
	    minus:function(index){
           this.Tp.splice(index,1);
		},
	    goSearch:function(adv){ 
			this.adv=adv||false;
			this.dialogAdv.show=false;
			this.init();
	    },
	    goCancel(){
		   this.updateType=null;
           this.typeModal.show=false;
		},
		goSave(type){
			if(!this.updateType){
				this.typeModal.show=true;
				if(!this.alertError.show&&type==1){
				    this.alertError={show:true,title:'错误提示',msg:'请选择批量修改的方式'};
				}
			}else{
				this.typeModal.show=false;
				if(this.updateType==5){
					this.tchecked.show=true;
					if(this.tchecked.ids.length>0){
						this.alertInfo.show=false;
						this.getLs();
					}else{
                        this.alertInfo={show:true,title:'操作提示',msg:'请先搜索并选中需要修改的记录, 再点击"批量修改按钮"'};
					}
				}else{
					this.tchecked.show=false;
					this.alertInfo.show=false;
					this.getLs();
				}
			}
		},
	    decorate:function(field){
			var arr=['婴芭莎展会'];
			if(arr.indexOf(this.select.campaign_selected)!=-1)return '家长姓名';
			return field;
		},
        urlEdit:function(row){
            var u= "<a class='btn btn-default btn-sm' href='https://bbk.800app.com/index.jsp?mfs=crm_zdytable_238592_27045&mid=@id&menu=1109&gym=@gym' target='_blank'>修改</a>";
            return u.replace('@id',row.id).replace('@gym',this.convertor.ToUnicode(this.select.gymNames[row.sign_centerid]));
        },
	    field_show:function(types,t){
            return types.indexOf(this.familyType)!=-1;
		},
		val_match:function(op){
			if(op.match){
				var reg=new RegExp(op.match);
				var val=op.val.trim();
				if (val!=""&&!reg.test(val)){
					this.alertError={title:"错误提示",msg:op.errmsg,show:true};
					op.val="";
				}
			}
			console.log(JSON.stringify(this.condition))
		},
		validate:function(showErr=true){
		    if(!this.select.gym_selected) {
              if(showErr){
			     this.alertError={title:"错误提示",msg:"中心名称能不为空",show:true}
			  }
			  return false;
			}
		    return true;
	   },
		valid_update:function(type){
		    if(type==5) {
				if(this.tchecked.ids.length==0){
					this.alertError={title:"错误提示",msg:"请先搜索并选中需要修改的记录",show:true};
					return false;
				}
			}else{
				if(this.saveLsModal.former.length==0){
					this.alertError={title:"错误提示",msg:"请选择原负责老师",show:true};
					return false;
				}
			}
			if(!this.saveLsModal.newer){
				this.alertError={title:"错误提示",msg:"请选择新负责老师",show:true};
				return false;
			}
		    return true;
	   },
       fn_update:function(str){
            var header="with ";
            if(/with.+as/.test(str)){
              header=","
            } 
            if(/^(.*)(select\s*?)\/\*main\*\/(.*?)[;]?$/.test(str)){
				str = RegExp.$1+header+"p as("+RegExp.$2+RegExp.$3+")";
				str += "update p set idls=@newer where idls in(@former);";
            }else{
                throw new Error("sql没有main标识！")
            }
            return str;
       },
	   save(){
		   if(!this.valid_update(this.updateType))return;
		   let sql_update=null;
		   if(this.updateType==5){
			  sql_update="update zx set zx.crmzdy_81636452_id=@newer from crm_zdytable_238592_25111_238592_view zx where zx.id in (@ids);";
			  sql_update=sql_update.replace("@ids",this.tchecked.ids.join(","));
		   }else if(this.updateType==1){
			  sql_update="update zx set zx.crmzdy_81636452_id=@newer from crm_zdytable_238592_25111_238592_view zx where zx.crmzdy_81620171_id =@idGym and zx.crmzdy_81636452_id in (@former);";
		   }else if(this.updateType==2){
			  sql_update=sql_potential;
			  sql_update=this.fn_update(sql_update);
		   }else if(this.updateType==3){
			  sql_update=sql_active;
			  sql_update=this.fn_update(sql_update);
		   }else if(this.updateType==4){
			  sql_update=sql_history;
			  sql_update=this.fn_update(sql_update);
		   }
		   sql_update=sql_update.replace("@idGym",this.select.gym_selected&&this.select.gym_selected.split("|")[0]);
		   sql_update=sql_update.replace("@whereLs","").replace("@whereAge","").replace("@whereNoIntro","");
		   sql_update=sql_update.replace("@former",this.saveLsModal.former.join(",")).replace("@newer",this.saveLsModal.newer);
		   console.log(sql_update)
		   if(sql_update){
				sql_update+="select top 1 0 errcode,'ok' errmsg from crm_yh_238592_view for json path,without_array_wrapper;"
				sql_update=this.convertor.ToUnicode(sql_update);
				let self=this;
				self.select.start=true;
				self.saveLsModal.show=false;
				self.$axios({
						method: 'post',
						url:url_local,
						params:{sql1:sql_update,onlysql:(self.select.onlysql?1:0)}
					}).then(function(res){
						if(res.status=200&&res.data.errcode==0){
							self.alertSuccess={show:true,title:'操作提示',msg:'操作成功'};
							self.reset("q");
						}else{
                            self.alertError={title:"错误提示",msg:"操作失败",show:true}
						}
						self.select.start=false;
						self.getFam();
					},function(res){
						self.select.start=false;
						console.log(res.status);
					});
		    }
	   },
	   reset(type){
		   this.saveLsModal.former=null;
		   this.saveLsModal.newer=null;
		   this.saveLsModal.show = false;
		   this.updateType=null;
		   this.tchecked={show:false,checkall:false,ids:[]};
		   if(type!="q"){
		      this.typeModal.show=true;
		   }
	   },
	   getLs:function(){
			var self=this;
			self.select.start=true;
			var sql=sql_ls;
			sql = sql.replace(/@idGym/ig,this.select.gym_selected&&this.select.gym_selected.split("|")[0]);
			sql = this.convertor.ToUnicode(sql);
			self.$axios({
				method: 'post',
				url:url_local,
                params:{sql1:sql,onlysql:(self.select.onlysql?1:0)}
			}).then(function(res){
			    if(res.status=200){
				   //console.log(JSON.stringify(res.data))
				   self.saveLsModal.formers=res.data.formers;
				   self.saveLsModal.newers=res.data.newers;
				   self.saveLsModal.show=true;
				}
				self.select.start=false;
            },function(res){
                self.select.start=false;
                console.log(res.status);
            });
	   },
       getFam:function(){
		    if(!this.validate()) return;
			var self=this;
			self.select.start=true;
			self.$axios({
				method: 'post',
				url:url_local,
                params:{sql1:this.sqlBuilder,onlysql:(self.select.onlysql?1:0)}
			}).then(function(res){
			    if(res.status=200){
				   self.select.data=res.data;
				}
				//console.log(JSON.stringify(self.select.data))
				self.select.start=false;
            },function(res){
                self.select.start=false;
                console.log(res.status);
            });
        },
		init(){
			this.select.data=null;
			var order="";
			var h=this.theader.find(function(h){
                return (h.label[1]==undefined||h.label[1])&&h.order&&h.order>-1;
			})
			//console.error(h)
			if(h){
				var order=(h.value[2]||this.labelify(h.label))+" "+(h.order==1?"asc":"desc")+",";
			}
			var v = {
				pageSize :10,
				pageNow:1,
				order:order
			}
			//if(this.isEqual(this.pagenation,v)){
			this.pagenation=v;
			//}
		},
		checkImportable(gymcode){
			//console.error(gymcode)
			var self=this;
			self.select.start=true;
			var sql=`select 0 errcode,'ok'errmsg,json_query(crmzdy_87700904) s,'@sql' sql from crm_zdytable_238592_26995_238592_view where id=1 for json path,without_array_wrapper`;
			//console.error(sql)
			self.$axios({
				method: 'get',
				url:url_local,
				params:{sql1:sql}
			}).then(function(res){
			    if(res.status=200){
				   let s=res.data&&res.data.s;
				  // console.error(s)
				   if(s){
					   s=s.find(function(item){
                          return item.gym&&item.gym.indexOf(gymcode)!=-1;
					   })
				   }
				   if(s){
					   if(self.isadmin){
					      self.select.importable=true;
					   }else{
						  if(s.sd_enable&&self.select.acl.indexOf('销售主管')!=-1){
							 self.select.importable=true; 
						  } 
					   }
				   }else{
					   self.select.importable=false; 
				   }
				}
				self.select.start=false;
            },function(res){
                self.select.start=false;
                console.log(res.status);
            });
		},
		debug(){
			console.error(this.select.gym_selected)
		}
  },
  watch: {
	onlyNoItro(){
		if(this.onlyNoSign)this.onlyNoSign=false;
		this.init();
	},
	onlyNoSign(){
		if(this.onlyNoItro)this.onlyNoItro=false;
	    this.init();  
	},
    familyType (newval) {
		this.theader=this.theader_comm;
		this.Tp=[undefined];
		let sql_potential_cur=sql_potential;
		if(this.isSaleMan){
			sql_potential_cur=sql_potential2;
		}
		switch(newval){
			case 'recent':
				this.sql_cur=sql_recent;
				break;
			case "potential":
				this.sql_cur=sql_potential_cur;
				break;
			case "active":
				this.sql_cur=sql_active;
				break;
			case "history":
				this.sql_cur=sql_history;
				break;
			default:
			    this.sql_cur=sql_recent;
		}
		if(this.validate(false)){
		   this.init();
		}
	},
    pagenation:{
		handler(newValue, oldValue) {
			this.getFam();
　　　   },
　　　   deep: true
	},
    'select.gym_selected':function(newValue){
		if(this.validate(false)){
			this.init();
		}
		this.checkImportable(newValue&&newValue.split("|")[3]);
	}
	
  },
  ready(){
	  this.select.cur_menu="family";
	  this.familyType="recent";
  }
}
</script>
 <style  scoped>
	.plus,.minus{
		margin-top:2%;
        cursor:pointer;
	}
	.box{
		border:1px dashed #000;
	}
	.mz-datepicker input {
		border-radius: 6%;
		margin-bottom: 6%;
	}
    .filter{
		padding-bottom: 0!important;
		padding-top: 1%!important;
	}
	.ui.selection.dropdown{
		padding-right: .2em!important;
		padding-bottom: .6em!important;
	}
	.optionval{
		width:30%!important;
		font-size:12px!important;
	}
	.box{
		border:1px dashed #000;
	}
	.header{
		font-weight:bold;
		color:black!important;
		font-size:1.4em;
	}
	.ui.compact.selection{
		font-size:13px!important;
	}
</style>
 