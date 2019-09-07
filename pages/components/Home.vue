
<template>
	<div class="ui segments">
			<div class="ui segment">
				<div class="ui relaxed grid">
					<div class="seven wide column">
						<div class="ui grid">
							<div class="ten wide column">
								<div class="input-group">
									<span class="input-group-addon">活动</span>          
									<v-select v-if="false" :value.sync="select.group_cur" clearable :multiple="select.multi" placeholder="活动分类" :options="select.vgroup" options-label="name" options-value="name" @change="select.campaign_selected=[];" close-on-select>
									</v-select>					
									<i-select  :model.sync="select.campaign_selected" style="width:200px" placeholder="活动名称" clearable multiple filterable>
										<Option-group v-for="g of select.vgroup" :label="g.name" v-if="cFilterby(campaigns,g)">
											<i-option v-for="item in cFilterby(campaigns,g)" :value="item.id">{{ item.name }}</i-option>
										</Option-group>
									</i-select>
								</div>
							</div>
							<div class="six wide column">
								<v-select :value.sync="summerType" :options="typeGroup" options-label="label" options-value="val" close-on-select>
								</v-select>
							</div>
						</div>
					</div>
					<div class="four wide column">
						<bs-input label="With dropdown and button" :value.sync="search"  placeholder="手机号/姓名"  showClear style="width:90%" type="text">
							<dropdown slot="after">
								<button slot="before" type="button" class="btn btn-default" @click.prevent="init()"><span class="glyphicon glyphicon-search"></span>&nbsp;搜索</button>
								<li><a href="#dropdown">...</a></li>
								<ul slot="dropdown-menu" class="dropdown-menu">
									<li><a href="#dropdown" @click.prevent="dialogAdv.show=true">高级筛选</a></li>
								</ul>
							</dropdown>
						</bs-input> 
					</div>
					<div class="five wide column">
						    <div class="ui mini action input">
						        <button class="btn btn-primary" @click="goSave()" v-show="isuper||!isadmin">导入家庭</button> 
						    </div>
							<div class="ui mini action input">    
								<button class="btn btn-danger" @click="editContact"
								v-show="select.acl.indexOf('中心运营总监')!=-1||isuper">短信通知设置</button>           
							</div>
							<div class="ui mini action input">
						    	<a :href="url_export" target="_blank" class="btn btn-danger" v-show="isadmin">导出Excel</a> 
							</div>
							<div class="ui mini action input">
								<button class="btn btn-danger" @click="getSignlist"
								v-show="isuper">Check</button>                
							</div>
					</div>
				</div>	
			</div>
			<div class="ui segment">
				<div class="ui form">
					<div class="inline fields" v-if="summerType!='coupon'&&campaigns_cur&&campaigns_cur.indexOf('集训营')!=-1">
						<label>筛选条件：</label>
						<div class="field">
							<div class="ui checkbox">
								<input id="isrecd" type="checkbox" v-model="isrecd">
								<label for="isrecd" >仅显示朋友推荐的</label>
							</div>
						</div>
					</div>
					<div class="inline fields" v-if="summerType!='coupon'&&campaigns_cur">
						<label>筛选条件:</label>
						<div class="field" v-for="s in arr_status">
							<div class="ui checkbox"  v-if="s=='已首次联系'">
								<tooltip effect="scale" placement="bottom" :content="tips.handling">
								<input :id="s" type="checkbox" :value="s" v-model="arr_status_cur">
								<label :for="s">{{s}}</label>
								</tooltip>
							</div>
							<div class="ui checkbox"  v-else>
								<input :id="s" type="checkbox" :value="s" v-model="arr_status_cur">
								<label :for="s">{{s}}</label>
							</div>
						</div>
						<div class="field">
							<div class="ui checkbox">
								<input id="all_status" type="checkbox" value="30" v-model="all_status">
								<label for="all_status">全选</label>
							</div>
						</div>
					</div>
					<div class="inline fields" v-if="summerType!='coupon'&&campaigns_cur">
						<label>筛选条件:</label>
						<div class="field">
							<div class="ui checkbox">
								<input id="recent" type="checkbox" value="30" v-model="recent">
								<label for="recent">仅显示最近30天</label>
							</div>
						</div>
						<div class="field">
							<div class="ui checkbox">
								<input id="timelimit" type="checkbox" value="4" v-model="timelimit">
								<label for="timelimit">超过4小时未处理</label>
							</div>
						</div>
						<div class="field">
							<div class="ui checkbox">
								<input id="history" type="checkbox"  v-model="history">
								<label for="history">是否显示参加过的历史活动</label>
							</div>
						</div>
						<div class="field">
							<div class="ui checkbox">
								<input id="first" type="checkbox"  v-model="first">
								<label for="first">是否仅显示首次参加活动记录</label>
							</div>
						</div>
						<div class="field" v-for="s in arr_member">
							<div class="ui checkbox">
								<input :id="s" type="checkbox" :value="s" v-model="arr_member_cur">
								<label :for="s">{{s}}</label>
							</div>
						</div>
					</div>
					<div class="inline fields" v-if="select.acl.indexOf('系统管理员')!=-1">
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
			
			<tlg-table :select="select" :checkbox="tchecked" amtable :maxheight="tbl_maxheight" :tb_style="tb_style"  :header="theader" :pagenation=pagenation :loading="select.start"></tlg-table>
		
			<modal :show.sync="dialogAdv.show" effect="fade" :width="280" small>
				<span slot="title">
					{{dialogAdv.title}}
				</span>
				<div slot="modal-body" class="modal-body">
					<template v-for="(index,c) of dialogAdv.conditions" >
					  <form-group>
						<mz-datepicker  :start-time.sync="c.value[0]" :end-time.sync="c.value[1]" range confirm ch :placeholder="c.label" clearable v-if="c.type=='daterange'" :on-Confirm="clearTime"></mz-datepicker>
						<bs-input maxlength=11 track-by="$index" style="width:87%" :placeholder="c.label" :value.sync="c.value" v-else></bs-input>
					  </form-group>
					</template>	
				</div>
				<div slot="modal-footer" class="modal-footer">
					<button type="button" class="btn btn-success" @click="goSearch(true)">搜索</button>
					<button type="button" class="btn btn-default" @click="dialogAdv.show = false">取消</button>
				</div>
			</modal>

			<modal :show.sync="contactModal.show" effect="fade" :width="380">
				<div slot="modal-header" class="modal-header">
					<h4 class="modal-title">
					<b>{{contactModal.title}}</b> 
					</h4>
				</div>
				<div slot="modal-body" class="modal-body">
					<bs-input maxlength=11 track-by="$index"  v-for="(index,phone) of contactModal.phones" :value.sync="phone" :placeholder="'手机号'+(index+1)" :pattern="contactModal.phone_reg" icon></bs-input>
				</div>
				<div slot="modal-footer" class="modal-footer">
					<button type="button" class="btn btn-success" @click="saveCon">保存</button>
					<button type="button" class="btn btn-default" @click="contactModal.show = false">取消</button>
				</div>
			</modal>
			<modal :show.sync="checkModal.show" effect="fade" :width="400">
				<div slot="modal-header" class="modal-header">
					<h4 class="modal-title">
					<b>{{checkModal.title}}</b> 
					</h4>
				</div>
				<div slot="modal-body" class="modal-body">
				    <p v-text="checkModal.content"></p>
				</div>
				<div slot="modal-footer" class="modal-footer">
					<button type="button" class="btn btn-success" @click="goSave(1)">确定</button>
					<button type="button" class="btn btn-default" @click="goCancel()">放弃</button>
				</div>
			</modal>

			<modal :show.sync="warnModal.show" effect="fade" small>
				<div slot="modal-header" class="modal-header">
					<h4 class="modal-title">
					<b>{{warnModal.title}}</b> 
					</h4>
				</div>
				<div slot="modal-body" class="modal-body">
				    <p v-text="warnModal.content"></p>
				</div>
				<div slot="modal-footer" class="modal-footer">
					<button type="button" class="btn btn-success" @click="editContact">确定</button>
					<button type="button" class="btn btn-danger" @click="warnModal.show=false;">放弃</button>
				</div>
			</modal>
			<alert :show.sync="alertError.show" placement="top" duration="8000" type="danger" width="400px" dismissable>
					<span class="glyphicon glyphicon-info-sign"></span>
					<strong>{{alertError.title}}</strong>
					<p style="padding-left:8%" v-html="alertError.msg"></p>
			</alert>
			<alert :show.sync="alertInfo.show" placement="top" duration="0" type="success" width="400px" dismissable>
					<span class="ion-information-circled alert-icon-float-left"></span>
					<strong>{{alertInfo.title}}</strong>
					<p v-html="alertInfo.msg"></p>
			</alert>
	</div>
