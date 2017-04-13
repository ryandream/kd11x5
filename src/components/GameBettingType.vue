<template>
    <div class="buytype_BuyType">
        <div class="tabviewer_Tab">
            <label>购买方式:</label>
            <span>
                <span>
                    <input type="radio" id="input-checkbox-item-buyType-0" v-model="type" :value="0">
                    <label type="false" for="input-checkbox-item-buyType-0">我要自购</label>
                </span>
                <span>
                    <input type="radio" id="input-checkbox-item-buyType-1" v-model="type" :value="1">
                    <label type="false" for="input-checkbox-item-buyType-1">我要合买</label>
                </span>
                <span>
                    <input type="radio" id="input-checkbox-item-buyType-2" v-model="type" :value="2">
                    <label type="false" for="input-checkbox-item-buyType-2">我要追号</label>
                </span>
            </span>
        </div>
        <div class="buy-type-panel" v-if="type === 0">当前期号:<span class="red">{{ currentLottery.number }}</span></div>
        <div class="buy-type-panel" v-show="type === 1">
            <table class="form_Form">
                <tbody>
                    <tr class="colunm_Form">
                        <td :class="{error: !!validators.totalCount, success: validators.totalCount === false}">
                            <div class="Inputer_6u">
                                <label>我 要 分 成 :</label>
                                <input type="text" class="input_NumberInput" v-model.number.trim.lazy="togetherBuyPlan.totalCount"><span> 份</span>
                                <span class="sub_Inputer">每份<span class="red">{{ (amountOfEachPlan || 0).toFixed(2) }}</span>元</span>
                                <small class="notice_Inputer_3OXCo">每份至少1元</small>
                            </div>
                            <div class="validate" v-if="validators.totalCount">{{ validators.totalCount }}</div>
                        </td>
                    </tr>
                    <tr class="colunm_Form">
                        <td :class="{error: !!validators.selfCount, success: validators.selfCount === false}">
                            <div class="Inputer_6u">
                                <label>我 要 认 购 :</label>
                                <input type="text" class="input_NumberInput" v-model.number.trim.lazy="togetherBuyPlan.selfCount"><span> 份</span>
                                <span class="sub_Inputer">认购<span class="red">{{ ((amountOfEachPlan * togetherBuyPlan.selfCount) || 0).toFixed(2) }}</span>元</span>
                                <small class="notice_Inputer_3OXCo">至少认购10%</small>
                            </div>
                            <div class="validate" v-if="validators.selfCount">{{ validators.selfCount }}</div>
                        </td>
                    </tr>
                    <tr class="colunm_Form">
                        <td :class="{error: !!validators.keepCount, success: validators.keepCount === false}">
                            <div class="Inputer_6u">
                                <label>我 要 保 底 :</label>
                                <input type="text" class="input_NumberInput" v-model.number.trim.lazy="togetherBuyPlan.keepCount"><span> 份</span>
                                <span class="sub_Inputer">保底<span class="red">{{ ((amountOfEachPlan * togetherBuyPlan.keepCount) || 0).toFixed(2) }}</span>元</span>
                                <small class="notice_Inputer_3OXCo">保底资金会冻结，截止后最大限度促成方案</small>
                            </div>
                            <div class="validate" v-if="validators.keepCount">{{ validators.keepCount }}</div>
                        </td>
                    </tr>
                    <tr class="colunm_Form">
                        <td>
                            <div class="Inputer_6u">
                                <label>方 案 设 置 :</label>
                                <select v-model="togetherBuyPlan.publicType">
                                    <option :value="0">仅发单人可看</option>
                                    <option :value="1">立即公开</option>
                                    <option :value="2">截止后公开</option>
                                    <option :value="3">截止后对跟单人公开</option>
                                </select>
                            </div>
                        </td>
                    </tr>
                    <tr class="colunm_Form">
                        <td :class="{error: !!validators.title, success: validators.title === false}">
                            <div class="Inputer_6u">
                                <label>方 案 标 题 :</label>
                                <input type="text" v-model.trim="togetherBuyPlan.title" placeholder="请输入不超过15个字的方案标题">
                            </div>
                            <div class="validate" v-if="validators.title">{{ validators.title }}</div>
                        </td>
                    </tr>
                    <tr class="colunm_Form">
                        <td :class="{error: !!validators.info, success: validators.info === false}">
                            <div class="Inputer_6u">
                                <label style=" display:block;width:72px;height: 60px; float: left">方 案 描 述 :</label>
                                <textarea  v-model.trim="togetherBuyPlan.info" placeholder="请输入不超过30个字的方案描述" style="width: 400px;height: 60px;float: left"></textarea>
                            </div>
                            <div class="validate" v-if="validators.info">{{ validators.info }}</div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="buy-type-panel" v-show="type === 2">
            <div class="ant-form-item">
                <label>追号期数</label>
                <label><input type="radio" v-model="numbersLength" class="ant-radio-input" :value="5"><span>5</span></label>
                <label><input type="radio" v-model="numbersLength" class="ant-radio-input" :value="10"><span>10</span></label>
                <label><input type="radio" v-model="numbersLength" class="ant-radio-input" :value="20"><span>20</span></label>
                <label><input type="radio" v-model="numbersLength" class="ant-radio-input" :value="50"><span>50</span></label>
                <label><input type="radio" v-model="numbersLength" class="ant-radio-input" :value="0"><span>其它</span></label>
                <input class="ant-input-number-input" v-model.trim.number="customNumbersLength" v-if="numbersLength === 0">
            </div>
            <div style="margin-bottom: 16px;">
                <span style="margin-left: 8px;">追<span class="red">{{ numbers.length }}</span>期</span>
            </div>
            <div class="ant-table-small" style="width: 95%">
                <div style="margin-bottom: -8px; padding-bottom: 0px;">
                    <table>
                        <colgroup>
                            <col>
                            <col>
                            <col>
                            <col>
                        </colgroup>
                        <thead class="ant-table-thead">
                        <tr>
                            <th class="ant-table-selection-column">
                                <span class="kd-checkbox parted" v-if="selectedAll === 2" @click="selectNumbers(futureLotteries.length)">部分</span>
                                <span class="kd-checkbox checked" v-else-if="selectedAll === 1" @click="selectNumbers(0)">所有</span>
                                <span class="kd-checkbox" v-else @click="selectNumbers(futureLotteries.length)">没有</span>
                            </th>
                            <th><span>期号</span></th>
                            <th><span>开售时间</span></th>
                            <th><span>停售时间</span></th>
                        </tr>
                        </thead>
                    </table>
                </div>
                <div class="ant-table-body" style="max-height: 240px; overflow-y: auto;">
                    <table>
                        <colgroup>
                            <col>
                            <col>
                            <col>
                            <col>
                        </colgroup>
                        <tbody class="ant-table-tbody">
                            <tr class="ant-table-row" v-for="futureLottery in futureLotteries">
                                <td class="ant-table-selection-column"><input type="checkbox" class="ant-checkbox-input" v-model="numbers" :value="futureLottery.number"> </td>
                                <td>{{ futureLottery.number }}</td>
                                <td>{{ futureLottery.beginTime }}</td>
                                <td>{{ futureLottery.endTime }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import * as ajax from '../api';
    import { datatype, length } from '../common/basic';
    import gameBasic from '../mixins/gameBasic';

    export default {
        name: 'GameBettingType',
        mixins: [gameBasic],
        data(){
            return {
                type: 0, // 0自购，1合买，2追号

                // 合买
                // amountOfEachPlan: 0,

                togetherBuyPlan: {
                    totalCount: '', // 总份数
                    selfCount: '', // 自己购买份数
                    keepCount: '', // 保底份数
                    publicType: 1, // 方案设置  0-仅发单人可看 1-立即公开 2-截止后公开 3-截止后对跟单人公开
                    title: '欢迎跟单', // 方 案 标 题  //不超过15个汉字
                    info: '欢迎跟单' // 方 案 描 述  //不超过30个汉字
                },

                // 追号
                selectedAll: 2, // 0 unchecked, 1 selected, 2 parted
                futureLotteries: [],
                numbersLength: 5,
                customNumbersLength: '',
                numbers: [],

                // 验证
                validators: {
                    totalCount: '',
                    selfCount: '',
                    keepCount: '',
                    title: '',
                    info: ''
                },

                updated: 0
            };
        },
        computed: {
            // state
            currentLottery(){
                return this.currentGame.currentLottery;
            },
            cart(){
                return this.currentGame.cart;
            },

            // computed
            cartTotalAmount(){
                let amount = 0;
                this.cart.forEach(item => {
                    item.forEach(subItem => {
                        amount += subItem.amount * subItem.number;
                    });
                });
                return amount;
            },
            amountOfEachPlan(){
                return this.cartTotalAmount / this.togetherBuyPlan.totalCount;
            }
        },
        watch: {
            currentLottery(){
                if(this.type === 2){
                    this.fetchFutureLotteries();
                }
            },
            type(val){
                this.updated++;
                if(val === 2 && this.futureLotteries.length === 0){// 首次
                    this.fetchFutureLotteries();
                }else{
                    this.selectNumbers(this.numbersLength || this.customNumbersLength);
                }
            },
            numbers(val){
                this.updated++;
                if(this.type === 2){
                    if(val.length > 0 && val.length < this.futureLotteries.length){
                        this.selectedAll = 2;
                    }else if(val.length === this.futureLotteries.length){
                        this.selectedAll = 1;
                    }else{
                        this.selectedAll = 0;
                    }
                }
            },
            togetherBuyPlan: {
                handler: function(){
                    this.updated++;
                },
                deep: true
            },
            updated(){
                let result = 0;

                if(this.type === 1){ // 合买
                    result = {
                        type: 1,
                        value: this.togetherBuyPlan
                    };
                }else if(this.type === 2){ // 追号
                    result = {
                        type: 2,
                        value: this.numbers
                    };
                }else{ // 自购
                    result = {
                        type: 0,
                        value: 0
                    };
                }

                this.$emit('input', result);
            },

            //
            cartTotalAmount(val){
                this.initTogetherBuyPlan();
            },
            'togetherBuyPlan.totalCount': {
                handler: function(val, ){
                    if(length(this.cart) === 0) return;
                    if(val === '' || val === 0){
                        this.togetherBuyPlan.totalCount = 1;
                        return;
                    }else if(this.amountOfEachPlan < 1){
                        this.togetherBuyPlan.totalCount = this.cartTotalAmount;
                    }
                    this.togetherBuyPlan.selfCount = Math.ceil(val * 0.1) || 0;
                    this.togetherBuyPlan.keepCount = Math.ceil(val * 0.2) || 0;
                },
                deep: true
            },
            'togetherBuyPlan.selfCount': {
                handler: function(val){
                    if(length(this.cart) === 0) return;

                    let min = Math.ceil(this.togetherBuyPlan.totalCount * 0.1) || 0;
                    if(val === '' || val === 0 || val < min){
                        this.togetherBuyPlan.selfCount = min;
                    }else if(val >= this.togetherBuyPlan.totalCount){
                        this.togetherBuyPlan.selfCount = this.togetherBuyPlan.totalCount;
                        this.togetherBuyPlan.keepCount = 0;
                    }
                },
                deep: true
            },
            numbersLength(val){
                if(val > 0){
                    this.selectNumbers(val);
                }
            },
            customNumbersLength(val){
                if(/[^\d]/.test(val) || val === 0){
                    this.customNumbersLength = 1;
                }else if(val > this.futureLotteries.length){
                    this.customNumbersLength = this.futureLotteries.length;
                }
                this.selectNumbers(this.customNumbersLength);
            }
        },
        created(){
            this.initTogetherBuyPlan();
        },
        methods: {
            // methods
            fetchFutureLotteries(){
                let gameId = this.currentGame.id;
                return ajax.apiFetchFutureLotteries({
                    gameId: gameId,
                    length: 50
                }).then(json => {
                    if(typeof json === 'undefined') return;
                    if(typeof json.S !== 'undefined'){
                        console.log(json);
                        return;
                    }

                    let list = [];
                    if(datatype(json) === 'array'){
                        json.forEach(item => {
                            list.push({
                                number: item.Numbers,
                                time: item.Open_Time,
                                beginTime: item.Begin_Date,
                                endTime: item.End_Date
                            });
                        });
                    }
                    this.futureLotteries = list;
                    this.selectNumbers(this.numbersLength || this.customNumbersLength);
                });
            },
            selectNumbers(len){
                if(len === 0){
                    this.numbers = [];
                    return;
                }
                let list = [], i;
                len = (len || 5) - 1;
                for(i = 0; i < this.futureLotteries.length; i++){
                    if(i <= len){
                        list.push(this.futureLotteries[i].number);
                    }else{
                        break;
                    }
                }
                this.numbers = list;
            },
            initTogetherBuyPlan(){
                let val = this.cartTotalAmount;
                this.togetherBuyPlan.totalCount = val;
                this.togetherBuyPlan.selfCount = Math.ceil(val * 0.1);
                this.togetherBuyPlan.keepCount = Math.ceil(val * 0.2);
            },
            resetTogetherBuyPlanDescription(){
                this.togetherBuyPlan.title = '欢迎跟单';
                this.togetherBuyPlan.info = '欢迎跟单';
            },

            // validators
            validate(){
                let flag = true;
                if(!this.validateTotalCount(this.togetherBuyPlan.totalCount)) flag = false;
                if(!this.validateSelfCount(this.togetherBuyPlan.selfCount)) flag = false;
                if(!this.validateKeepCount(this.togetherBuyPlan.keepCount)) flag = false;
                if(!this.validateTitle(this.togetherBuyPlan.title)) flag = false;
                if(!this.validateInfo(this.togetherBuyPlan.info)) flag = false;

                return flag;
            },
            validateTotalCount(val){
                if(val === '' || val <= 0){
                    this.validators.totalCount = '总份数不能放空！';
                    return false;
                }else if(/[^\d]/.test(val)){
                    this.validators.totalCount = '总份数必须是数字！';
                    return false;
                }

                this.validators.totalCount = false;
                return true;
            },
            validateSelfCount(val){
                if(val < 1){
                    this.validators.selfCount = '最低不能少于1份';
                    return false;
                }else if(val < (this.togetherBuyPlan.totalCount * 0.1)){
                    this.validators.selfCount = '至少认购10%';
                    return false;
                }
                this.validators.selfCount = false;
                return true;
            },
            validateKeepCount(val){
                this.validators.keepCount = false;
                return true;
            },
            validateTitle(val){
                if(val === ''){
                    this.validators.title = '方案标题不能为空！';
                    return false;
                }else{
                    let len = val.replace(/[^\x00-\xff]/g, 'a');
                    len = len.length;
                    if(len > 15){
                        this.validators.title = '方案标题不能超过15个字！';
                        return false;
                    }
                }
                this.validators.title = false;
                return true;
            },
            validateInfo(val){
                if(val === ''){
                    this.validators.info = '方案描述不能为空！';
                    return false;
                }else{
                    let len = val.replace(/[^\x00-\xff]/g, 'a');
                    len = len.length;
                    if(len > 30){
                        this.validators.info = '方案描述不能超过30个字！';
                        return false;
                    }
                }
                this.validators.info = false;
                return true;
            }
        }
    };
</script>
