<template>
    <div class="contentright_openright">
        <div class="opentitleright_openright">{{ gameName }}</div>
        <div class="selectresult_openright">
            <div class="opentermnum_openright">
                <div class="ant-input-number">
                    <input placeholder="请输入开始期号" class="ant-input-number-input" v-model="startNumber">
                </div>
                <span>至</span>
                <div class="ant-input-number">
                    <input placeholder="请输入结束期号" class="ant-input-number-input" v-model="endNumber">
                </div>
                <span>期</span>
                <button type="button" class="ant-btn-primary" @click="searchByIssues(1)"><span>查 询</span></button>
                <div class="ant-input-number" v-show="!viewByDigit">
                    <input type="text" placeholder="请选择日期" class="ant-input-number-input" v-model="date" ref="date">
                </div>
                <button type="button" class="ant-btn-primary" v-show="!viewByDigit" @click="searchByDate(1)"><span>查 询</span></button>
            </div>
            <div class="openterm" v-show="viewByDigit">
                <button type="button" class="ant-btn-primary dfdf" @click="searchByDigit(30)"><span>近30期</span></button><button type="button" class="ant-btn-primary dfdf_1" @click="searchByDigit(50)"><span>近50期</span></button><button type="button" class="ant-btn-primary dfdf_2" @click="searchByDigit(100)"><span>近100期</span></button>
            </div>

        </div>
        <div class="ant-table history_table">
            <div class="ant-table-body">
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
                        <th><span>日期</span></th>
                        <th><span>期号</span></th>
                        <th><span>开奖结果</span></th>
                        <th colspan="3"><span>和值</span></th>
                    </tr>
                    </thead>
                    <tbody class="ant-table-tbody">
                        <tr class="ant-table-row" v-if="history.list.length === 0">
                            <td colspan="6">没有数据</td>
                        </tr>
                        <tr class="ant-table-row" v-else v-for="(item, index) in history.list">
                            <td><a href="#">{{ item.time }}</a></td>
                            <td>{{ item.number }}</td>
                            <td class="colorred"><b>{{ item.balls }}</b></td>
                            <td class="colorred">{{ andValues[index].andValue }}</td>
                            <td><em :class="andValues[index].largeOrSmall.class">{{ andValues[index].largeOrSmall.name }}</em></td>
                            <td><em :class="andValues[index].oddOrEven.class">{{ andValues[index].oddOrEven.name }}</em></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <mod-pager v-if="history.list.length > 0 && !viewByDigit" :currentPage="history.currentPage" :totalPages="history.totalPages" :totalCount="history.totalCount" @toPage="fetchLotteryHistory" key="history-pager"></mod-pager>
    </div>
</template>

