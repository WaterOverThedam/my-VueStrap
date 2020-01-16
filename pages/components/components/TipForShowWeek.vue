<template>
    <div>

        <modal :show.sync="importance.show" effect="fade" width="78%">
            <div slot="title" class="modal-title">
                    <h2 style="text-align:center;color:#000077"><b>{{importance.title}}</b></h2>
            </div>
            <div slot="modal-body" class="modal-body">
                <div class="ui segment importance">
                   <p class="subsection">金鼠迎新春新年活动</p>
                   <p class="head"> 一、新年活动时间：2020-01-09至2020-02-08</p>
                   <p class="head">两个阶段：2020-01-09至2020-01-23（迎新年接红包）</p>
                   <p class="head" style="padding-left:70px">  2020-01-23至2020-02-08（迎新春接金鼠）</p>
                   <p class="item"><span class="head">中心输出材料部分 </span>（下载路径为“企业网盘＞运营总监资料＞市场＞全国市场活动资料＞2020年全国市场活动资料＞金鼠迎新春”）</p>
                   <br/>
                    <div class="ui medium images">
                        <img class="first" src="https://static.thelittlegym.com.cn/assert/img/oasis/origin/newYear/mouseYear_hb0.png">
                        <img src="https://static.thelittlegym.com.cn/assert/img/oasis/origin/newYear/mouseYear_hb1.png">
                    </div>
                    <br/>
                    <p class="head">二、活动流程：</p>
                    <p class="indent item">1)用户扫描二维码至“金鼠迎新春”活动H5页面</p>
                    <p class="indent item">2)了解活动规则后点击“开始游戏”进入活动页面；</p>
                    <p class="indent item">3)此游戏为接物类游戏，在60秒时间内，用户需拖动Tada去接这些元素，接到炸弹游戏结束；</p>
                    <p class="indent item">4)用户共1次游戏机会，分享给好友或朋友圈可再获得1次机会；</p>
                    <p class="indent item">5）游戏结束，根据当前现有成绩中个人最好成绩显示所获得课程抵扣券金额，用户完善个人信息，填写兑奖的中心，同时可以勾选领取体验课选项。</p>
                    <p class="indent item">6）用户需在活动结束后至所填写的中心进行核销领取奖励。</p>
                    <p class="indent item yellow">核销方式：</p>
                    <p class="indent item yellow">中心老师打开以下核销链接，输入核销码【76903582】进行扫码核销。</p>
                    <p class="indent item yellow">核销链接: http://camp.thelittlegym.com.cn/bindmanager/  </p>
                    <p class="indent item yellow">核销密码：76903582</p> 
                    <p class="head">三、奖品设置：</p>
                    <p class="indent item">2020-01-09至2020-01-23（迎新年接红包）</p>
                    <p class="indent item">（1）小小运动馆课程抵扣券（100元~200元不等）；</p>
                    <p class="indent item">（2）600元小小运动馆生日派对抵扣券；</p>
                    <p class="indent item">2020-01-23至2020-02-08（迎新春接金鼠）</p>
                    <p class="indent item">（1）小小运动馆课程抵扣券（50元~100元不等）；</p>
                    <p class="indent item">（2）600元小小运动馆生日派对抵扣券；</p>
                    <br/>
                    <p class="indent head">课程抵扣券有效期至2020年2月29日</p>
                    <p class="indent head">生日派对抵扣券有效期至2020年12月31日</p>
                </div>

                <!--showWeek <div class="ui segment importance">
                    <p class="subsection">2019冬季Showweek（2020.1.6-1.12）提醒：表演周+考级周</p>
                    <p class="head">
                       <a href="#" @click.prevent="toDetail" style="color:red">
                         <span>2019冬季Showweek（2020.1.6-1.12）宣讲话术等操作事项提醒&nbsp;&nbsp; </span>
                         <span class="glyphicon glyphicon-hand-left">点击进入</span>
                       </a>
                    </p>
                    <br/>
                    <p>一、表演：Showweek 证书由中心输出，填写相关信息，并由中心老师根据教案结束流程要求进行发放；</p>
                    <br/>
                    <img class="ui left aligned big image" src="https://static.thelittlegym.com.cn/assert/img/oasis/origin/showWeek/cert1.png">
                    <br/>
                    <p>二、考级：考级证书为电子证书版本，家长需要注册小小运动馆官微的会员中心，登陆后，获取电子版证书。家长可以保存电子考级图片，获得高质量清晰版电子证书，便于在朋友圈分享；如家长需纸质版本证书，家长可以在会员中心付费（10元/张）。（PS:家长在会员中心操作输出纸质证书后， 约3周左右分批快递到中心，由中心分发给家长会员！）</p>
                    <br/>
                    <img class="ui left aligned big image" src="https://static.thelittlegym.com.cn/assert/img/oasis/origin/showWeek/cert2.png">
                    <br/>
                    <p>1.本次考级整体简介参考：</p>
                    <p class="indent">Pre-JO考级包含自由操、平衡木、单杠三个单项。每次考级会根据全年课程重点设计不同的考试项目。本次冬季Show week推出平衡木技能考核</p>
                    <p class="indent">小小运动馆进行单项考级，对与小会员的好处：</p>
                    <p class="indent item">1）小小运动馆的单项考级，能够更针对性地提升孩子的能力（因为小会员有机会更加集中地进行练习，练习的方向也更有侧重点，帮助会员在一定时间里有效提升技能）;</p>
                    <p class="indent item">2）本次冬季Show week的平衡木技能考核，老师会把综合的运动分解成不同的、模块化的目标，让孩子更容易学习、进步；</p>
                    <p class="indent item">3）多元化的考级，让孩子有机会不断迎接新的挑战，体验努力的过程，享受成功的乐趣；</p>
                    <p class="indent item">4）每个孩子都是不同的，有些孩子平衡比较强，有些孩子翻滚更优秀，单项能够放大每个孩子的特长和优势，帮助他们更好地建立自信、认识。</p>
                    <br/>
                    <p>2.请所有中心（除：预售期&盛大开业期的中心），于2020年12月27日（周五）前完成中心Show Week装饰；</p>
                    <br/>
                    <div class="ui small images">
                        <img src="https://static.thelittlegym.com.cn/assert/img/oasis/origin/showWeek/decor1.png">
                        <img src="https://static.thelittlegym.com.cn/assert/img/oasis/origin/showWeek/decor2.png">
                        <img src="https://static.thelittlegym.com.cn/assert/img/oasis/origin/showWeek/decor3.png">
                    </div>
                    <br/>
                    <p>3.Show Week期间&结束后：充分利用微信、微博做宣传、做口碑；</p>
                    <br/>
                    <img class="ui left aligned huge image" src="https://static.thelittlegym.com.cn/assert/img/oasis/origin/showWeek/comments.png">
 
                </div> -->
            </div>
            <div slot="modal-footer" >
               <p class="text-center">
                <button type="button" class="btn btn-danger btn-block" @click="importance.show=false;">知道了,关闭</button>
               </p> 
            </div>
        </modal>
        <modal :show.sync="wording.show" effect="fade" width="70%">
            <div slot="title" class="modal-title">
                <h2 style="text-align:center"><b>{{wording.title}}</b></h2>
            </div>
            <div slot="modal-body" class="modal-body">
               <div class="ui segment importance">
                    <p>1. PreK / GS，中心老师通过announce等通知家长本次show week话术参考：</p>
                    <p class="item" style="text-indent:35px;">各位家长们，下周将是小小运动馆期中成果展示周，先向家长介绍一下什么叫成果展示周。成果展示周不是毕业典礼，而是记录孩子在过去的时间里在小小运动馆的成长。展示周会邀请家长们参与部分课程环节。为了更好的促进小朋友的运动发展能力、协调以及自信心，所以此次的展示周我们加入了相应的技能考核。这项考核全新引进了美国体操协会（USAG）Junior Olympics专业的体操标准考核，小小运动馆美国总部在此基础上制定了运动等级进阶，以能更好的与Junior Olympics的国际化标准进行衔接。此次的考核是有不同的等级安排，共分为LevelA-LevelI，一共9级。不同的等级所要求的动作难度也是不一样的，所以家长们在下周也可以透过玻璃看到小朋友会在教室中进行技能部分的考核，最终总部会根据孩子考核的成绩颁发相应等级的证书！如果小朋友此次未能通过相应的等级考核也没有关系，希望各位家长们还是可以给到小朋友最大的鼓励，我们也会给每个小朋友颁发表演周奖状。相信通过反复不断的练习小朋友都可以有很大的进步！期待小朋友们下周精彩的表现！</p>
                    <br/>
                    <p>2. 本次考级，老师操作和记录提醒：</p>
                    <p class="indent item">1）本次冬季Showweek进行平衡木 Balance Beam 专项考级项目，指导师根据班级人数提前打印好技能等级考核的Excel评分表；（评分表下载链接：企业网盘/课程主管/课程/爆款课-JO考级强化课）</p>
                    <p class="indent item">2）提前确定每个孩子等级考核Level参考；</p>
                    <p class="indent item">3）Show Week展示周每天课程结束后，需要提前在OASIS系统上面录入等级；（如下图，进入“孩子”界面操作）</p>
                    <br/>
                    <img class="ui left aligned Massive image" src="https://static.thelittlegym.com.cn/assert/img/oasis/origin/showWeek/skillTest.png">
                </div>
            </div>
            <div slot="modal-footer" >
               <p class="text-center">
                <button type="button" class="btn btn-danger btn-block" @click="wording.show=false;">知道了,关闭</button>
               </p> 
            </div>
        </modal>
        <!-- <Tip-for1212 :show="tip1212"></Tip-for1212> -->
        <Tip-for-security :show="sercurity"></tip-for-security>
    </div>

 </template>

