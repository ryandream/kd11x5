<template>
    <main class="kd-body">
        <div class="content_styles">
            <div class="header_styles">
                <div class="ico minilogo_styles" :class="'ico' + gameId"></div>
                <div class="info_styles">
                    <div>
                        <h2>{{ gameName }}</h2>
                        <p>第 {{ number }}  期</p>
                    </div>
                    <div>方案发起时间：<span>{{ startTime }}</span>
                        认购截止时间：<span>{{ endTime }}</span>
                    </div>
                    <div>方案编号：<span>{{ id }}</span></div>
                </div>
            </div>
            <div class="detail_styles">
                <div class="title_styles">发起人信息</div>
                <div class="con_styles">
                    <p>方案名称： {{ name }}</p>
                    <p>发起人： {{ userName}}</p>
                </div>
            </div>
            <div class="table_styles">
                <div class=" clearfix">
                    <div class="ant-table">
                        <div class="ant-table-title">方案信息</div>
                        <div class="ant-table-content">
                            <table width="100%">
                                <colgroup>
                                    <col>
                                    <col>
                                    <col>
                                    <col>
                                    <col>
                                    <col>
                                    <col>
                                    <col>
                                </colgroup>
                                <thead class="ant-table-thead1">
                                    <tr>
                                        <th><span>彩种类型</span></th>
                                        <th><span>方案类型</span></th>
                                        <th><span>总金额</span></th>
                                        <th><span>份数</span></th>
                                        <th><span>每份</span></th>
                                        <th><span>发起人提成</span></th>
                                        <th><span>跟单人数</span></th>
                                        <th><span>购买进度</span></th>
                                    </tr>
                                </thead>
                                <tbody class="ant-table-tbody1">
                                    <tr class="ant-table-row">
                                        <td>{{ gameName }}</td>
                                        <td>{{ type }}</td>
                                        <td>￥{{ totalAmount }}</td>
                                        <td>{{ totalCount }}份</td>
                                        <td>￥{{ unitAmount }}</td>
                                        <td>{{ bonus }}</td>
                                        <td>{{ usersLength }}人</td>
                                        <td><div>{{ progress }}</div></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class=" clearfix">
                    <div class="ant-table">
                        <div class="ant-table-title">方案详情</div>
                        <div class="ant-table-content">
                            <table width="100%">
                                <colgroup>
                                    <col>
                                    <col>
                                    <col>
                                    <col>
                                    <col>
                                    <col>
                                    <col>
                                    <col>
                                </colgroup>
                                <thead class="ant-table-thead1">
                                    <tr>
                                        <th><span>投注期号</span></th>
                                        <th><span>倍数</span></th>
                                        <th><span>方案总份数</span></th>
                                        <th><span>出票状态</span></th>
                                        <th><span>开奖号码</span></th>
                                        <th><span>中奖情况</span></th>
                                        <th><span>总奖金</span></th>
                                        <th><span>每份奖金</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="ant-table-tbody2">
                                    <tr class="ant-table-row">
                                        <td>{{ number }}</td>
                                        <td>{{ multiple }}倍</td>
                                        <td>{{ totalCount }}份</td>
                                        <td class="cgreen">{{ status }}</td>
                                        <td>{{ balls ? balls : '-' }}</td>
                                        <td class="cgreen">{{ winningStatus }}</td>
                                        <td class="cred">{{ totalAwardAmount ? totalAwardAmount : '-' }}</td>
                                        <td class="cred">{{ unitAwardAmount ? unitAwardAmount : '-' }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div class="table_styles">
                <div class="tab">
                    <a href="javascript:;" :class="{on: tabNav === 'bettingContent'}" @click="switchTab('bettingContent')">注单内容<span class="ant-tabs-ink-bar"></span></a>
                    <a href="javascript:;" :class="{on: tabNav === 'usersList'}" @click="switchTab('usersList')">参与用户<span class="ant-tabs-ink-bar"></span></a>
                    <a href="javascript:;" :class="{on: tabNav === 'openInfo'}" @click="switchTab('openInfo')">开奖信息<span class="ant-tabs-ink-bar"></span></a>
                </div>
                <div class="content">
                    <div class="qie_huan" :class="'tab-' + tabNav">
                        <div class="qid">
                            <ul>
                                <li v-if="bettingContent.length === 0">没有数据</li>
                                <li v-else v-for="item in bettingContent">
                                    {{ item.name }}
                                    <span>
                                        <small class="red">{{ item.content }}</small>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 注数：
                                        <small class="red">{{ item.count }}</small>注&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;倍数：
                                        <small class="red">{{ item.multiple }}</small>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;本注金额：
                                        <small class="red">￥{{ item.amount }}</small>
                                    </span>
                                </li>
                            </ul>
                        </div>
                        <div class="qid">
                           <div class="ant-table">
                                <table width="100%">
                                    <colgroup>
                                        <col>
                                        <col>
                                        <col>
                                        <col>
                                        <col>
                                        <col>
                                        <col>
                                        <col>
                                    </colgroup>
                                    <thead class="ant-table-thead">
                                        <tr>
                                            <th><span>用户名</span></th>
                                            <th><span>参与方式</span></th>
                                            <th><span>参与时间</span></th>
                                            <th><span>参与金额</span></th>
                                            <th><span>状态</span></th>
                                            <th><span>共计</span></th>
                                            <th><span>奖金</span></th>
                                            <th><span>比例</span></th>
                                        </tr>
                                    </thead>
                                    <tbody class="ant-table-tbody">
                                        <template v-for="user in users">
                                            <template v-for="(item, index) in user.buyList">
                                                <tr v-if="index === 0">
                                                    <td :rowspan="user.buyList.length">{{ user.userName }}</td>
                                                    <td>{{ item.type }}</td>
                                                    <td>{{ item.time }}</td>
                                                    <td>￥{{ item.amount }}</td>
                                                    <td>{{ item.status }}</td>
                                                    <td :rowspan="user.buyList.length">￥{{ user.totalAmount }}</td>
                                                    <td :rowspan="user.buyList.length">￥{{ user.awardAmount }}</td>
                                                    <td :rowspan="user.buyList.length">{{ user.rate }}</td>
                                                </tr>
                                                <tr v-else>
                                                    <td>{{ item.type }}</td>
                                                    <td>{{ item.time }}</td>
                                                    <td>￥{{ item.amount }}</td>
                                                    <td>{{ item.status }}</td>
                                                </tr>
                                            </template>
                                        </template>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="qid">
                            开奖号码：
                            <span class="numlist_styles">
                                <em v-for="ball in balls.split(',')">{{ ball }}</em>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
    import * as ajax from '../api';
    import { getNameByCode } from '../common/basic';
    import gameBasic from '../mixins/gameBasic';

    export default {
        name: 'ComAccountRecordDetailOfBetting',
        mixins: [gameBasic],
        data(){
            return {
                // 基本信息
                gameName: '', // 游戏编码
                number: '', // 期号
                startTime: '', //方案发起时间
                endTime: '', //认购截止时间

                // 发起人信息
                name: '', //方案名称
                userName: '', // 发起人

                // 方案信息
                type: '', // 方案类型 // 1 自购 2追号 3 合买 4跟单
                totalAmount: '', // 总金额
                totalCount: '', // 总份数
                unitAmount: '', // 每份金额
                bonus: '', // 发起人提成
                usersLength: '', // 跟单人数
                progress: '', // 进度

                // 方案详情
                multiple: '', // 倍数
                status: '', // 出票状态 3、已出票 1、未满员 2已满员 4 已撤单
                balls: '',  // 开奖号码
                winningStatus: '', // 中奖情况 1 未兑奖 2 未中奖3 已中奖
                totalAwardAmount: '', // 总奖金
                unitAwardAmount: '', // 每份奖金

                // 注单内容
                bettingContent: [], // 投注内容

                // 参与用户
                users: [],

                // 开奖信息

                // 其它
                selfCount: '', // 发起人购买份数

                tabNav: 'bettingContent'
            };
        },
        computed: {
            gameId(){
                return this.$route.params.gameId;
            },
            id(){
                return this.$route.params.id;
            }
        },
        created(){
            this.fetchDetailOfBettingRecord();
        },
        methods: {
            fetchDetailOfBettingRecord(){
                return ajax.apiFetchDetailOfBettingRecord({
                    id: this.id,
                    gameId: this.gameId
                }).then(json => {
                    if(typeof json.S !== 'undefined'){
                        console.log(json);
                    }else{
                        // this.id = json.planId; // id
                        this.userName = json.userName; // 发起人
                        this.gameName = this.gameList[json.gameNo].name; // 游戏编码
                        this.progress = json.progress; // 进度
                        this.totalAmount = json.amount; // 总金额
                        this.unitAmount = json.perAmount; // 每份金额
                        this.totalCount = json.divNum; // 总份数
                        this.selfCount = json.buyNum; // 发起人购买份数
                        this.status = getNameByCode(json.state, ['未满员', '已满员', '已出票', '已撤单']); // 方案状态 1、未满员 2已满员 3、已出票 4 已撤单
                        this.usersLength = json.joinNum; // 跟单人数
                        this.number = json.Numbers; // 期号
                        this.startTime = json.createDate; //方案发起时间
                        this.endTime = json.endDate; //认购截止时间
                        this.name = json.planTitle; //方案名称
                        this.type = getNameByCode(json.type, ['自购', '追号', '合买', '跟单']); // 方案类型 //1 自购 2追号 3 合买 4跟单
                        this.bonus = json.bonus; // 发起人提成
                        this.multiple = json.times; // 倍数
                        this.winningStatus = getNameByCode(json.settleType, ['未兑奖', '未中奖', '已中奖']); // 1 未兑奖 2 未中奖3 已中奖
                        this.totalAwardAmount = json.totalAward; // 总奖金
                        this.unitAwardAmount = json.perAward; // 每份奖金
                        this.balls = json.open;  // 开奖号码

                        let list = [];
                        json.bet.forEach(item => { // 投注内容
                            list.push({
                                name: item.name, // 玩法名称
                                content: item.content, // 投注内容
                                count: item.num, // 注数
                                multiple: item.times, // 倍数
                                amount: item.amount // 投注金额
                            });
                        });
                        this.bettingContent = list;

                        list = [];
                        json.user.forEach(item => { //参与用户
                            let buyList = [];
                            item.buy.forEach(subItem => {
                                buyList.push({
                                    type: subItem.type, // 参与方式
                                    time: subItem.createDate, // 购买时间
                                    amount: subItem.amount, // 购买金额
                                    status: subItem.status // 状态
                                });
                            });
                            list.push({
                                userName: item.userName, //名字
                                totalAmount: item.amount, //共计金额
                                rate: item.rate, // 比例
                                awardAmount: item.award, // 奖金
                                buyList: buyList // 该用户的所有购买记录
                            });
                        });
                        this.users = list;
                    }
                });
            },
            switchTab(tabNav){
                this.tabNav = tabNav;
            }
        }
    };
</script>
