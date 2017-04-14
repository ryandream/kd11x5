<template>
    <div class="oreder_oredercenter"><!-- 提现 -->
        <div class="tab" style="margin-bottom: 0">
            <a :class="{on: tabNav === 'balanceSheet'}" @click="switchPanel('balanceSheet')">账户明细<span class="ant-tabs-ink-bar"></span></a>
            <a :class="{on: tabNav === 'recordOfMoneyIn'}" @click="switchPanel('recordOfMoneyIn')">充值记录<span class="ant-tabs-ink-bar"></span></a>
            <a :class="{on: tabNav === 'recordOfMoneyOut'}" @click="switchPanel('recordOfMoneyOut')">提款记录<span class="ant-tabs-ink-bar"></span></a>
        </div>
        <div class="content">
            <div class="tab-panel" v-show="tabNav === 'balanceSheet'">
                <div class="search_search" style="margin-top: 15px">
                    <span class="tiqin">
                        <input type="text" placeholder="开始日期" v-model="sheetBalanceSheet.startDate" key="start-date-0">
                        <span> ~ </span>
                        <input type="text" placeholder="结束日期" v-model="sheetBalanceSheet.endDate" key="end-date-0">
                        <input v-model="sheetBalanceSheet.date" type="text" ref="balanceSheetDatepicker" class="real-date">
                    </span>
                    <button type="button" class="ant-btn-primary" @click="fetchBalanceSheet(1)"><span>查 询</span></button>
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
                                <th><span>收入</span></th>
                                <th><span>支出</span></th>
                                <th><span>余额</span></th>
                                <th><span>交易类型</span></th>
                                <th><span>备注</span></th>
                            </tr>
                        </thead>
                        <tbody class="ant-table-tbody">
                            <tr class="ant-table-row" v-if="sheetBalanceSheet.list.length === 0">
                                <td colspan="7">暂无数据</td>
                            </tr>
                            <tr class="ant-table-row" v-else v-for="(item, index) in sheetBalanceSheet.list" :data-id="item.id">
                                <td>{{ lengthPerPage * (sheetBalanceSheet.currentPage - 1) + (index + 1) }}</td>
                                <td>{{ item.time }}</td>
                                <td>{{ item.income > 0 ? item.income : '' }}</td>
                                <td>{{ item.spend > 0 ? '-' + item.spend : '' }}</td>
                                <td class="colorblue1">{{ item.balance }}</td>
                                <td>{{ item.type }}</td>
                                <td>{{ item.comment }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <mod-pager v-if="sheetBalanceSheet.list.length > 0" :currentPage="sheetBalanceSheet.currentPage" :totalPages="sheetBalanceSheet.totalPages" :totalCount="sheetBalanceSheet.totalCount" @toPage="fetchBalanceSheet" key="sheetBalanceSheet-pager"></mod-pager>
                </div>
            </div>
            <div class="tab-panel" v-show="tabNav === 'recordOfMoneyIn'">
                <div class="search_search" style="margin-top: 15px">
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
                                <td>{{ lengthPerPage * (sheetRecordOfMoneyIn.currentPage - 1) + (index + 1) }}</td>
                                <td>{{ item.time }}</td>
                                <td>{{ item.money }}</td>
                                <td>{{ item.balance }}</td>
                                <td>{{ item.type }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <mod-pager v-if="sheetRecordOfMoneyIn.list.length > 0" :currentPage="sheetRecordOfMoneyIn.currentPage" :totalPages="sheetRecordOfMoneyIn.totalPages" :totalCount="sheetRecordOfMoneyIn.totalCount" @toPage="fetchRecoredOfMoneyIn" key="sheetRecordOfMoneyIn-pager"></mod-pager>
                </div>
            </div>
            <div class="tab-panel" v-show="tabNav === 'recordOfMoneyOut'">
                <div class="search_search" style="margin-top: 15px">
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
                                <td>{{ item.type === 1 ? '已处理' : (item.type === 2 ? '已撤销' : '未处理') }}</td>
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
    import { datatype, kdDateObject, kdDateTime } from '../common/basic';
    import Flatpickr from 'flatpickr';
    import flatpickrCSS from 'flatpickr/dist/themes/material_blue.css';
 
    var startDate = kdDateTime(kdDateObject().days(-10), 'Y-M-D');
    var endDate = kdDateTime('', 'Y-M-D');
    
    export default {
        name: 'ComAccountBalanceSheet',
        data(){
            return {
                tabNav: 'balanceSheet',

                lengthPerPage: 50,

                sheetBalanceSheet: {
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
                if(val === 'balanceSheet' && this.sheetBalanceSheet.list.length === 0){
                    this.fetchBalanceSheet(1);
                }else if(val === 'recordOfMoneyIn' && this.sheetRecordOfMoneyIn.list.length === 0){
                    this.fetchRecoredOfMoneyIn(1);
                }else if(val === 'recordOfMoneyOut' && this.sheetRecordOfMoneyOut.list.length === 0){
                    this.fetchRecoredOfMoneyOut(1);
                }
            },
            'sheetBalanceSheet.date': {
                handler: function(val){
                    this.setDate(val, 'sheetBalanceSheet');
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
            this.fetchBalanceSheet(1);
        },
        mounted(){
            let configs = {
                mode: 'range',
                dateFormat: "Y-m-d",
                locale: require('flatpickr/dist/l10n/zh.js').zh
            };

            this.sheetBalanceSheet.datepicker = new Flatpickr(this.$refs.balanceSheetDatepicker, configs);
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
            fetchBalanceSheet(pageNum){// sheet a
                return ajax.apiFetchBalanceSheet({
                    currentPage: pageNum,
                    lengthPerPage: this.lengthPerPage,
                    startDate: this.sheetBalanceSheet.startDate,
                    endDate: this.sheetBalanceSheet.endDate
                }).then(json => {
                    if(typeof json === 'undefined') return;
                    if(typeof json.S !== 'undefined'){
                        console.log(json);
                        return;
                    }
                    
                    let list = [];
                    this.sheetBalanceSheet.currentPage = parseInt(json.page, 10);
                    this.sheetBalanceSheet.totalPages = parseInt(json.totalPage, 10);
                    this.sheetBalanceSheet.totalCount = parseInt(json.total, 10);
                    if(datatype(json.list) === 'array') {
                        json.list.forEach(item => {
                            list.push({
                                id: item.id, // 
                                time: item.createDate, //
                                spend: item.spend, // 支出
                                balance: item.Balance, // 余额
                                income: item.income, // 收入
                                comment: item.comment, // 备注
                                type: item.type // 类型
                            });
                        });
                    }
                    this.sheetBalanceSheet.list = list;
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
                                status: item.status, // 未处理0、已处理1、已撤销2
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