</template>
<style scope>
	.box{
		border:1px dashed #000;
	}
	.mz-datepicker input {
		border-radius: 6%;
		margin-bottom: 6%;
		
	}
	.ui.form .inline.fields .field{
		padding:0!important;
	}
</style>


<script>
import vSelect from '@/src/Select.vue';
import alert from '@/src/Alert.vue';
import modal from '@/src/Modal.vue';
import bsInput from '@/src/Input.vue';
import tlgTable from '@/src/Table.vue';
import tooltip from '@/src/Tooltip.vue';
import dropdown from '@/src/Dropdown.vue';
import mzDatepicker from 'src/Daterange.vue';
import formGroup from 'src/formGroup.vue';
import qs from 'qs';
import  { iSelect, iOption, OptionGroup } from 'src/select/index.js';
 

//channel
var qstr = "select * into #c from(select crmzdy_87673590 能力,crmzdy_87673587 性格,crmzdy_87673584 距离,crmzdy_87673581 早教,camp.crmzdy_87687498 deposit,camp.id idcamp,isnull(nullif(camp.crmzdy_87673593,''),'无') quality,camp.crmzdy_82053647 gym,camp.crm_name phone,isnull(nullif(crmzdy_82053557,''),'未处理') status,isnull(dateadd(s,crmzdy_82053430+8*3600,'1970-01-01 00:00:00'),convert(varchar(20),create_time,120))dtenrol,crmzdy_82051555 centerid,replace(crmzdy_82053258,'官网预约体验','官网')campaign,crmzdy_82051555 sign_centerid,crmzdy_82051554 babyage,isnull(crmzdy_82051553,'') babyname,case when left(crmzdy_82051554,1)<>'0' and (charindex('-',crmzdy_82051554)>0 or charindex('/',crmzdy_82051554)>0) then crmzdy_82051554 when ISNUMERIC(crmzdy_82051554)=1 and len(crmzdy_82051554)<3 and crmzdy_82051554>'0' and crmzdy_82051554<'40' then dateadd(year,0-cast(crmzdy_82051554 as float),getdate()) else '' end birth,crmzdy_82053558 remark from crm_zdytable_238592_27045_238592_view camp where id in(@ids) and isnull(crmzdy_82058177,'')='')c ;"
qstr +="insert into crm_zdytable_238592_25112_238592(org_id,cust_id,crm_syrID,create_time,crmzdy_81756602_id,crm_name,crmzdy_81755633,crmzdy_81755550,crmzdy_81755551)select distinct 238592,279833,279833,getdate(),59 type,'总部活动-'+#c.campaign,#c.campaign,1,1  from #c left join crm_zdytable_238592_25112_238592_view channel on #c.campaign=channel.crmzdy_81755633 where channel.crm_name is null;"
qstr += "select #c.*,isnull((select top 1 id from crm_zdytable_238592_25112_238592_view channel where #c.campaign=channel.crmzdy_81755633 and crmzdy_81756602_id=59),0)idchannel into #cc from #c;"
//jt
qstr += "DECLARE @gt table(cust_id bigint,crm_syrID bigint,idzx bigint,idjt bigint,memo nvarchar(4000),memo2 nvarchar(4000),gymcode varchar(20),idcampaign varchar(100));"
qstr += "insert into crm_sj_238592(crm_name,org_id,cust_id,crm_syrID,crmzdy_81535047_id,crmzdy_81535045_id/*ls*/,create_time,crm_surname,crmzdy_81988104/*hz*/,crmzdy_81988100/*birth*/,crmzdy_80620120/*phone*/,crmzdy_80620075/*gymName*/,crmzdy_80620075_id/*idgym*/,crmzdy_82021212/*code*/,crmzdy_81486365/*prov*/,crmzdy_81486367/*city*/,crmzdy_80652377/*relation*/,crmzdy_81497202/*quality*/,crmzdy_80620126/*memo*/,crmzdy_81620165/*zxdt*/,crmzdy_81755583_id,crmzdy_81535090_id)"
qstr += "select '',238592,@iduser,gym.crm_syrID,@iduser,@iduser,getdate(),babyname+'家长',babyname,birth,phone,gym.crm_name,gym.id,gym.crmzdy_80620116,crmzdy_81744958,crmzdy_81744959,'无',quality,remark,getdate(),idchannel,idchannel from #cc join crm_zdytable_238592_23594_238592_view gym on gym.crmzdy_80620116=#cc.centerid left join crm_sj_238592_view jt on jt.crmzdy_80620120=#cc.phone"
qstr += " left join crm_sj_238592_view jt2 on jt2.crm_tel=#cc.phone where jt.crm_surname is null and jt2.crm_surname is null ;";
//zx
qstr += "select * into #tmp from(select *,row_number() over(partition by idjt order by idzx desc)xh from(select 238592 org_id,279833 cust_id,gym.crm_syrid,getdate() create_time,gym.crm_name+'-'+cast(jt.id as varchar) name,remark 备注,'|'+convert(varchar(10),getdate(),120)+',系统管理员:'+remark remark2,gym.id 中心,279833 负责老师,279833 接待老师,getdate() 咨询日期,#cc.*,jt.id idjt,isnull(zx.id,0) idzx,case when zx.id is null then '新用户' when isnull(crmzdy_81802303,'')<>'' then '历史会员' else '历史非会员' end member_status from #cc join crm_sj_238592_view jt on jt.crmzdy_80620120=#cc.phone join crm_zdytable_238592_23594_238592_view gym on gym.crmzdy_80620116=#cc.centerid left join crm_zdytable_238592_25111_238592_view zx on zx.crmzdy_81611091_id=jt.id and gym.id=zx.crmzdy_81620171_id union all select 238592,279833,gym.crm_syrid,getdate(),gym.crm_name+'-'+cast(jt.id as varchar),remark 备注,'|'+convert(varchar(10),getdate(),120)+',系统管理员:'+remark,gym.id 中心,279833 负责老师,279833 接待老师,getdate() 咨询日期,#cc.*,jt.id idjt,isnull(zx.id,0) idzx,case when zx.id is null then '新用户' when isnull(crmzdy_81802303,'')<>'' then '历史会员' else '历史非会员' end member_status from #cc join crm_sj_238592_view jt on jt.crm_tel=#cc.phone  join crm_zdytable_238592_23594_238592_view gym on gym.crmzdy_80620116=#cc.centerid left join crm_zdytable_238592_25111_238592_view zx on zx.crmzdy_81611091_id=jt.id and gym.id=zx.crmzdy_81620171_id)a)a where xh=1;"; 
qstr += "insert into crm_zdytable_238592_25111_238592(org_id,cust_id,crm_syrid,create_time,crm_name,crmzdy_81741656 /*备注*/,crmzdy_81802275 /*gthz*/,crmzdy_81620171_id /*中心*/,crmzdy_81636452_id /*负责老师*/,crmzdy_81620164_id /*接待老师*/,crmzdy_81620163 /*咨询日期*/,crmzdy_81636187 /*质量评估*/,crmzdy_81769392 /*中心编号*/,crmzdy_81620162_id/*中心获得家长信息的渠道*/,crmzdy_81755584_id  /*家长是从哪里了解到小小运动馆的*/,crmzdy_81611091_id /*家庭*/,crmzdy_81757915 /*家庭id*/,crmzdy_87673451/*id_campaign*/,crmzdy_87677161/*家长需求*/,crmzdy_87676839/*孩子性格*/,crmzdy_87676845/*距离*/,crmzdy_87676842/*早教课程*/,crmzdy_81754947/*isshow*/,crmzdy_81754948/*dtshow*/,crmzdy_81754949/*show_cmmt*/)";
qstr += "output inserted.cust_id ,inserted.crm_syrid,inserted.id,inserted.crmzdy_81611091_id,inserted.crmzdy_81741656,inserted.crmzdy_81802275,inserted.crmzdy_81769392,inserted.crmzdy_87673451  into @gt ";
qstr += "select org_id,cust_id,crm_syrid,create_time,name,备注,remark2,中心,负责老师,接待老师,咨询日期,quality,centerid,idchannel,idchannel,idjt,idjt,idcamp,能力,性格,距离,早教,'是',convert(varchar(10),case when convert(varchar(10),GETDATE(),108)>'18:00:00' then getdate()+2 else getdate()+1 end,120),case when #tmp.campaign='官网' then '官网预约体验' else #tmp.campaign end from #tmp where idzx=0;";
 //gt
