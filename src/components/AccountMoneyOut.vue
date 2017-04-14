<template>
    <div class="oreder_oredercenter"><!-- 提现 -->
        <div class="tab" style="margin-bottom: 0">
            <a :class="{on: tabNav === 'doMoneyOut'}" @click="switchPanel('doMoneyOut')">提款现金<span class="ant-tabs-ink-bar"></span></a>
            <a :class="{on: tabNav === 'recordOfMoneyOut'}" @click="switchPanel('recordOfMoneyOut')">提款记录<span class="ant-tabs-ink-bar"></span></a>
        </div>
        <div class="content">
            <div class="tab-panel" v-show="tabNav === 'doMoneyOut'">
                <div class="account_mb_content" style="border-top: 0">
                    <p class="color4 account_aq1" style="padding-left: 60px;"><strong class="color14">温馨提示：{{ userName }}，</strong>为确保您提款能及时安全到帐,请如实填写以下信息。</p>
                    <div class="acc_Password">
                        <table>
                            <tbody>
                            <tr>
                                <td>银行卡号：</td>
                                <td>{{ bankCardNo }}(如需修改银行卡号,请联系客服。</td>
                            </tr>
                            <tr>
                                <td>当前可提现金：</td>
                                <td><span class="color4">{{ balance }}</span>元</td>
                            </tr>
                            <tr :class="{error: !!validators.amount, success: validators.amount === false}">
                                <td>提现金额：</td>
                                <td><input type="number" v-model="amount" class="input4_TureName"></td>
                                <td class="validate" v-if="validators.amount">{{ validators.amount }}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td><a class="keep_CashNum" @click="doTakeOutMoney">确定</a></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
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

    export default {
        name: 'ComAccountMoneyOut',
        data(){
            return {
                tabNav: 'doMoneyOut',
                amount: '',
                caption: '',

                validators: {
                    amount: ''
                },

                // records
                lengthPerPage: 50,

                sheetRecordOfMoneyOut: {
                    startDate: kdDateTime(kdDateObject().days(-10), 'Y-M-D'),
                    endDate: kdDateTime('', 'Y-M-D'),
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
        computed: {
            // state
            userName(){
                return this.$store.state.user.userName;
            },
            balance(){
                return this.$store.state.user.balance;
            },
            bankCardNo(){
                return this.$store.state.user.bankCardNo;
            }
        },
        watch: {
            amount(val){
                this.validateAmount(val);
            },
            tabNav(val){
                if(val === 'recordOfMoneyOut' && this.sheetRecordOfMoneyOut.list.length === 0){
                    this.fetchRecoredOfMoneyOut(1);
                }
            },
            'sheetRecordOfMoneyOut.date': {
                handler: function(val){
                    this.setDate(val, 'sheetRecordOfMoneyOut');
                },
                deep: true
            }
        },
        mounted(){
            let configs = {
                mode: 'range',
                dateFormat: "Y-m-d",
                locale: require('flatpickr/dist/l10n/zh.js').zh
            };
            
            this.sheetRecordOfMoneyOut.datepicker = new Flatpickr(this.$refs.recordOfMoneyOutDatepicker, configs);
        },
        methods: {
            // mutations

            // actions

            // methods
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
            },
            switchPanel(navId){
                this.tabNav = navId;
            },
            fetchCaption(){
                return ajax.apiFetchCaptionOfMoneyOut().then(json => {
                    if(typeof json === 'undefined') return;
                    if(json.S === 320){
                        this.caption = json.D;
                    }else{
                        this.$error({
                            content: json.S + ': ' + json.D
                        });
                    }
                });
            },
            doTakeOutMoney(){
                if(!this.validate()) return;

                let vm = this;
                return ajax.apiCreateOrderOfMoneyOut({
                    amount: this.amount,
                    agreePayFee: this.agreePayFee
                }).then(json => {
                    if(typeof json === 'undefined') return;
                    if(json.S === 310){
                        this.amount = '';
                        this.agreePayFee = '';
                        this.$success({
                            content: json.S + ': ' + json.D
                        });
                    }else if(json.S === 306 || json.S === 307){
                        this.$info({
                            title: "提醒：",
                            content: json.S + ': ' + json.D,
                            confirmButton: function(){
                                vm.agreePayFee = 1;
                                vm.doTakeOutMoney();

                                return true;
                            },
                            cancelButtonText: '取消'
                        });
                    }else{
                        this.$error({
                            content: json.S + ': ' + json.D
                        });
                    }
                });
            },

            // validators
            validate(){
                let flag = true;
                if(!this.validateAmount(this.amount)) flag = false;

                return flag;
            },
            validateAmount(val){
                if(val === ''){
                    this.validators.amount = '提现金额不能为空！';
                    return false;
                }

                this.validators.amount = false;
                return true;
            }
        }
    };
</script>
