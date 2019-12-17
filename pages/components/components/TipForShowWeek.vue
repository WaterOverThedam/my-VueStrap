<template>
    <div>

        <modal :show.sync="importance.show" effect="fade" width="78%">
            <div slot="title" class="modal-title">
                    <h2 style="text-align:center;color:#000077"><b>{{importance.title}}</b></h2>
            </div>
            <div slot="modal-body" class="modal-body">
                <div class="ui segment importance">
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
                    <br/>
                    <p class="head">
                       <a href="#" @click.prevent="wording.show=true">
                         <span>2019冬季Showweek（2020.1.6-1.12）宣讲话术等操作事项提醒&nbsp;&nbsp; </span>
                         <span class="glyphicon glyphicon-hand-left"></span>
                       </a>
                    </p>
                </div>
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
    </div>

 </template>

<script> 
    import modal from '@/src/Modal.vue';
    import Poptip from '@/src/poptip';
    export default {
        components:{
           modal,
           Poptip
        },
        props: {

        },
        data:function(){
            return {
                wording:{show:false,title:"2019冬季Showweek宣讲话术&其他重要操作事项提醒"},
                procedures:{show:false,title:"中心挑战赛（中心复赛）流程",pic:["https://static.thelittlegym.com.cn/assert/img/oasis/small/procedure_fusai1.png","https://static.thelittlegym.com.cn/assert/img/oasis/small/procedure_fusai2.png"]},
                importance:{show:false,title:"2019冬季Showweek（2020.1.6-1.12）提醒：表演周+考级周"},
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
        methods:{
            to_1212(params) {
                var now = new Date();
                var end = new Date("2020-01-10");
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
    
 .ui.small.image, .ui.small.images .image, .ui.small.images img, .ui.small.images svg {
    width: 280px;
    height: auto;
    font-size: .92857143rem;
  }
  .head{
     font-weight: 1000;
     font-size: 22px !important;
  }
 
  .indent{
     margin-left:30px
  }
  .importance :not(.item){
      font-weight: bold;
      font-size: 18px !important;
  }
  .item{
      font-size: 17px !important;
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
</style>