qstr +="insert into crm_zdytable_238592_25121_238592(crm_name,crmzdy_81762823/*type*/,org_id,cust_id,crm_syrID,create_time,crmzdy_81748926_id/*idZx*/,crmzdy_81748934/*内容*/,crmzdy_81803726/*content2*/,crmzdy_81762900/*gymcode*/)"
qstr +="select upper('JTGTJL-')+cast(idzx as varchar)+'-'+convert(varchar(8),getdate(),112)+'B','潜在会员沟通',238592,cust_id,crm_syrid,getdate(),idzx,memo,memo2,gymcode from @gt where len(memo)>0;"
//hz
qstr +="insert into crm_zdytable_238592_23893_238592(crm_name,org_id,cust_id,crm_syrid,create_time,crmzdy_81783222/*idjt*/,crmzdy_80653840_id/*idjt*/,crmzdy_80653845/*babybrithday*/)select babyname,238592,@iduser,@iduser,getdate(),jt.id,jt.id,birth from #cc  join crm_sj_238592_view jt on jt.crmzdy_80620120=#cc.phone left join crm_zdytable_238592_23893_238592_view hz on hz.crmzdy_80653840_id=jt.id and hz.crm_name=babyname where hz.crm_name is null;"

//初始化中心搜索和综合搜索
qstr +="update jt set crmzdy_81802271/*hz*/=(select crm_name+',' from crm_zdytable_238592_23893_238592_view hz where hz.crmzdy_80653840_id=jt.id for xml path('')),crmzdy_81843299/*hz+age*/=(select crm_name+' '+crmzdy_81497217+',' from crm_zdytable_238592_23893_238592_view hz where hz.crmzdy_80653840_id=jt.id for xml path('')),crmzdy_82021205/*hz+birth*/=(select crm_name+' '+ convert(varchar(10),crmzdy_80653845,120)+',' from crm_zdytable_238592_23893_238592_view hz where hz.crmzdy_80653840_id=jt.id for xml path('')) from crm_sj_238592_view jt join #tmp on jt.id=#tmp.idjt;";
qstr +="update jt set crmzdy_81767199/*search*/=/*家长姓名*/isnull(crm_surname,'')+','+/*手机*/isnull(crmzdy_80620120,'')+/*hz*/isnull(crmzdy_80610668,''),crmzdy_81778300/*中心*/=(select crmzdy_81620171+',' from crm_zdytable_238592_25111_238592_view zx where zx.crmzdy_81611091_id=jt.id for xml path('')) from crm_sj_238592_view jt join #tmp on jt.id=#tmp.idjt;";
//update idjt for campaign
qstr +="update camp set crmzdy_87686127=case when isnull(crmzdy_87686127,'')='' then #tmp.member_status else crmzdy_87686127 end,crmzdy_82058177 =#tmp.idjt,crmzdy_82053557=case when isnull(crmzdy_82053557,'未处理')='未处理' then '已首次首次联系' else crmzdy_82053557 end from crm_zdytable_238592_27045_238592_view camp join #tmp on #tmp.idcamp=camp.id;"
//订金
qstr +="insert into crm_zdytable_238592_24958_238592(org_id,cust_id,crm_syrID,create_time,crmzdy_81748682/*dtdj*/,crmzdy_81748744_id/*idzx*/,crmzdy_81363560_id/*idjt*/,crmzdy_81759415_ID/*way*/,crmzdy_81366329/*money*/,crmzdy_81756964/*usage*/,crmzdy_81363562/*day*/,crmzdy_81756603/*dtExpire*/,crm_name,crmzdy_81762292/*isUsed*/)select distinct 238592,x.cust_id,x.crm_syrid,getdate(),getdate(),x.idzx,x.idjt,11,t.deposit,t.campaign,30,dateadd( day,30,getdate()) ,convert(varchar(10),getdate(),120)+',订金'+cast(t.deposit as varchar)+'元',0 from @gt x join #tmp t on x.idjt=t.idjt and t.deposit>0 and x.idzx>0;"
//result info
qstr +="select top 1 0 errcode,'ok' errmsg,'@sql' sql from crm_yh_238592_view for json auto,without_array_wrapper;"

