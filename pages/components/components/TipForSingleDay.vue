<template>
    <div>

        <modal :show.sync="importance.show" effect="fade" width="88%">
            <div slot="title" class="modal-title">
                    <h2 style="text-align:center"><b>{{importance.title}}</b></h2>
            </div>
            <div slot="modal-body" class="modal-body">
                <div class="ui segment importance">
                    <p>💢【优惠时间】</p>
                    <p>11/1-11/11 一元抢购最高可达1000元优惠券</p>
                    <p>11/12-11/30 一元抢购最高可达688元优惠券</p>
                    <p>💢【小程序操作流程】
                    <p>第一步：家长用留给中心的手机号码支付一元限时抢购优惠券</p>
                    <p>第二步：点击 “优惠升级”图标，升级优惠券金额</p>
                    <p>第三步：家长转发给朋友群或是个人，完成优惠券金额升级</p>
                    <p>第四步：家长签约后，中心即时录入系统，家长即可参与刮刮卡活动。家长通过手机短信提醒和小程序模版消息推送进入小程序的刮奖界面。</p>
                    💢【重要提醒】
                    <p>1 提醒家长用留给中心的手机号码进行支付和刮奖，避免错过推送的消息；</p>
                    <p>2 建议在核销优惠前，复核家长是否已转发群或个人；</p>
                    <p>3 本次活动包括新约、续约和扩课家庭（50节课及以上）；</p>
                    <p>4 如何宣传：建议在会员班级群/历史会员/近期体验未报名观望价格的家长/异业合作渠道/当地的线上平台，如点评、美团等流量平台进行宣传，使用小程序或是海报；宣传应用话术：小小运动馆双１１活动是全国统一的活动，优惠券是限时限量购买，且必须通过官方唯一的购买渠道，售完即止。这也是全年最大优惠力度的活动。</p>
                    <p>5 请中心在11/1前务必完成海报/台卡的张贴布置；</p>
                    <p>6 ”双11的优惠券是随时可以购买的，下个月你们是不是也有这样的活动？“</p>
                    <p>答：小小运动馆双１１活动是全国统一的活动，优惠券是限时限量购买，且必须通过官方唯一的购买渠道，售完即止。这也是全年最大优惠力度的活动。</p>
                    <p>７ “如果我没有购买优惠券就报名了，可以直接参与刮刮卡活动吗？”</p>
                    <p>答：不可以。小小运动馆惠动双１１的小程序是此次活动的官方唯一渠道，需要先在小程序购买优惠券，报名并且报名中心即时录入系统后才可以进行刮刮卡的活动。无法单独参与刮刮卡活动！</p>
                </div>
            </div>
            <div slot="modal-footer" >
               <p class="text-center">
                <button type="button" class="btn btn-danger btn-block" @click="importance.show=false;">知道了,关闭</button>
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
                docQA:{show:false,title:"飞跃挑战赛Q&A"},
                procedures:{show:false,title:"中心挑战赛（中心复赛）流程",pic:["https://static.thelittlegym.com.cn/assert/img/oasis/small/procedure_fusai1.png","https://static.thelittlegym.com.cn/assert/img/oasis/small/procedure_fusai2.png"]},
                importance:{show:false,title:"2019 双十一活动  🔥运营提醒🔥"},
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
            to_1111(params) {
                var now = new Date();
                var end = new Date("2019-12-08");
                if(now<end){
                    // var self=this;
                    // var videoUrl = this.jump_post.videoUrl;
                    // var myPlayer = videojs('my-video');
                    // // videojs("my-video", {}, function() {
                    // //     window.myPlayer = this;
                    // //     myPlayer.src(videoUrl);
                    // //     myPlayer.load(videoUrl);
                    // //     myPlayer.play();
                    // //     myPlayer.on('ended', function() {
                    // //         console.log('播放结束了!');
                    // //         self.jump_post.closable=true;
                    // //     });
                    // // });
                    // this.jump_post.show=true;
                    this.importance.show=true;
                }
            }
        },
        ready:function(){
            this.to_1111();
        }
    }
</script>
<style scoped>
    .cert{
       padding: 1% 1%;
	   margin:0;
    }
    .title{
       padding: 1% 1%;
       font-weight: bold;
    }
    .title2{
       padding: 1% 1%;
       padding-left:4%;
       font-weight: bold;
       font-size: 15px!important;
    } 
  .jumbo img{
    width: 1160px;
    height: auto;
    font-size: 1.71428571rem;
  }
  .doc{
      font-size: 17px;
  }
  .title {
     font-weight: bold;
  }
  .head{
     font-weight: bold;
     text-align: center;
     font-size: 20px !important;
     padding: 0.8% 0.8%;
	 margin:0;
  }
  .subhead{
     font-weight: bold;
     font-size: 17px !important;
  }
  .talk {
    font-style:italic;
    font-weight: bold;
  }
  .importance{
      font-weight: bold;
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
</style>