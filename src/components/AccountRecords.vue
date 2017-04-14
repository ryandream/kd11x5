<template>
    <div class="oreder_oredercenter"><!-- 游戏记录 -->
        <div class="tab">
            <a :class="{on: tabNav === 'recordOfBetting'}" @click="switchPanel('recordOfBetting')">投注记录<span class="ant-tabs-ink-bar"></span></a>
            <a :class="{on: tabNav === 'recordOfContinueBetting'}" @click="switchPanel('recordOfContinueBetting')">追号记录<span class="ant-tabs-ink-bar"></span></a>
            <a :class="{on: tabNav === 'recordOfMoneyIn'}" @click="switchPanel('recordOfMoneyIn')">充值记录<span class="ant-tabs-ink-bar"></span></a>
            <a :class="{on: tabNav === 'recordOfMoneyOut'}" @click="switchPanel('recordOfMoneyOut')">提款记录<span class="ant-tabs-ink-bar"></span></a>
        </div>
        <div class="content">
            <div class="tab-panel" v-show="tabNav === 'recordOfBetting'">
                <div class="search_search">
                    我要筛选
                    <select v-model="sheetRecordOfBetting.gameId">
                        <option v-for="game in gameList" :value="game.id">{{ game.name }}</option>
                    </select>
                    <select v-model="sheetRecordOfBetting.status">
                        <option value="">方案状态</option>
                        <option :value="4">已撤单</option>
                        <option :value="1">未满员</option>
                        <option :value="2">已满员</option>
                        <option :value="3">已出票</option>
                    </select>
                    <select v-model="sheetRecordOfBetting.type">
                        <option value="">结算状态</option>
                        <option :value="1">未兑奖</option>
                        <option :value="2">未中奖</option>
                        <option :value="3">已中奖</option>
                    </select>
                    <span class="tiqin">
                        <input type="text" placeholder="开始日期" v-model="sheetRecordOfBetting.startDate">
                        <span> ~ </span>
                        <input type="text" placeholder="结束日期" v-model="sheetRecordOfBetting.endDate">
                        <input v-model="sheetRecordOfBetting.date" type="text" ref="recordOfBettingDatepicker" class="real-date">
                    </span>

                    <button type="button" class="ant-btn-primary" @click="fetchBettingRecords(1)"><span>查 询</span></button>
                </div>
                <div class="ant-table">
                    <table>
                        <colgroup>
                            <col>
                            <col>
                            <col>
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
                                <th><span>序号</span></th>
                                <th><span>彩种</span></th>
                                <th><span>方案类型</span></th>
                                <th><span>期号</span></th>
                                <th><span>发起人</span></th>
                                <th><span>认购金额</span></th>
                                <th><span>进度</span></th>
                                <th><span>方案状态</span></th>
                                <th><span>您的奖金</span></th>
                                <th><span>认购时间</span></th>
                                <th><span>方案详情</span></th>
                            </tr>
                        </thead>
                        <tbody class="ant-table-tbody">
                            <tr class="ant-table-row" v-if="sheetRecordOfBetting.list.length === 0">
                                <td colspan="11">暂时没有数据</td>
                            </tr>
                            <tr class="ant-table-row" v-else v-for="(item, index) in sheetRecordOfBetting.list">
                                <td>{{ lengthPerPage * (sheetRecordOfBetting.currentPage - 1) + (index + 1) }}</td>
                                <td>{{ gameList[item.gameId].name }}</td>
                                <td>{{ item.type }}</td>
                                <td>{{ item.number }}</td>
                                <td>{{ item.userName }}</td>
                                <td class="colblue">￥{{ item.totalAmount }}</td>
                                <td>{{ item.progress }}</td>
                                <td class="colred">{{ item.status }}</td>
                                <td>{{ item.awardAmount }}</td>
                                <td>{{ item.time }}</td>
                                <td><div><router-link :to="'/record-detail-of-betting/' + item.gameId + '/' + item.id">详情</router-link></div></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="ant-table-footer" v-if="sheetRecordOfBetting.list.length > 0">
                    <span>统计</span>
                    <span>￥ {{ sheetRecordOfBetting.totalAmount }}</span>
                    <span>￥ {{ sheetRecordOfBetting.totalAwardAmount }}</span>
                </div>
                <mod-pager v-if="sheetRecordOfBetting.list.length > 0" :currentPage="sheetRecordOfBetting.currentPage" :totalPages="sheetRecordOfBetting.totalPages" :totalCount="sheetRecordOfBetting.totalCount" @toPage="fetchBettingRecords" key="sheetRecordOfBetting-pager"></mod-pager>
            </div>
            <div class="tab-panel" v-show="tabNav === 'recordOfContinueBetting'">
                <div class="search_search">
                    我要筛选
                    <select v-model="sheetRecordOfContinueBetting.gameId">
                        <option v-for="game in gameList" :value="game.id">{{ game.name }}</option>
                    </select>
                    <select v-model="sheetRecordOfContinueBetting.status">
                        <option value="">全部</option>
                        <option :value="1">进行中</option>
                        <option :value="2">已完成</option>
                        <option :value="3">已终止</option>
                    </select>
                    <span class="tiqin">
                        <input type="text" placeholder="开始日期" v-model="sheetRecordOfContinueBetting.startDate" key="start-date-2">
                        <span> ~ </span>
                        <input type="text" placeholder="结束日期" v-model="sheetRecordOfContinueBetting.endDate" key="end-date-2">
                        <input v-model="sheetRecordOfContinueBetting.date" type="text" ref="recordOfContinueBettingDatepicker" class="real-date">
                    </span>
                    <button type="button" class="ant-btn-primary" @click="fetchContinuousBettingRecords(1)"><span>查 询</span></button>
                </div>
                <div class="ant-table">
                    <table>
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
                                <th><span>序号</span></th>
                                <th><span>彩种</span></th>
                                <th><span>发起时间</span></th>
                                <th><span>总金额</span></th>
                                <th><span>已完成期数/总期数</span></th>
                                <th><span>取消期数</span></th>
                                <th><span>状态</span></th>
                                <th><span>追号详情</span></th>
                            </tr>
                        </thead>
                        <tbody class="ant-table-tbody">
                            <tr class="ant-table-row" v-if="sheetRecordOfContinueBetting.list.length === 0">
                                <td colspan="8">暂无数据</td>
                            </tr>
                            <tr class="ant-table-row" v-else v-for="(item, index) in sheetRecordOfContinueBetting.list" :data-id="item.id">
                                <td>{{ lengthPerPage * (sheetRecordOfContinueBetting.currentPage - 1) + (index + 1) }}</td>
                                <td>{{ gameList[item.gameId].name }}</td>
                                <td>{{ item.time }}</td>
                                <td class="colorred">{{ item.amount }}</td>
                                <td class="colorblue">{{ item.finishedNumbersLength }}/{{ item.totalNumbersLength }}</td>
                                <td>{{ item.cancelNumbersLength }}</td>
                                <td>{{ item.status }}</td>
                                <td><router-link :to="'/record-detail-of-continous-betting/' + item.gameId + '/' + item.id">详情</router-link></td>
                            </tr>
                        </tbody>
                    </table>
                    <mod-pager v-if="sheetRecordOfContinueBetting.list.length > 0" :currentPage="sheetRecordOfContinueBetting.currentPage" :totalPages="sheetRecordOfContinueBetting.totalPages" :totalCount="sheetRecordOfContinueBetting.totalCount" @toPage="fetchContinuousBettingRecords" key="sheetRecordOfContinueBetting-pager"></mod-pager>
                </div>
            </div>
            <div class="tab-panel" v-show="tabNav === 'recordOfMoneyIn'">
                <div class="search_search">
                    <span class="tiqin">
                        <input type="text" placeholder="开始日期" v-model="sheetRecordOfMoneyIn.startDate" key="start-date-1">
                        <span> ~ </span>
                        <input type="text" placeholder="结束日期" v-model="sheetRecordOfMoneyIn.endDate" key="end-date-1">
                        <input v-model="sheetRecordOfMoneyIn.date" type="text" ref="recordOfMoneyInDatepicker" class="real-date">
                    </span>
                    <button type="button" class="ant-btn-primary" @click="fetchRecoredOfMoneyIn(1)"><span>查 询</span></button>
                </div>
                <div class="ant-table">
                    <table>
                        <colgroup>
                            <col>
                            <col>
                            <col>
                            <col>
                            <col>
                        </colgroup>
                        <thead class="ant-table-thead">
                            <tr>
                                <th><span>序号</span></th>
                                <th><span>交易时间</span></th>
                                <th><span>充值金额</span></th>
                                <th><span>余额</span></th>
                                <th><span>充值渠道</span></th>
                            </tr>
                        </thead>
                        <tbody class="ant-table-tbody">
                            <tr class="ant-table-row" v-if="sheetRecordOfMoneyIn.list.length === 0">
                                <td colspan="5">暂无数据</td>
                            </tr>
                            <tr class="ant-table-row" v-else v-for="(item, index) in sheetRecordOfMoneyIn.list" :data-id="item.id">
                                <td>{{ lengthPerPage * (sheetRecordOfMoneyIn.currentPage - 1) * (index + 1) }}</td>
                                <td>{{ item.time }}</td>
                                <td class="colorblue1">{{ item.money }}</td>
                                <td class="colorblue1">{{ item.balance }}</td>
                                <td>{{ item.type }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <mod-pager v-if="sheetRecordOfMoneyIn.list.length > 0" :currentPage="sheetRecordOfMoneyIn.currentPage" :totalPages="sheetRecordOfMoneyIn.totalPages" :totalCount="sheetRecordOfMoneyIn.totalCount" @toPage="fetchRecoredOfMoneyIn" key="sheetRecordOfMoneyIn-pager"></mod-pager>
                </div>
            </div>
            <div class="tab-panel" v-show="tabNav === 'recordOfMoneyOut'">
                <div class="search_search">
                    <span class="tiqin">
                        <input type="text" placeholder="开始日期" v-model="sheetRecordOfMoneyOut.startDate" key="start-date-2">
                        <span> ~ </span>
                        <input type="text" placeholder="结束日期" v-model="sheetRecordOfMoneyOut.endDate" key="end-date-2">
                        <input v-model="sheetRecordOfMoneyOut.date" type="text" ref="recordOfMoneyOutDatepicker" class="real-date">
                    </span>
                    <button type="button" class="ant-btn-primary" @click="fetchRecoredOfMoneyOut(1)"><span>查 询</span></button>
                </div>
                <div class="ant-table">
                    <table>
                        <colgroup>
                            <col>
                            <col>
                            <col>
                            <col>
                            <col>
                            <col>
                        </colgroup>
                        <thead class="ant-table-thead">
                            <tr>
                                <th><span>序号</span></th>
                                <th><span>交易时间</span></th>
                                <th><span>提现金额</span></th>
                                <th><span>余额</span></th>
                                <th><span>状态</span></th>
                                <th><span>备注</span></th>
                            </tr>
                        </thead>
                        <tbody class="ant-table-tbody">
                            <tr class="ant-table-row" v-if="sheetRecordOfMoneyOut.list.length === 0">
                                <td colspan="6">暂无数据</td>
                            </tr>
                            <tr class="ant-table-row" v-else v-for="(item, index) in sheetRecordOfMoneyOut.list" :data-id="item.id">
                                <td>{{ lengthPerPage * (sheetRecordOfMoneyOut.currentPage - 1) + (index + 1) }}</td>
                                <td>{{ item.time }}</td>
                                <td>{{ item.amount }}</td>
                                <td>{{ item.balance }}</td>
                                <td>{{ item.status }}</td>
                                <td>{{ item.comment }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <mod-pager v-if="sheetRecordOfMoneyOut.list.length > 0" :currentPage="sheetRecordOfMoneyOut.currentPage" :totalPages="sheetRecordOfMoneyOut.totalPages" :totalCount="sheetRecordOfMoneyOut.totalCount" @toPage="fetchRecoredOfMoneyOut" key="sheetRecordOfMoneyOut-pager"></mod-pager>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import * as ajax from '../api';
    import { datatype, kdDateObject, kdDateTime, isNumberic, getNameByCode } from '../common/basic';
    import gameBasic from '../mixins/gameBasic';
    import Flatpickr from 'flatpickr';
    import flatpickrCSS from 'flatpickr/dist/themes/material_blue.css';

    var startDate = kdDateTime(kdDateObject().days(-10), 'Y-M-D');
    var endDate = kdDateTime('', 'Y-M-D');

    export default {
        name: 'ComAccountRecords',
        mixins: [gameBasic],
        data(){
            return {
                tabNav: 'recordOfBetting',

                lengthPerPage: 50,

                sheetRecordOfBetting: {
                    gameId: 'sd', // 游戏类型
                    status: '', // 方案状态
                    type: '', // 结算状态
                    startDate: startDate,
                    endDate: endDate,
                    date: '',
                    datepicker: null,
                    list: [],
                    currentPage: 1,
                    totalPages: 1,
                    totalCount: 0,
                    totalAmount: 0,
                    totalAwardAmount: 0
                },
                sheetRecordOfContinueBetting: {
                    gameId: 'sd',
                    status: '',
                    startDate: startDate,
                    endDate: endDate,
                    date: '',
                    datepicker: null,
                    list: [],
                    currentPage: 1,
                    totalPages: 1,
                    totalCount: 0
                },
                sheetRecordOfMoneyIn: {
                    startDate: startDate,
                    endDate: endDate,
                    date: '',
                    datepicker: null,
                    list: [],
                    currentPage: 1,
                    totalPages: 1,
                    totalCount: 0
                },
                sheetRecordOfMoneyOut: {
                    startDate: startDate,
                    endDate: endDate,
                    date: '',
                    datepicker: null,
                    status: '',
                    list: [],
                    currentPage: 1,
                    totalPages: 1,
                    totalCount: 0
                }
            };
        },
        watch: {
            tabNav(val){
                if(val === 'recordOfBetting' && this.sheetRecordOfBetting.list.length === 0){
                    this.fetchBettingRecords(1);
                }else if(val === 'recordOfContinueBetting' && this.sheetRecordOfContinueBetting.list.length === 0){
                    this.fetchContinuousBettingRecords(1);
                }else if(val === 'recordOfMoneyIn' && this.sheetRecordOfMoneyIn.list.length === 0){
                    this.fetchRecoredOfMoneyIn(1);
                }else if(val === 'recordOfMoneyOut' && this.sheetRecordOfMoneyOut.list.length === 0){
                    this.fetchRecoredOfMoneyOut(1);
                }
            },
            '$route'(to, from){
                if(to.query.buy){
                    this.switchPanel('recordOfBetting');
                }else if(to.query.continue){
                    this.switchPanel('recordOfContinueBetting');
                }
            },
            'sheetRecordOfBetting.date': {
                handler: function(val){
                    this.setDate(val, 'sheetRecordOfBetting');
                },
                deep: true
            },
            'sheetRecordOfContinueBetting.date': {
                handler: function(val){
                    this.setDate(val, 'sheetRecordOfContinueBetting');
                },
                deep: true
            },
            'sheetRecordOfMoneyIn.date': {
                handler: function(val){
                    this.setDate(val, 'sheetRecordOfMoneyIn');
                },
                deep: true
            },
            'sheetRecordOfMoneyOut.date': {
                handler: function(val){
                    this.setDate(val, 'sheetRecordOfMoneyOut');
                },
                deep: true
            }
        },
        created(){
            if(this.$route.query.continue){
                this.switchPanel('recordOfContinueBetting');
            }
            this.fetchBettingRecords(1);
        },
        mounted(){
            let configs = {
                mode: 'range',
                dateFormat: "Y-m-d",
                locale: require('flatpickr/dist/l10n/zh.js').zh
            };

            this.sheetRecordOfBetting.datepicker = new Flatpickr(this.$refs.recordOfBettingDatepicker, configs);
            this.sheetRecordOfContinueBetting.datepicker = new Flatpickr(this.$refs.recordOfContinueBettingDatepicker, configs);
            this.sheetRecordOfMoneyIn.datepicker = new Flatpickr(this.$refs.recordOfMoneyInDatepicker, configs);
            this.sheetRecordOfMoneyOut.datepicker = new Flatpickr(this.$refs.recordOfMoneyOutDatepicker, configs);
        },
        methods: {
            setDate(date, type){
                let dates = [];
                if(date.indexOf('to') > -1){
                    dates = date.split(' to ');
                }else{
                    dates = [date, ''];
                }
                this[type].startDate = dates[0];
                this[type].endDate = dates[1];
            },
            switchPanel(navId){
                this.tabNav = navId;
            },
            fetchBettingRecords(pageNum){
                return ajax.apiFetchBettingRecords({
                    currentPage: pageNum,
                    lengthPerPage: this.lengthPerPage,
                    startDate: this.sheetRecordOfBetting.startDate,
                    endDate: this.sheetRecordOfBetting.endDate,
                    gameId: this.sheetRecordOfBetting.gameId,
                    status: this.sheetRecordOfBetting.status,
                    type: this.sheetRecordOfBetting.type
                }).then(json => {
                    if(typeof json === 'undefined') return;
                    if(typeof json.S !== 'undefined'){
                        console.log(json);
                        return;
                    }

                    let list = [], totalAmount = 0, totalAwardAmount = 0;
                    this.sheetRecordOfBetting.currentPage = parseInt(json.page, 10);
                    this.sheetRecordOfBetting.totalPages = parseInt(json.totalPage, 10);
                    this.sheetRecordOfBetting.totalCount = parseInt(json.total, 10);
                    if(datatype(json.list) === 'array') {
                        json.list.forEach(item => {
                            list.push({
                                id: item.planId, // 投注记录ID
                                userName: item.User_Name, // 发起人，用户名
                                gameId: item.gameNo, // 游戏编码
                                progress: item.progress, // 进度
                                status: getNameByCode(item.state, ['未满员', '已满员', '已出票', '已撤单']), // 方案状态 1 未满员 2 已满员 3 已出票 4 已撤单
                                number: item.Numbers, // 期号
                                time: item.createDate, // 创建时间
                                type: getNameByCode(item.type, ['自购', '追号', '合买', '跟单']), // 方案类型，1自购 2追号 3合买 4跟单
                                totalAmount: item.buyAmount, // 认购金额
                                awardAmount: item.awardAmount // 中奖金额
                            });
                            totalAmount += item.buyAmount;
                            totalAwardAmount += isNumberic(item.awardAmount) ? item.awardAmount : 0;
                        });
                    }
                    this.sheetRecordOfBetting.list = list;
                    this.sheetRecordOfBetting.totalAmount = totalAmount;
                    this.sheetRecordOfBetting.totalAwardAmount = totalAwardAmount;
                });
            },
            fetchContinuousBettingRecords(pageNum){
                return ajax.apiFetchContinuousBettingRecords({
                    currentPage: pageNum,
                    lengthPerPage: this.lengthPerPage,
                    startDate: this.sheetRecordOfContinueBetting.startDate,
                    endDate: this.sheetRecordOfContinueBetting.endDate,
                    gameId: this.sheetRecordOfContinueBetting.gameId,
                    status: this.sheetRecordOfContinueBetting.status
                }).then(json => {
                    if(typeof json === 'undefined') return;
                    if(typeof json.S !== 'undefined'){
                        console.log(json);
                        return;
                    }

                    let list = [];
                    this.sheetRecordOfContinueBetting.currentPage = parseInt(json.page, 10);
                    this.sheetRecordOfContinueBetting.totalPages = parseInt(json.totalPage, 10);
                    this.sheetRecordOfContinueBetting.totalCount = parseInt(json.total, 10);
                    if(datatype(json.list) === 'array') {
                        json.list.forEach(item => {
                            list.push({
                                id: item.planId, // id
                                amount: item.amount, // 总金额
                                gameId: item.gameNo, //游戏编码
                                status: getNameByCode(item.state, ['进行中', '已完成', '已终止']), //状态 1 进行中 2. 已完成 3 已终止
                                time: item.createDate,
                                finishedNumbersLength: item.finishNum, //已完成期数
                                totalNumbersLength: item.total, //总期数
                                cancelNumbersLength: item.cancelNum //取消期数
                            });
                        });
                    }
                    this.sheetRecordOfContinueBetting.list = list;
                });
            },
            fetchRecoredOfMoneyIn(pageNum){ // sheet b
                return ajax.apiFetchRecoredOfMoneyIn({
                    currentPage: pageNum,
                    lengthPerPage: this.lengthPerPage,
                    startDate: this.sheetRecordOfMoneyIn.startDate,
                    endDate: this.sheetRecordOfMoneyIn.endDate
                }).then(json => {
                    if(typeof json === 'undefined') return;
                    if(typeof json.S !== 'undefined'){
                        console.log(json);
                        return;
                    }

                    let list = [];
                    this.sheetRecordOfMoneyIn.currentPage = parseInt(json.page, 10);
                    this.sheetRecordOfMoneyIn.totalPages = parseInt(json.totalPage, 10);
                    this.sheetRecordOfMoneyIn.totalCount = parseInt(json.total, 10);
                    if(datatype(json.list) === 'array') {
                        json.list.forEach(item => {
                            list.push({
                                id: item.id, // 
                                time: item.createDate, //
                                balance: item.Balance, // 余额
                                money: item.money, // 收入
                                type: item.Type // 类型
                            });
                        });
                    }
                    this.sheetRecordOfMoneyIn.list = list;
                });
            },
            fetchRecoredOfMoneyOut(pageNum){
                return ajax.apiFetchRecoredOfMoneyOut({
                    currentPage: pageNum,
                    lengthPerPage: this.lengthPerPage,
                    startDate: this.sheetRecordOfMoneyOut.startDate,
                    endDate: this.sheetRecordOfMoneyOut.endDate,
                    status: this.sheetRecordOfMoneyOut.status
                }).then(json => {
                    if(typeof json === 'undefined') return;
                    if(typeof json.S !== 'undefined'){
                        console.log(json);
                        return;
                    }
                    
                    let list = [];
                    this.sheetRecordOfMoneyOut.currentPage = parseInt(json.page, 10);
                    this.sheetRecordOfMoneyOut.totalPages = parseInt(json.totalPage, 10);
                    this.sheetRecordOfMoneyOut.totalCount = parseInt(json.total, 10);
                    if(datatype(json.list) === 'array') {
                        json.list.forEach(item => {
                            list.push({
                                id: item.id, // 
                                time: item.createDate, //
                                amount: item.realAmount, // 提现金额
                                balance: item.Balance,
                                status: getNameByCode(item.status, ['未处理', '已处理', '已撤销'], 0), // 未处理0、已处理1、已撤销2
                                comment: item.comment
                            });
                        });
                    }
                    this.sheetRecordOfMoneyOut.list = list;
                });
            }
        }
    };
</script>

