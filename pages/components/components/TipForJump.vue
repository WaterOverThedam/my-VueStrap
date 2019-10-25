<template>
    <div>
        <modal  :show.sync="jump_post.show" effect="fade" width="90%" :closable="jump_post.closable" >
            <div slot="title" class="modal-title">
                <span class="glyphicon glyphicon-info-sign text-danger"></span>
                <b  class="text-danger" v-text="jump_post.title"></b> 
            </div>
            <div slot="modal-body" class="modal-body">
                <div class="ui grid">
                    <div class="nine wide column">
                        <video width="120%" id="my-video" class="video-js vjs-big-play-centered vjs-fluid" controls preload="auto"  data-setup="{}"></video>    
                    </div>
                    <div class="seven wide column">
                        <div class="ui segments">
                            <div class="ui segment head">
                                    <a  title="点击查看详细" href="#" @click.prevent="docQA.show=true">飞跃挑战赛Q&A</a>&nbsp;
                                    <span class="glyphicon glyphicon-hand-left"></span>
                            </div>
                            <div class="ui segment head">
                                    <a  title="点击查看详细" href="#" @click.prevent="procedures.show=true">中心挑战赛（中心复赛）流程</a>&nbsp;
                                    <span class="glyphicon glyphicon-hand-left"></span>
                            </div>
                            
                            <div class="ui segment title">
                                <p>初赛证书</p>
                            </div>
                            <div class="ui horizontal segments cert">
                                <div v-for="url of jump_post.imgUrls.init" class="ui segment cert">
                                    <Poptip trigger="click"  placement="bottom-start" width="600">
                                        <Button><div class="ui small image"><img :src="jump_post.urlPrefix+url.small"  alt="点击放大图片"></div></Button>
                                        <div class="api" slot="content">
                                            <div class="ui massive image"><img :src="jump_post.urlPrefix+url.origin"></div>
                                        </div>
                                    </Poptip>
                                </div>
                            </div>
                            <div class="ui segment title">
                                <div class="ui grid">
                                    <div class="eight wide column">复赛证书</div>
                                    <div class="eight wide column">初赛课前&颁奖Announce</div>
                                </div>
                            </div>
                            <div class="ui horizontal segments cert">
                                <div v-for="url of jump_post.imgUrls.again" class="ui segment cert">
                                    <Poptip trigger="click" :placement="$index==0?'bottom-start':'left-start'" width="600">
                                        <Button><div class="ui small image" alt="点击放大图片"><img :src="jump_post.urlPrefix+url.small"></div></Button>
                                        <div class="api" slot="content">
                                            <div class="ui massive image"><img :src="jump_post.urlPrefix+url.origin"></div>
                                        </div>
                                    </Poptip>
                                </div>
                                <div class="ui segment cert">
                                    <Poptip trigger="click" placement="right" width="960">
                                        <Button><div class="ui small image" alt="点击放大图片"><img :src="jump_post.urlPrefix+jump_post.imgUrls.instructions.small"></div></Button>
                                        <div class="api" slot="content">
                                            <div class="ui grid">
                                                <div class="eight wide column"><div class="ui massive image"><img :src="jump_post.urlPrefix+jump_post.imgUrls.instructions.origin[0]"></div></div>
                                                <div class="eight wide column"><div class="ui massive image"><img :src="jump_post.urlPrefix+jump_post.imgUrls.instructions.origin[1]"></div></div>
                                            </div>
                                        </div>
                                    </Poptip>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div slot="modal-footer" >
            </div>
        </modal>
        <modal :show.sync="importance.show" effect="fade" width="68%">
            <div slot="title" class="modal-title">
                    <h2 style="text-align:center"><b>{{importance.title}}</b></h2>
            </div>
            <div slot="modal-body" class="modal-body">
                <div class="ui segment importance">
                <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;各位中心的小伙伴，本次飞跃挑战赛报名小程序的<span class="text-danger">报名通道即将在2019年10月31日24点关闭</span>，进入制作电子证书的程序。请务必在此之前，督促已参赛的会员家长尽快在小程序里报名拿到自己的参赛证，电子证书的制作基础是参赛证。如果没有进入小程序报名，是无法拿到电子证书，请知晓！</p>
                <br/>
                <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;另：电子证书的编号清单，总部会统一发给各中心，请各中心于11月8日之前核实完毕，11月10日总部会将电子证书清单汇总备案，并开始编号抽奖。</p>             
                </div>
            </div>
            <div slot="modal-footer" >
               <p class="text-center">
                <button type="button" class="btn btn-danger btn-block" @click="importance.show=false;">知道了,关闭</button>
               </p> 
            </div>
        </modal>
        <modal  :show.sync="docQA.show" effect="fade" width="95%">
          <div slot="title" class="modal-title">
                <h2 style="text-align:center"><b>{{docQA.title}}</b></h2>
          </div>
          <div slot="modal-body" class="modal-body">
            <div class="ui segment">
                    <div class="ui grid doc">
                    <div class="seven wide column">
                              <h3><b>【运营方向】</b></h3>							
                              <p class="title">1. 如何借力飞跃挑战赛拿到更多的例子？</p>
                              <p>答： 宁波中心在商场区域内进行线下飞跃挑战赛，直接与家长面对面沟通拿例子。中心可以考虑在合适的场地内做小型的线下活动体验，如用红黄的梯形垫进行模拟挑战赛，再邀约到中心参与正式的课程体验拿证书；
                              比赛期间，在社区和幼儿园的活动中可以考虑借力飞跃挑战赛；邀请更多的家长参与“小小之星评选”，目前已经执行的中心通过助力转发拿到会员介绍。</p>
                              <p class="title">2. 非会员邀约困难，家长说第一次参加比赛，要考等级太难了怎么办？</p>
                              <p>答：首先，中心需要所有成员背诵非会员的邀约话术，在第一时间告知家长相关赛事精神，背书等（话术如下加粗斜体字）</p>
                              <p class="talk">话术：今天（本周）来体验的小朋友很幸运，因为我们全国正在进行体育趣味赛初赛，课程中有20-30分钟的时间进行飞跃挑战赛，一方面，您的小朋友有机会参与并且可以通过练习挑战一下自己；另一方面，小朋友也可以根据自己达到的级别，获得一张证书哦，很有意义的；我们小小运动馆的会员，每年都有很多的机会参加比赛、课程表演周、考级啊，有机会展现自己，锻炼胆量和自信，同时验证我们的学习效果；如果以后***（小朋友名字）持续上课，您也会明显看到孩子持续的进步和成长的。</p>
                              <p>其次，争取在邀约家长时添加潜在客户的微信，将“给家长的一封信”推送给家长；</p>
                              <p>再次，如果家长问到担心比赛太难了，需要强调赛事精神。参考话术如下（话术如下加粗斜体字）</p>
                              <p class="talk">话术：这也许是宝宝参与的第一场全国比赛，也许是Ta人生中第一次当着众人接受挑战，也许Ta会有一点点紧张。确定的是，Ta很需要你们的支持和鼓励。“我一上场，就是冠军”——本次赛事的精神主旨！有时宝宝会挑战成功，有时宝宝会挑战失败，但无论结果如何，他们都在为目标努力，为挑战坚持。不断尝试的过程是更重要的！ 此次比赛难度是适用于所有孩子，请妈妈/爸爸放心，即使没有参与过的孩子，通过老师的现场指导，也可以达到一定水平。</p>
                              <p class="title">3. 非会员邀约困难，家长觉得无法体验完整一堂课，对课程不好判断怎么办？</p>
                              <p>答：参考话术如下（话术如下加粗斜体字）</p>
                              <p class="talk">话术：妈妈/爸爸，今天的课程和常规课没有本质区别，都传递了小小运动馆课程的精髓、趣味和技能成果。课程环节保留了开场、热身，最大的差异只是在技能练习这块，常规课是站点练习，而今天则是成果的展示。刚好你体验到的是全国的赛事，还有证书，反而更加直观可以见证会员成长。这里有平常宝宝站点练习的视频，你可以看看，感受下我们平时的练习形式。准备站点的视频给家长看区别是什么（视频放置企业微信文件盘：飞跃挑战赛Q&A）</p>
                              <p class="title">4. 如何鼓励家长们积极上传视频，参与助力转发？</p>
                              <p>答：家长是否上传视频，目前从现有已经开始初赛中心的反馈来看，更重要的：一是有比较好的视频可以分享，需要中心尽量可以多拍一些照片和视频素材分享给家长，无论是班级群或是一对一给到家长；二是比赛中和比赛后及时提醒家长做上传动作。</p>
                    </div>
                    <div class="nine wide column">
                              <h3><b>【课程方向】</b></h3>	
                              <p class="title">1. 小鸟班和怪兽班爬行不按轨道，爬行和等待时间过长。</p>
                              <p>答：将轨道设置简化，直接用两块-三块Trap连接成一条，最后放一个落地垫。爬行时间过长，可以分轮次和分组进行，如果人数很多，可以第一轮的时候放置两条线路，两名孩子同时完成，一轮完成4-6名孩子，然后让家长带着孩子探索，过2分钟后重新召集进行第二轮。</p>
                              <p class="title">2. FB还不会跳怎么办？</p>
                              <p>答：可以邀请家长来为孩子演示一次Level 1的动作，获得趣味赛证书。</p>
                              <p class="title">3. LEVEL跳级能过怎么处理？</p>
                              <p>答：Level 6，7容易造成孩子跳级，现解决方案，Level 6的时候可以轻保护，但必须确保在练习的时候孩子是完全可以做到Level 7。</p>
                              <p class="title">4. 亲子班：家长跟着孩子一起游离，场面控制不好怎么办？</p>
                              <p>答：1） 课前一定做传递期望值，并宣扬学会等待、为别人鼓掌等核心理念；2）如果出现大面积游离，老师可以适当暂停，唱Jingle邀请回来；3.Level比赛间插入探索和游戏。</p>
                              <p class="title">5. 学前班：等待时间过长，孩子开始尖叫，往门外跑。</p>
                              <p>答：老师重新组织家长和孩子，可以打开音乐一起简单Dance一下，然后再重新召集。于此同时，缩短等待时间，有效组织。</p>
                              <p class="title">6. 严重超时！影响下一节课正常进行！</p>
                              <p>答： 开场（或FB：预跳）和热身后直接比赛，如果人数超过10人，则可以使用备选课程方案。FB的孩子Level 3的时候会造成一些耗时，建议中心使用两套Trap ,蓝黄红以及蓝色Trap，进行两组试跳。（注：蓝黄红Trap只限Level 1-3等级使用）</p>
                              <p class="title">7. 等待时，由于无欢迎牌，气氛尴尬。</p>
                              <p>答：请中心自行输出欢迎牌，如果来不及，可以使用Show Week加油牌。</p>
                              <p>附件：班级人数多，容易超时的解决方案：</p> 
                              <p class="title" style="text-align:center">备选课程方案</p> 
                              <p class="title">FB趣味小虫班级</p> 
                              <p>1.Move & Learn的环节改为大红垫子上的Level 等级练习，助教和主教一起组织孩子一个个出发练习Level 1-3的等级，人数超过12人的建议使用两套Trap在大红垫上。</p> 
                              <p>2.热身活动不变。</p> 
                              <p>3.站点取消改为飞跃挑战赛，邀请家长进教室一起加油助威，并拍摄视频助力</p> 
                              <p>在比赛过程中孩子出现大范围游离，老师可以暂停比赛，打开音乐，让家长来挑战Level 2/3，吸引孩子注意，然后再召集重新开始比赛。</p> 
                              <p>4.比赛结束后，根据剩下时间，如果时间几乎没有了，赶紧颁奖，如果有多余的时间，玩球或者泡泡。</p> 
                              <p>5.颁发勋章。</p> 
                              <p class="title">GW及GF，GS班级</p> 
                              <p>1.开场环节不变。</p> 
                              <p>2.热身环节不变。</p> 
                              <p>3.集体活动取消。</p> 
                              <p>4.站点取消改为所有孩子在大红垫子强化练习Level 等级。老师组织孩子来到大红垫子，依次练习踏板技能，如果有班级从Level 3开始的，建议使用两套Trap来进行，Level 4开始，重新使用蓝色标准Trap作为比赛后续使用。每个孩子确保练过不同Level，以保证老师可以做出最终比赛的初始等级判断，然后结束练习，准备开始比赛。</p> 
                              <p>5.飞跃挑战赛。</p> 
                              <p>6.时间剩余多的话，加入本周游戏。</p> 
                              <p>7.颁发勋章！</p> 
                    </div>
                </div>
             </div>
            </div>
            <div slot="modal-footer" >
               <p class="text-center">
                <button type="button" class="btn btn-danger btn-block" @click="docQA.show=false;">知道了,关闭</button>
               </p> 
            </div>
        </modal>
        <modal :show.sync="procedures.show" effect="fade" width="70%">
            <div slot="title" class="modal-title">
                <h2 style="text-align:center"><b>{{procedures.title}}</b></h2>
            </div>
            <div slot="modal-body" class="modal-body">
                <div class="ui segment" >
                    <div class="ui one column grid" style="padding:1%">
                        <div class="row">
                            <div class="column">
                                <div class="ui two column grid">
                                    <div class="column"><img class="ui medium right image" style="padding-left:20%;" :src="procedures.pic[0]"></div>
                                    <div class="column parent"><p class="child">飞跃挑战赛 中心挑战赛</p></div>
                                </div>
                            </div>
                        </div> 
                        <div class="row">
                            <div class="column">
                                <p class="title2">时间：10/26,27（有中心可能会延后，建议中心在初赛后两周内举办）</p>
                                <p class="title2">时长：1.5小时</p>
                                <p class="title2">人数：30组家庭</p>
                                <p class="title2">年龄段：30个月-12岁</p>
                                <p class="title2">会员是扣课参加（1课时，OASIS里需要提前新建班级）；非会员付费参加</p>
                            </div>
                        </div>    
                        <div class="row">
                            <div class="column"><img class="ui massive center image"  :src="procedures.pic[1]"></div>
                        </div>  
                        <div class="row">
                            <p class="title2">中心复赛择优录取（２０个名额）：每个年龄段前4名孩子参与到复赛中</p>
                            <p class="title2">公开报名名额：10名选手公开招募，可以是非会员(新中心按实际情况分配名额）</p>
                        </div>  
                        <div class="row">
                            <div class="column">
                                <p style="text-align:center" class="head">比赛流程</p>
                                <p class="subhead">召集欢迎</p>
                                <p class="txt">&nbsp;&nbsp;&nbsp;&nbsp;每位孩子进入中心签到时，都会有一个号码牌，进教室之前贴在衣服上（孩子的参赛号码提前根据初赛Level分组编写）</p>
                                <p class="subhead">开场</p>
                                <p class="txt">1.组织所有家庭来到大红垫子上围成一个圈，一起唱出我们赛事的主题曲也是我们的经典开场曲目Hello Song</p>
                                <p class="txt">2.Lead介绍比赛事项：</p>
                                <p class="txt">分为3轮，每一轮含3个等级，该等级的孩子分别在相应轮次进行比赛</p>
                                <p class="txt">每个孩子一轮中依然有两次试跳</p>
                                <p class="txt">初始等级为孩子初赛中取得的降一级Level（如果孩子在初赛获得Level 3，在复赛则从Level 2开始比赛，老师需要提前备注好孩子的参赛等级） 如果是体验的孩子：超级怪兽，FB年龄段均从Level 1开始；GW从Level 2开始，GF，GS从Level 3开始</p>
                                <p class="txt">3.闪亮登场</p>
                                <p class="txt">在大红垫中间放一个trap,老师按照号码牌顺序依次叫孩子站在Trap上，介绍名字，登场；<b>老师告知孩子复赛的初始等级，并告知第几轮次进行</b></p>
                                <p class="txt">4.喊出口号：我一上场，就是冠军</p>
                                <p class="subhead">热身</p>
                                <p class="txt">Music:Clap Your Hand</p>
                                <p class="txt">所有的孩子来到大红垫和第一个站点，一起拍手，跺脚舞动自己</p>
                                <p class="txt">歌曲技能部分改为：</p>
                                <p class="txt">Walk </p>
                                <p class="txt">Jump</p>
                                <p class="txt">深蹲</p>
                            </div>
                        </div>  
                    </div>
                </div>        
            </div>
            <div slot="modal-footer" >
                <p class="text-center">
                    <button type="button" class="btn btn-danger btn-block" @click="procedures.show=false;">知道了,关闭</button>
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
                importance:{show:false,title:"关于电子证书编号认证的重要通知"},
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
            to_jump_post(params) {
                var now = new Date();
                var end = new Date("2019-11-01");
                if(now<end){
                    var self=this;
                    var videoUrl = this.jump_post.videoUrl;
                    var myPlayer = videojs('my-video');
                    videojs("my-video", {}, function() {
                        window.myPlayer = this;
                        myPlayer.src(videoUrl);
                        myPlayer.load(videoUrl);
                        myPlayer.play();
                        myPlayer.on('ended', function() {
                            console.log('播放结束了!');
                            self.jump_post.closable=true;
                        });
                    });
                    this.jump_post.show=true;
                    this.importance.show=true;
                }
            }
        },
        ready:function(){
            this.to_jump_post();
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