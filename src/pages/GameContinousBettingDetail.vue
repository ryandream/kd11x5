<template>
    <main class="kd-body">
        <div class="content_styles">
            <div class="continous-title">追号详情</div>
            <div class="continous-userinfo">
                追号用户： {{ userName }}
                <span>玩法名称： {{ gameName }}</span>
            </div>
            <div class="table_styles">
                <div class=" clearfix">
                    <div class="ant-table">
                        <div class="ant-table-title tit"><b>方案信息</b></div>
                        <div class="ant-table-content">
                            <table width="100%" class="zhui_table">
                                <colgroup>
                                    <col>
                                    <col>
                                    <col>
                                    <col>
                                    <col>
                                </colgroup>
                                <thead class="ant-table-thead11">
                                    <tr>
                                        <th><span>追号类型</span></th>
                                        <th><span>总追号金额</span></th>
                                        <th><span>已完成期数/总期数</span></th>
                                        <th><span>已取消期数</span></th>
                                        <th><span>中奖后停止</span></th>
                                    </tr>
                                </thead>
                                <tbody class="ant-table-tbody1">
                                    <tr class="ant-table-row">
                                        <td>{{ type }}</td>
                                        <td>￥{{ amount }}</td>
                                        <td>{{ finishedNumbersLength }}/{{ totalNumbersLength }}</td>
                                        <td>{{ cancelNumbersLength }}</td>
                                        <td>{{ isStopAfterWin }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class=" clearfix">
                    <div class="ant-table">
                        <div class="ant-table-title colorgreen tit"><b>投注内容</b></div>
                        <div class="ant-table-content zhuf">
                            <ul class="ant-card-body" v-if="bettingContent.length > 0">
                                <li v-for="item in bettingContent">
                                    <span style="width:7%;display:inline-block">{{ item.name }}<small class="red">{{ item.content }}</small></span>
                                    <span>
                                        注数：
                                        <small class="red">{{ item.count }}</small>注&nbsp;&nbsp;&nbsp;&nbsp;倍数：
                                        <small class="red">{{ item.multiple }}</small>&nbsp;&nbsp;&nbsp;&nbsp;本注金额：
                                        <small class="red">￥{{ item.amount }}</small>
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class=" clearfix">
                    <div class="ant-table">
                        <div class="ant-table-title tit"><b>追号详情</b></div>
                        <div class="ant-table-content">
                            <table width="100%" v-if="continousDetail.length > 0" class="zhui_table">
                                <colgroup>
                                    <col>
                                    <col>
                                    <col>
                                    <col>
                                    <col>
                                    <col>
                                    <col>
                                </colgroup>
                                <thead class="ant-table-thead11">
                                    <tr>
                                        <th><span>序号</span></th>
                                        <th><span>期号</span></th>
                                        <th><span>倍数</span></th>
                                        <th><span>金额</span></th>
                                        <th><span>开奖号码</span></th>
                                        <th><span>状态</span></th>
                                        <th><span>税前奖金</span></th>
                                    </tr>
                                </thead>
                                <tbody class="ant-table-tbody2">
                                    <tr class="ant-table-row" v-for="(item, index) in continousDetail">
                                        <td>{{ index + 1 }}</td>
                                        <td>{{ item.number }}</td>
                                        <td>{{ item.multiple }}</td>
                                        <td>￥{{ item.amount }}</td>
                                        <td>-</td>
                                        <td>{{ item.betStatus ? '已投注' : '未投注' }}</td>
                                        <td>￥{{ item.awardAmount }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
    import * as ajax from '../api';
    import { datatype } from '../common/basic';
    import gameBasic from '../mixins/gameBasic';

    export default {
        name: 'ComAccountRecordDetailOfContinousBetting',
        mixins: [gameBasic],
        data(){
            return {
                userName: '', // 追号用户
                gameName: '', // 游戏名称
                
                type: '', // 追号类型
                amount: 0, // 总追号金额
                
                finishedNumbersLength: 0, // 已完成期数
                totalNumbersLength: 0, // 总期数
                cancelNumbersLength: 0, // 已取消期数
                isStopAfterWin: 0, // 中奖后停止

                bettingContent: [], // 投注内容

                continousDetail: [] // 追号详情
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
            this.fetchDetailOfContinuousBettingRecord();
        },
        methods: {
            fetchDetailOfContinuousBettingRecord(){
                return ajax.apiFetchDetailOfContinuousBettingRecord({
                    id: this.id,
                    gameId: this.gameId
                }).then(json => {
                    if(typeof json === 'undefined') return;
                    if(typeof json.S !== 'undefined'){
                        console.log(json);
                        return;
                    }
                    
                    this.userName = json.userName; // 追号用户
                    this.gameName = this.gameList[json.gameNo].name; // 游戏编码
                    
                    this.type = json.type; // 追号类型
                    this.amount = json.amount; // 总追号金额
                    this.finishedNumbersLength = json.finishNum; // 已完成期数
                    this.totalNumbersLength = json.totalNum; // 总期数
                    this.cancelNumbersLength = json.cancelNum; // 已取消期数
                    this.isStopAfterWin = json.isStop; // 中奖后停止
                    
                    let list = [];
                    if(datatype(json.bet) === 'array'){
                        json.bet.forEach(item => { // 投注内容
                            list.push({
                                name: item.name, // 玩法名称
                                content: item.content, // 投注内容
                                count: item.num, // 注数
                                multiple: item.times, // 倍数
                                amount: item.amount // 投注金额
                            });
                        });
                    }
                    this.bettingContent = list;
                    list = [];
                    if(datatype(json.detail) === 'array'){
                        json.detail.forEach(item => { // 追号详情
                            list.push({
                                number: item.Numbers, // 期号
                                multiple: item.times, // 倍数
                                betStatus: item.isBet, // 是否投注, 1已投注，0未投注
                                amount: item.amount, // 金额
                                awardAmount: item.award // 中奖
                            });
                        });
                    }
                    this.continousDetail = list;
                });
            }
        }
    };
</script>
