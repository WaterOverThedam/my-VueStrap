<template>
    <div>

        <modal :show.sync="show" effect="fade" width="78%">
            <div slot="title" class="modal-title">
                    <h2 style="text-align:center"><b>{{importance.title}}</b></h2>
            </div>
            <div slot="modal-body" class="modal-body">
                <div class="ui segment importance security">
                    <p class="subsection">“安全”是小小运动馆的第一要素！</p>
                    <br/>
                    <p class="parent"> <span class="yellow">请全国中心坚持做好OASIS上的每日中心安全检查</span></p>
                    <img class="ui centered massive image pic" src="https://static.thelittlegym.com.cn/assert/img/oasis/origin/security/security.png" />
                    <p class="parent"> <span class="yellow">2019年 中心发生过的意外事故 引发的原因</span></p>
                    <p class="indent item"><b>1，中心老师未尽到相应责任</b>【未及时保护、安全意识不强、安全距离未强调等】</p>
                    <p class="indent item"><b>2，监护人未尽到相应监护责任</b>【亲子班需要监护人起到保护者的角色、开放时间或者小朋友独自在教室时监护人需在旁保护小朋友的安全等】</p>
                    <p class="indent item"><b>3，小朋友的运动技能/动作的标准性</b></p>
                    <p class="indent item"><b>4，由于第三者小朋友引起的（小朋友之间的推搡）</b></p>
                    <p class="parent"> <span class="yellow">中心如何在安全方面做的更好，避免不必要的意外</span></p>
                    <p class="indent item"><b>1，中心提高所有老师的安全意识</b></p>
                    <p class="indent item"><b>2，中心老师保护手法的巩固</b></p>
                    <p class="indent item"><b>3，中心就关于安全方面的宣讲（同时灌输给监护人）</b></p>
                    <p class="indent item"><b>4，小朋友的自我保护意识</b></p>
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
                importance:{show:false,title:"安全项目提醒"},
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