<script> 

    import modal from '@/src/Modal.vue';
    import Poptip from '@/src/poptip';
    import TipFor1212 from './TipFor1212.vue';
    import TipForSecurity from './TipForSecurity.vue';
    
    export default {
        components:{
           modal,
           Poptip,
           TipForSecurity
        },
        props: {

        },
        data:function(){
            return {
                tmp:false,
                tip1212:false,
                sercurity:false,
                wording:{show:false,title:"2019冬季Showweek宣讲话术&其他重要操作事项提醒"},
                procedures:{show:false,title:"中心挑战赛（中心复赛）流程",pic:["https://static.thelittlegym.com.cn/assert/img/oasis/small/procedure_fusai1.png","https://static.thelittlegym.com.cn/assert/img/oasis/small/procedure_fusai2.png"]},
                importance:{show:false,title:"红包游戏&安全项目提醒"},
                jump_post:{
                    show:false,title:"飞跃挑战赛",closable:false,
                    urlPrefix:"https://static.thelittlegym.com.cn",
                    videoUrl:"https://static.thelittlegym.com.cn/assert/video/oasis/campaign_jump.mp4",
                    imgUrls:{
                        "init":[
                        {"small":"/assert/img/oasis/small/%E5%88%9D%E8%B5%9B1.png","origin":"/assert/img/oasis/origin/%E5%88%9D%E8%B5%9B1.png"},
                        {"small":"/assert/img/oasis/small/%E5%88%9D%E8%B5%9B2.png","origin":"/assert/img/oasis/origin/%E5%88%9D%E8%B5%9B2.png"}
                        ],
                        "again":[{"origin":"/assert/img/oasis/origin/%E5%A4%8D%E8%B5%9B1.png","small":"/assert/img/oasis/small/%E5%A4%8D%E8%B5%9B1.png"}],
                        "instructions":{"small":"/assert/img/oasis/small/announce.png","origin":["/assert/img/oasis/origin/announce1.jpg","/assert/img/oasis/origin/announce2.jpg"]}
                    }
                }
            }
        },
        computed:{
 
        },
        watch:{
            wording:{
              handler(newValue, oldValue) {
                  if(!newValue.show){ //仅false单向
                     this.importance.show= true;  
                  }
              },
              deep:true
            },
            importance:{
              handler(newValue, oldValue) {
                //if(!newValue.show && !this.wording.show && !this.tmp) this.tip1212=true;
                if(!newValue.show) this.sercurity=true;
              },
              deep:true
            }
        },
        methods:{
            toDetail(){
              this.tmp=true;
              this.importance.show=false;
              this.wording.show=true;
              this.tmp=false;        //引用tmp ,让importance不级联触发
            },
            to_1212(params) {
                var now = new Date();
                var end = new Date("2020-11-10");
                if(now<end){
                    this.importance.show=true;
                }
            }
        },
        ready:function(){
            this.to_1212();
        }
    }