export default {
  props: {
    select: {
       type:Object
    }
  },
  components:{
	vSelect,
	alert,
	modal,
	bsInput,
	tlgTable,
	dropdown,
	mzDatepicker,
	formGroup,
	tooltip,
	iSelect,
	iOption, 
	OptionGroup 
  },
  data(){
    return{
		  tbl_maxheight:"600px",	 
		  arr_member:['新用户','历史非会员','活跃会员','历史会员','所有用户'],
		  arr_member_cur:['新用户'],
		  arr_status:["未处理","已首次联系","预约体验","体验出勤","付费报名夏令营","扣课报名夏令营","成功报名正式课程","家长决定不报名"],
		  arr_status_cur:["未处理","已首次联系","预约体验","体验出勤","付费报名夏令营","扣课报名夏令营","成功报名正式课程","家长决定不报名"],
		  all_status:true,
          summerType:'preEnrol',
		  typeGroup:[{val:'preEnrol',label:'预报名信息'},{val:'coupon',label:'H5礼券名单'},{val:'coupon2',label:'小程序礼券名单'}],
		  isrecd:false,
          search:"",
		  pagenation:{
            pageSize :10,
			pageNow:1,
			order:""
		  },
		  tips:{handling:"（含首次联系家长未接通、或号码不正确）"},
          alertError:{show:false,title:'错误提示',msg:''},
    	  alertInfo:{show:false,title:'操作提示',msg:'导入成功'},
		  contactModal:{show:false,title:'手机联系人',phones:['',''],valid:true,phone_reg:/^1[3|4|5|6|7|8|9][0-9]\d{8}$/},
		  checkModal:{show:false,title:'操作提示',content:'请先查询并选择下面要导入的名单（打勾）,再点击导入按钮'},
		  warnModal:{show:false,title:'手机联系人设置提醒',content:'中心尚未《设置短信通知提醒》的手机联系人！请尽快进行设置！以免影响市场例子的及时跟进！'},
          check: {},
		  lack:[],
		  sql_cur:sql_preEnrol,
		  getQuery:this.getEnrol,
		  theader:[],
		  tb_style:{
			  th:{padding: ".22857143em .498571429em",fontSize:"14px"},
			  td:{padding: ".28571429em",fontSize:"12px"}
		  },
		  adv:false,
		  dialogAdv:{
			show:false,
			title:"高级筛选",
			conditions:[{label:"报名日期(选填)",type:'daterange',item:'dtenrol',value:[]},
			    {label:"签单日期(选填)",type:'daterange',item:'dtsign',value:[]},
		    	{label:"姓名(选填)",type:'string',item:"babyname",value:undefined},
			    {label:"手机(选填)",type:'string',item:"phone",value:undefined}
			]
		  },
		  tchecked:{
			  show:false,
			  ids:[],
			  checkall:false
		  },
		  history:false,
		  first:false,
		  timelimit:[],
		  recent:['30'],
		  url_coupon:""
	}
  },
  computed:{
	    gymcode_cur:function(){
			if(typeof this.select.gym_selected=='string'){
               return this.select.gym_selected||'';
			}else{
			   return this.select.gym_selected.slice(-1)||'';	
			}
		},
		isadmin:function(){
			if(this.select.acl.indexOf('系统管理员')!=-1
			||this.select.acl.indexOf('市场顾问')!=-1
			||this.select.acl.indexOf('运营顾问')!=-1
			||this.select.acl.indexOf('市场专员')!=-1){
				return true;
			}
			return false;
		},
		isuper(){
            return this.select.acl.indexOf('系统管理员')!=-1;
		},
	    options:function(){
          return {pageSize:this.pagenation.pageSize,pageNow:this.pagenation.pageNow,order:this.pagenation.order,condition:this.condition} 
		}, 
		theader_pre: function(){
		    return [
		       //{lable:['name','fn_show','fn_label_handle'],value:['default','fn_value_handle','key_override']}
			   {label:['操作'],value:['',this.urlEdit,'row']},
			   {label:['明细',this.select.acl.indexOf("系统管理员")!=-1],value:['',this.urlDetail,'row']},
			   {label:['家长手机'],value:['',this.urlView,'row']},
			   {label:['孩子姓名|l','',this.decorate],value:['','','babyname'],order:-1},
			   {label:['孩子年龄',this.field_show,this.ageLabel],value:['','age','babyage']},
			   {label:['会员名称',this.field_show],value:['','','membername']},
			   {label:['会员等级',this.field_show],value:['','','level'],order:-1},
			   {label:['会员有效期',this.field_show],value:['','dt','dtlevelexpire']},
			   {label:['报名中心|l'],value:['',this.gymName,'sign_centerid'],order:-1},
			   {label:['报名日期'],value:['','dt','dtenrol'],order:2},
			   {label:['预约上课时间',this.field_show],value:['','','dtclass']},
			   {label:['物料编号',this.isadmin && this.field_show],value:['','','m_code']},
			   {label:['来自朋友推荐',this.field_show],value:['','','isrecd']},
			   {label:['是否上过早教',this.field_show],value:['','','zaojiao'],order:-1},
			   {label:['距离',this.field_show],value:['','','juli'],order:-1},
			   {label:['性格',this.field_show],value:['','','xingge'],order:-1},
			   {label:['能力',this.field_show],value:['','','nengli'],order:-1},
			   {label:['质量评估',this.field_show],value:['','','quality'],order:-1},
			   {label:['处理状态'],value:['',this.tip,'status'],order:-1,class:{"text-danger":"'val'=='未处理'"}},
			   {label:['参加过的活动'],value:['','','campaign']},
			   {label:['备注',this.field_show],value:['','','remark']},
			   {label:['订金',this.field_show],value:['','',"deposit"]},
			   {label:['来源渠道|l',this.show_on_campaign('channel')],value:['','','channel'],order:-1},
			   {label:['签约金额'],value:['','','amt']},
			   {label:['签约日期'],value:['','','dtsign']},
			   {label:['最近体验'],value:['','','tys']},
			   {label:['初始会员状态'],value:['','','member_status']}
		     ]
		},
		theader_coupon: function(){
		    return [
               {label:['中心'],value:['',this.gymName,'centerid']},
			   {label:['姓名'],value:['','','user_name']},
			   {label:['手机'],value:['',this.urlView,'row']},
			   {label:['礼券名称'],value:['','','coupon_name'],order:-1},
			   {label:['使用截止日期'],value:['','','end_date'],order:1},
			   {label:['使用状态'],value:['','','status'],order:-1},
			   {label:['是否会员'],value:['','','type'],order:-1}
		     ]
		},
		condition:function(){
			var c=[];
			if(this.summerType=="preEnrol"){
			  if(!this.adv) this.search.trim()&&c.push("phone+babyname like '%"+this.search.trim()+"%'");
			  this.isrecd&&c.push("isrecd ='是'");
			  this.arr_member_cur.indexOf('所有用户')==-1&&c.push(`member_status in ('${this.arr_member_cur.join("','")}')`);
			  !this.all_status&&c.push("status in ('"+this.arr_status_cur.join("','")+"')")
			}else{
				this.search.trim()&&c.push("phone+user_name like '%"+this.search.trim()+"%'");
			}
			if(this.adv){
				this.dialogAdv.conditions.forEach(function(cn){
					if(!cn.value)return;
					if(typeof cn.value=="object"&&!(cn.value[0]&&cn.value[1]))return;
					if(cn.type=="daterange"){
						c.push(cn.item+" between '"+cn.value[0]+"' and '"+cn.value[1]+" 23:59:59'")
					}
					if(cn.type=="string"){
						c.push(cn.item+" like '"+cn.value+"%'")
					}
				})
			    this.adv=false;
			}
			c=c.join(" and ");
			//console.error(c);
		    return c;  
		},
		sqlBase:function(){
			var id =this.select.gym_selected;
			var sql=this.sql_cur;
			if(id.indexOf("all")!=-1){
				sql= sql.replace(/@gymWhere/gi,"")
			}else if(typeof id=='object'){
		     	sql= sql.replace(/@gymWhere/gi,"and crmzdy_82051555 in ("+id.join(",")+")");
			}else{
				sql= sql.replace(/@gymWhere/gi,'and crmzdy_82051555='+id)
			}
			if(!this.campaigns_cur||this.campaigns_cur.length==0){
				sql= sql.replace('@campaignWhere',"isnull(crmzdy_82053258,'')<>''");
			}else if(typeof this.campaigns_cur=='object'){
				sql= sql.replace('@campaignWhere',"crmzdy_82053258 in ('"+this.campaigns_cur.join("','")+"')");
			}else{
				sql= sql.replace('@campaignWhere',"crmzdy_82053258='"+this.campaigns_cur+"'");
			}
			if(this.recent&&this.recent[0]>0){
				sql= sql.replace('@recentWhere',"and create_time>=dateadd(d,-@recent,getdate())".replace("@recent",this.recent[0]));
			}else{
				sql= sql.replace('@recentWhere',"")
			}
			if(this.timelimit&&this.timelimit[0]>0){
				sql= sql.replace('@timelimitWhere',"and create_time<dateadd(hh,-@timelimit,getdate())".replace("@timelimit",this.timelimit[0]));
			}else{
				sql= sql.replace('@timelimitWhere',"")
			}
			if(this.history){
				sql= sql.replace("@campaign","replace((select name+',' from(select top 100 crmzdy_82053258 name,max(c.id) id from crm_zdytable_238592_27045_238592_view c where c.crm_name=camp.crm_name group by crmzdy_82053258 order by max(c.id))a for xml path('')),crmzdy_82053258,'<b>'+crmzdy_82053258+'</b>')");
			}else{
                sql= sql.replace("@campaign","crmzdy_82053258");
			}
			return sql;
		},
		sqlBuilder:function () {
			if(this.first){
				this.options.sql_handle="select * from(select row_number()over(partition by phone order by dtenrol)xh,a.* from (@main)a)a where xh=1";
			}
			var sql=this.fn_pager_amt(this.sqlBase,this.options) 
			sql = this.convertor.ToUnicode(sql);
			return sql; 
		},
        url_export:function(){
              var url="https://bbk.800app.com/uploadfile/staticresource/238592/279833/dataInterface_excel.aspx"
			  var sql="with p as("+this.sqlBase+")select uniqueid,gym 中心,phone 手机号,babyname 孩子姓名,babyage 孩子年龄,status 处理状态,dtenrol 活动报名日期,campaign 活动名称,amt 签约合同金额,dtsign 签约日期 from p";
			  if(this.condition){
				   sql=sql+" where "+this.condition;
			  }
			  sql = sql+" order by 活动报名日期 desc"
			  sql = this.convertor.ToUnicode(sql);
              var filename = this.convertor.ToUnicode(this.campaigns_cur[0]||'所有'+"等活动_"+(new Date()).valueOf());
			  url = url+'?sql='+sql+'&filename='+filename;
			  return url
		}
  },
  filters:{

  },
  methods:{
	  	clearTime:function(){
          this.recent=[];
		},
	    goSearch:function(adv){ 
			this.adv=adv||false;
			this.dialogAdv.show=false;
			this.init();
	    },
	    goSave:function(type){
           if(type==1){
			  this.checkModal.show=false; 
              this.tchecked.show=true;
		   }else{
			  if(this.tchecked.ids&&this.tchecked.ids.length>0){
			     this.save();
			  }else{
				 this.checkModal.show=true; 
			  }
		   }
		},
		goCancel:function(){
		   this.tchecked.show=false;
		   this.checkModal.show=false; 
		},
		show_on_campaign(field){
		   var res=false;
		   if(field=='channel'){
				if(this.select.campaign_selected=="官网预约体验")res=true;
				if(this.select.campaign_selected.indexOf("倒立")!=-1)res=true;
				if(this.select.campaign_selected=="")res=true;
		   }
		   return res;
		},
		save:function(){
		    var sql=qstr;
			sql=sql.replace(/@ids/g,this.tchecked.ids.join(","));
			sql=this.convertor.ToUnicode(sql)
			var self=this;
            self.select.start=true;
			self.$axios({
				method:'post',
				url: url_local,
				data: qs.stringify({sql1:sql,onlysql:(self.select.onlysql?1:0)})
			}).then(function(res){ 
				if(res.status==200&&res.data.errcode==0){
					self.alertInfo.show=true;
					self.init();
				}else{
					self.alertError={title:"错误提示",msg:"导入失败："+res.data.errmsg,show:true}
				}
				self.select.data=res.data;
				self.select.sql=res.sql;
				self.select.start=false;
				self.tchecked.ids=[];
				self.tchecked.checkall=false;
            },function(res){
				self.select.start=false;
				self.tchecked.ids=[];
				self.tchecked.checkall=false;
			});
		  
		},
	    ageLabel:function(field){
			if( this.select.campaign_selected.indexOf("官网预约体验")!=-1) return '孩子生日';
			 return field;
		},	  
	    decorate:function(field){
			  var arr=['婴芭莎展会'];
			  if(arr.indexOf(this.select.campaign_selected)!=-1)return '家长姓名';
			  return field;
		},
        urlEdit:function(row){
            var u= "<a class='btn btn-default btn-sm' href='https://bbk.800app.com/index.jsp?mfs=crm_zdytable_238592_27045&mid=@id&menu=1109&gym=@gym' target='_blank'>修改</a>";
            return u.replace('@id',row.id)&&u.replace('@id',row.id).replace('@gym',this.convertor.ToUnicode(this.select.gymNames[row.sign_centerid]||row.gym))||'';
		},
        urlDetail:function(row){
            var u= "<a class='btn btn-default btn-sm' href='https://bbk.800app.com/index.jsp?mlist=1&mfs1=crm_zdytable_238592_27045&mid=@id&menu=1109' target='_blank'>查看</a>";
            return u.replace('@id',row.id)&&u.replace('@id',row.id).replace('@gym',this.convertor.ToUnicode(this.select.gymNames[row.sign_centerid]||row.gym))||'';
		},
        tip:function(val){
			if(val=='已首次联系'){
				val ='<span class="tooltips" title="'+this.tips.handling+'">已首次联系</span>';
				return val;
			}
			return val;
        },
	    field_show:function(item){
		  if(this.campaigns_cur&&(this.campaigns_cur.length>1||this.campaigns_cur.length==0))return false;
		  //年龄隐藏
		  var arr=['婴芭莎展会','开学季','圣诞节'];
		  var val = this.campaigns_cur[0];
		  if (item=='babyage' && arr.find(function(i){
				if(val.indexOf(i)!=-1) return true;
			})) return false;
		  //备注显示
		  var arr=['婴芭莎展会线下'];
		  if (item=='remark' && !arr.find(function(i){
				if(val.indexOf(i)!=-1) return true;
			})) return false;
		  //地推字段显示
		  var arr=['预约试听','开业地推'];
		  var fields=['juli','nengli','xingge','zaojiao','quality'];
		  if (fields.indexOf(item)!=-1 && !arr.find(function(i){
				if(val.indexOf(i)!=-1) return true;
			})) return false;

 
		  var arr=['复星集团（北京）','小飞侠障碍越野'];
		  var fields=['dtclass'];
		  if (fields.indexOf(item)!=-1 && !arr.find(function(i){
				if(val.indexOf(i)!=-1) return true;
			})) return false;


		  //预售卡活动
		  var arr=['预售'];
		  var fields=['deposit'];
		  if (fields.indexOf(item)!=-1 && !arr.find(function(i){
				if(val.indexOf(i)!=-1) return true;
			})) return false;

		  //会员相关信息
		  var arr=['youle','有叻联盟'];
		  var fields=['membername','dtlevelexpire','level'];
		  if (fields.indexOf(item)!=-1 && !arr.find(function(i){
				if(val.indexOf(i)!=-1) return true;
			})) return false;
			
		  //小小奥运
		  var arr=['奥运','集训营'];
		  var fields=['m_code','isrecd'];
		  if(fields.indexOf(item)!=-1 && !arr.find(function(i){
				if(val.indexOf(i)!=-1) return true;
		  })) return false
		  return true;
		},
        getSignlist:function(){
            var self=this;
            self.$http.jsonp(url_signlist,{
            },{
                jsonp:'callback'
            }).then(function(res){
                var res_data = res.data;
                if(!res_data.code){ 
                    arr_uniqueid=res_data.uniqueid.split(",");
                    arr_uniqueid.map(function(u){
                        if(!self.check[u]){
                            self.check[u]=0;
                        }
                        self.check[u]+=1;
                    })
                    self.lack=[];
                    for(var key in self.check){
                        if(self.check[key]==1){
                            self.lack.push(key)
                        }
                    }
					this.checkResult(res_data.count)
                }
                self.select.start=false;
                
            },function(res){
                self.select.start=false;
                console.error(res.status);
            });
		},
		validate:function(showErr=true){
		    if(!this.select.campaign_selected) {
              if(showErr){
			     this.alertError={title:"错误提示",msg:"活动名称不能为空",show:true}
			  }
			  return false;
			}
		    if(!this.select.gym_selected) {
              if(showErr){
			     this.alertError={title:"错误提示",msg:"中心名称能不为空",show:true}
			  }
			  return false;
			}
		    return true;
		},
        checkResult:function(count_actual){
            if(this.lack.length>0){
                this.alertError.title="接口数据核对结果";
                this.alertError.msg="接口总记录数:"+count_actual+",oasis总记录数:"+this.select.data.total+";缺少数据ID:"+this.lack.join(",");
                this.alertError.show=true;
            }else{
                this.alertInfo.title="接口数据核对结果";
                this.alertInfo.msg="接口总记录数:"+count_actual+",oasis总记录数:"+this.select.data.total+"！核对成功，没有差异！";
                this.alertInfo.show=true;
            }
        },  
        editContact:function(){
			this.warnModal.show=false;
			if(!this.select.gym_selected){
				this.alertError.title="错误提示";
				this.alertError.msg="请先选择中心！";
				this.alertError.show=true;
				return;
			}
			if(!this.isadmin&&this.select.acl.indexOf('中心运营总监')==-1){
				this.alertError.title="错误提示";
				this.alertError.msg="没有权限！请使用GD帐号权限进行设置";
				this.alertError.show=true;
				return;
			}
			if(!this.contactModal.phones||this.contactModal.phones.length==0){
				this.readContact();
			}
			this.contactModal.title=(this.select.gym_selected&&this.select.gymNames[this.gymcode_cur]||'')+"手机联系人";
			this.contactModal.show = true;
	   },
	   readContact(check){
			var self=this;
			self.warnModal.show=false;
			if (self.select.gym_selected=="all"||!self.select.gym_selected) return;
			var sql_phones="select isnull((select top 1 crm_name phones from crm_zdytable_238592_27059_238592_view where crmzdy_82053884='@gymcode'),'') phones"
			sql_phones = sql_phones.replace("@gymcode",self.gymcode_cur);
			self.$http.jsonp(url_jsonp,{
				sql1: sql_phones
			},{
				jsonp:'callback'
			}).then(function(res){
				var res= res.data.info[0].rec;
				if(typeof res=='object'){
					res = res[0].phones.split("|");
					if(check&&(!res||res.length==0||res[0]=="")){
						self.warnModal.show=true;
					}
					self.contactModal.phones= new Array(res[0]||'',res[1]||'');
				}
			},function(res){
				console.log(res.status);
			});
	   },
	   saveCon:function(){
			var self=this;
			self.contactModal.valid=true
			var res=self.contactModal.phones.filter(function(p){
				if(p!="" && !self.contactModal.phone_reg.test(p)){
				self.contactModal.valid=false;
				}
				return p!='';
			});
			if(!this.contactModal.valid){
					this.alertError.title="错误提示";
					this.alertError.msg="手机号录入不正确！";
					this.alertError.show=true;
					return;
			} 
			if(res.join('').trim()==''){
					this.alertInfo.title="警告";
					this.alertInfo.msg="请至少录入一个手机号信息！";
					this.alertInfo.show=true;
					return;
			} 
			var sql_update_phones = "merge into crm_zdytable_238592_27059_238592_view t using (select '@phones' phones,'@gymcode' gymcode ) s on t.crmzdy_82053884=s.gymcode when matched then update set t.crm_name= s.phones";
			sql_update_phones += " when not matched by target then insert (org_id,cust_id,crm_syrID,create_time,crm_name,crmzdy_82053884/*gymcode*/) values (238592,279833,279833,getdate(),s.phones,s.gymcode);select 'ok' status;"; 
			sql_update_phones = sql_update_phones.replace('@phones',res.join('|')).replace('@gymcode',self.gymcode_cur);
			self.$http.jsonp(url_jsonp,{
				sql1: sql_update_phones
			},{
				jsonp:'callback'
			}).then(function(res){
				var res= res.data.info[0].rec;
				if(typeof res=='object'){
					this.alertInfo.title="提示";
					this.alertInfo.msg="操作成功";
					this.alertInfo.show=true;
				}else{
					this.alertError.title="提示";
					this.alertError.msg="保存失败";
					this.alertError.show=true;
				}
			},function(res){
				console.log(res.status);
			});
			this.contactModal.show = false;
	   },
       getCouponlist:function(){
		    if(!this.validate()) return;
			var self=this;
			self.select.start=true;
			var gym_selected=self.select.gym_selected;
			//console.error( self.select.gym_selected)
			if(typeof self.select.gym_selected!='string'){
				gym_selected=self.select.gym_selected[0];
			}
			self.$http.jsonp(this.url_coupon,{
                page: self.pagenation.pageNow,
                centerid: gym_selected,
				campain: self.select.campaign_selected[0],
				search: self.search&&self.search.trim(),
				pageSize:self.pagenation.pageSize
            },{
                jsonp:'callback'
            }).then(function(res){
				var tbl_coupon=sql_coupon;
				res = res.data;

			    if(res && res.total>0){
					var sql_data="";
					res.data.map(function(d){
					   sql_data +="select '";
	                   sql_data +=d.phone+"'phone,'"+d.centerid+"'centerid,'"+(d.user_name||"")+"'user_name,'";
					   sql_data +=d.coupon_name+"'coupon_name,'"+d.end_date+"'end_date,'"+d.status+"'status union all ";
					})
					var total=res.total;
					sql_data = sql_data.slice(0,-11);
					tbl_coupon = tbl_coupon.replace('@sql_data',sql_data);
					var options={pageSize:this.pagenation.pageSize,pageNow:1,order:this.pagenation.order,condition:this.condition} 
					//tbl_coupon = this.fn_pager(tbl_coupon,options);
					//console.error(tbl_coupon)
                    self.$http.post(
                         url_local,
                         {
                           sql1:this.convertor.ToUnicode(tbl_coupon),
						   onlysql:(self.select.onlysql?1:0)
                         },
                         {emulateJSON: true}
                       )
                       .then(function(res){
							if(res.status==200){
								self.select.data={total:total,arr:res.data&&res.data.arr};
								self.select.data.sql=res.data&&res.data.sql;
							}
							self.select.start=false;
                       })
                       .catch(function(res) {
						 console.error(res);
						 self.select.start=false;
					   });
                }else{
					this.select.start=false;
					this.select.data={total:0,arr:[]}
				}
            },function(res){
                self.select.start=false;
                console.log(res.status);
            });
        },
	    getEnrol:function(){
			if(!this.validate()) return;
			var self=this;
            self.select.start=true;
            self.$http.jsonp(url_local,{
                sql1: self.sqlBuilder,
                onlysql:(self.select.onlysql?1:0)
            },{
                jsonp:'callback'
            }).then(function(res){ 
				if(res.status==200){
					self.select.data=res.data;
				}
				self.select.start=false;
				//console.log(JSON.stringify(self.select.data))
                //fn_pager
            },function(res){
                self.select.start=false;
			});
		},
		init(){
			switch(this.summerType){
				case 'coupon':
					this.sql_cur=sql_coupon;
					this.url_coupon=url_coupon;
					this.theader=this.theader_coupon;
					this.getQuery= this.getCouponlist;
					break;
				case 'coupon2':
					this.sql_cur=sql_coupon;
					this.url_coupon=url_coupon2;
					this.theader=this.theader_coupon;
					this.getQuery= this.getCouponlist;
					break;
				default:
					this.sql_cur=sql_preEnrol;
					this.theader=this.theader_pre;
					this.getQuery= this.getEnrol;
					break;
			}
			this.select.data=null;
			var order="";
			var h=this.theader.find(function(h){
                return h.order&&h.order>-1;
			})
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
		}
  },
  watch: {
    summerType (newval) {
		this.init();
	},
    pagenation:{
		handler(newValue, oldValue) {
			//if(this.validate()){
			   this.getQuery();
			//}
　　　   },
　　　   deep: true
	},
	all_status:{
		handler(newValue, oldValue) {
			if(newValue){
				var self=this;
				this.arr_status.forEach(function(i){
                    self.arr_status_cur.push(i);
				})
			}else{
				this.arr_status_cur=[];
			}
　　　   },
　　　   deep: true
	},
	"timelimit":{
		handler(newValue, oldValue) {
			if(newValue&&newValue[0]>0){
				this.arr_status_cur=["未处理"];
				this.recent=[];
			}
　　　   },
　　　   deep: true
	},
	"select.gym_selected":{
		handler(newValue, oldValue) {
			if(this.isadmin&&!this.select.multi) this.select.multi=true;
			if(newValue){
				this.init();
			    if(!this.isadmin)this.readContact(1); //只有中心，才需要设置联系人
			}
　　　   },
　　　   deep: true
	},
	"select.campaign_selected":{
		handler(newValue, oldValue) {
			if(this.isadmin&&!this.select.multi) this.select.multi=true;
			if(this.select.campaign_selected&&this.select.gym_selected){
				this.init();
			}
　　　   },
　　　   deep: true
	}
  },
  created(){
      if(this.$route.params.id=='4'){
		  this.select.menuGroup[1].enabled=true;
	  }
	  if(this.$route.params&&this.$route.params.id==2){
		  this.timelimit=['4'];
	  }
	  this.select.campaign_selected=[];
  }
}
</script>