<script>
    import * as ajax from '../api';
    import { datatype, kdDateTime } from '../common/basic';
    import { largeOrSmallOfAndValue, oddOrEvenOfAndValue } from '../common/Lottery';
    import gameBasic from '../mixins/gameBasic';
    import Flatpickr from 'flatpickr';
    import flatpickrCSS from 'flatpickr/dist/themes/material_blue.css';

    export default {
        name: 'HistoryBody',
        mixins: [gameBasic],
        props: {
            viewByDigit: {
                type: Boolean,
                default: false
            }
        },
        data(){
            return {
                datepicker: null,
                searchType: 'date',

                startNumber: '',
                endNumber: '',
                date: kdDateTime('', 'Y-M-D'),

                lengthPerPage: 50,
                history: {
                    list: [],
                    currentPage: 1,
                    totalPages: 1,
                    totalCount: 0
                },

                validators: {
                    startNumber: '',
                    endNumber: '',
                    date: ''
                }
            };
        },
        computed: {
            // state
            gameName(){
                return this.currentGame.name;
            },

            // computed
            andValues(){
                let list = [], andValue, ls, oe;
                this.history.list.forEach(item => {
                    andValue = 0;
                    item.balls.split(',').forEach(ball => {
                        ball = parseInt(ball, 10);
                        andValue += isNaN(ball) ? 0 : ball;
                    });
                    ls = largeOrSmallOfAndValue(andValue);
                    oe = oddOrEvenOfAndValue(andValue);
                    list.push({
                        andValue: andValue,
                        largeOrSmall: ls,
                        oddOrEven: oe
                    });
                });
                return list;
            }
        },
        watch: {
            '$route'(to, from){
                this.searchByDate(1);
            }
        },
        created(){
            this.searchByDate(1);
        },
        mounted(){
            this.datepicker = new Flatpickr(this.$refs.date, {
                dateFormat: "Y-m-d",
                locale: require('flatpickr/dist/l10n/zh.js').zh
            });
        },
        methods: {
            fetchLotteryHistory(pageNum, type, lengthPerPage){
                if(type){
                    this.searchType = type;
                }
                return ajax.apiFetchLotteryHistory({
                    gameId: this.currentGame.id,
                    currentPage: pageNum,
                    lengthPerPage: lengthPerPage || this.lengthPerPage,
                    startNumber: !lengthPerPage && this.searchType === 'issue' ? this.startNumber : '',
                    endNumber: !lengthPerPage && this.searchType === 'issue' ? this.endNumber : '',
                    date: !lengthPerPage && this.searchType === 'date' ? this.date : ''
                }).then(json => {
                    if(typeof json === 'undefined') return;
                    if(typeof json.S !== 'undefined'){
                        console.log(json);
                        return;
                    }

                    let list = [];
                    this.history.currentPage = parseInt(json.page, 10);
                    this.history.totalPages = parseInt(json.totalPage, 10);
                    this.history.totalCount = parseInt(json.total, 10);
                    if(datatype(json.list) === 'array'){
                        json.list.forEach(item => {
                            list.push({
                                number: item.NUMBER,
                                balls: item.OPEN_NUMBER,
                                time: item.OPEN_TIME
                            });
                        });
                    }
                    this.history.list = list;
                });
            },
            searchByIssues(pageNum){
                if(!this.validateStartNumber(this.startNumber)){
                    this.$error({
                        content: this.validators.startNumber
                    });
                    return false;
                }
                if(!this.validateEndNumber(this.endNumber)){
                    this.$error({
                        content: this.validators.endNumber
                    });
                    return false;
                }
                this.fetchLotteryHistory(pageNum, 'issue');
            },
            searchByDate(pageNum){
                if(!this.validateDate(this.date)){
                    this.$error({
                        content: this.validators.date
                    });
                    return false;
                }
                this.fetchLotteryHistory(pageNum, 'date');
            },
            searchByDigit(number){
                this.fetchLotteryHistory(1, '', number);
            },

            // validators
            validateStartNumber(val){
                if(val === ''){
                    this.validators.startNumber = '开始期号不能放空！';
                    return false;
                }else if(!/^2\d{9}$/.test(val)){// 2000年及3000年以内的才是合格的期号
                    this.validators.startNumber = "开始期号格式不正确！";
                    return false;
                }
                this.validators.startNumber = false;
                return true;
            },
            validateEndNumber(val){
                if(val === ''){
                    this.validators.endNumber = '结束期号不能放空！';
                    return false;
                }else if(!/^2\d{9}$/.test(val)){// 2000年及3000年以内的才是合格的期号
                    this.validators.endNumber = "结束期号格式不正确！";
                    return false;
                }
                this.validators.endNumber = false;
                return true;
            },
            validateDate(val){
                if(val === ''){
                    this.validators.date = '日期不能放空！';
                    return false;
                }else if(!/^2\d{3}\-\d{2}\-\d{2}$/.test(val)){
                    this.validators.date = '日期格式不正确！';
                    return false;
                }
                this.validators.date = false;
                return true;
            }
        }
    };
</script>