</script>
<style scoped>

  .ui.big.image, .ui.big.images .image, .ui.big.images img, .ui.big.images svg {
    width: 520px;
    height: auto;
    font-size: 1.28571429rem;
  }
  .ui.small.image, .ui.small.images .image, .ui.small.images img, .ui.small.images svg {
    width: 260px;
    height: auto;
    font-size: .92857143rem;
  }
  .ui.medium.images .first{
    width:274px!important;  
  }
  .yellow{
      background-color: yellow;
  }
  .security .yellow{
      background-color: yellow;
      text-align: center;
      font-size: 21px !important;
      padding: 3px !important;
  }
  .parent{
     text-align:center;
     margin:2%!important;
  }
  .head{
     font-weight: 1000;
     font-size: 21px !important;
  }
 
  .indent{
     margin-left:30px
  }
  .security .importance{
      font-size: 18px !important;
      text-align: center;
  }
  p{
     margin:0.6% auto; 
  }
  .item{ 
      font-size: 18px !important;
  }
  .parent{
      position: relative;
  }
  .child{
     top:40%;
     font-size: 22px !important;
     font-weight: bold;
     position:absolute;
     margin: auto;
  }
  .txt{
      font-size: 16px;
  }
  .subsection{
    color:blue;
    font-weight: bold;
    margin:2% auto;
    text-align: center;
    font-size: 28px !important;
  }
</style>