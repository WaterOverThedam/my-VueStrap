<template>
    <div>

        <modal :show.sync="show" effect="fade" width="78%">
            <div slot="title" class="modal-title">
                    <h2 style="text-align:center"><b>{{importance.title}}</b></h2>
            </div>
            <div slot="modal-body" class="modal-body">
                <div class="ui segment importance">
                    <p class="head">【聚惠双12活动】：</p>
                    <p>1、聚惠双12，狂欢不停！</p>
                    <p>活动时间：2019年12月1日~12月31日</p>
                    <p>活动规则：</p>
                    <p>1）凡在活动期间内，在中心购买50课时及以上课时包，即可享受12元换购2次课时的优惠；</p>
                    <p>2）2次课时可用于核心课程，也可用于爆款课程；</p>
                    <p>3）每个会员仅可购买一次；</p>
                    <p>4）适用于新会员新购以及老会员续课；</p>
                    <br/>
                    <img class="ui left aligned big image" src="https://static.thelittlegym.com.cn/assert/img/oasis/origin/1212.jpg">
                    <br/>
                    <p class="indent">参与本次全国双12活动的中心，老师oasis输入合约时“签约促销活动”选择“2019双十二活动加12元另赠2节课”，系统会自动生成两节赠课的，所有老师账户都能操作</p>
                    <br/>
                    <img class="ui left aligned image" src="https://static.thelittlegym.com.cn/assert/img/oasis/origin/1212_instruction.png">
                    <br/>
                    <p><span class="head">【童心相衣】</span>捐衣公益活动</p>
                    <p>活动时间：2019年12月12日~1月12日</p>
                    <p>活动须知：</p>
                    <p>1）活动期间认捐数量有限，捐完即止</p>
                    <p>2）捐赠要求：八成新、无污渍、无破损冬衣</p>
                    <p>3）参与方式：12月12日活动上线后扫码进入捐赠页面，选择捐赠的衣物尺码及数量，自行寄出</p>
                    <p>4）成功捐赠衣物的小朋友可凭捐衣页面至中心领取爱心证书一张，总部统一输出。</p>
                    <br/>
                    <img class="ui left aligned big image" src="https://static.thelittlegym.com.cn/assert/img/oasis/origin/charity.jpg">

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
            show:{
                default:false
            }
        },
        data:function(){
            return {
                docQA:{show:false,title:"飞跃挑战赛Q&A"},
                procedures:{show:false,title:"中心挑战赛（中心复赛）流程",pic:["https://static.thelittlegym.com.cn/assert/img/oasis/small/procedure_fusai1.png","https://static.thelittlegym.com.cn/assert/img/oasis/small/procedure_fusai2.png"]},
                importance:{show:false,title:"总部12月推出【聚惠双12活动】以及【童心相衣】捐衣公益活动！"},
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
    
    
  .head{
     font-weight: 1000;
     font-size: 22px !important;
  }
 
 .indent{
     text-indent:30px
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