<template>
    <div class="oreder_oredercenter"><!-- 充值支付 -->
        <div class="tab">
            <a v-for="(item, id) in methodsOfMoneyIn" :class="{on: method === id}" @click="setActiveMethod(id)">{{ item.name }}<span class="ant-tabs-ink-bar"></span></a>
            <a href="javascript:;">客服充值</a>
        </div>
        <div class="ant-card">
            <div class="ant-card-body">
                <form v-if="method === 'GSRK'" class="clearfix">
                    <div class="fieldset">
                        <div class="ant-form-item">
                            <div class="ant-form-item-label">选择类型： </div>
                            <div class="ant-col-20"><select class="ant-input" style="width: 140px;" v-model="type">
                                <option v-for="item in methodsOfMoneyIn.GSRK.list" :value="item.id">{{ item.name }}</option>
                            </select></div>
                        </div>
                        <div class="ant-form-item" :class="{error: !!validators.amount, success: validators.amount === false}">
                            <div class="ant-form-item-label">充值金额：</div>
                            <div class="ant-col-20"><input class="ant-input" style="width: 120px;" autocomplete="off" type="number" v-model.number.trim="amount"></div>
                            <div class="validate" v-if="validators.amount">{{ validators.amount }}</div>
                        </div>
                        <template v-if="type === 'bank'">
                            <div class="ant-form-item">
                                <div class="ant-form-item-label">银行：</div>
                                <div class="ant-col-20"><select class="ant-input" style="width: 140px;" v-model="bankName">
                                    <option v-for="bank in bankList" :value="bank">{{ bank }}</option>
                                </select></div>
                            </div>
                            <div class="ant-form-item" :class="{error: !!validators.bankCardNo, success: validators.bankCardNo === false}">
                                <div class="ant-form-item-label">银行卡号：</div>
                                <div class="ant-col-20"><input class="ant-input" style="width: 200px;" type="text" v-model.trim="bankCardNo"></div>
                            <div class="validate" v-if="validators.bankCardNo">{{ validators.bankCardNo }}</div>
                            </div>
                            <div class="ant-form-item" :class="{error: !!validators.userNameOfbankCard, success: validators.userNameOfbankCard === false}">
                                <div class="ant-form-item-label">户名：</div>
                                <div class="ant-col-20"><input class="ant-input" style="width: 120px;" type="text" v-model.trim="userNameOfbankCard"></div>
                            <div class="validate" v-if="validators.userNameOfbankCard">{{ validators.userNameOfbankCard }}</div>
                            </div>
                        </template>
                        <div class="ant-form-item" v-else :class="{error: !!validators.userName, success: validators.userName === false}">
                            <div class="ant-form-item-label">账号：</div>
                            <div class="ant-col-20"><input class="ant-input" style="width: 120px;" type="text" v-model.trim="userName"></div>
                            <div class="validate" v-if="validators.userName">{{ validators.userName }}</div>
                        </div>
                        <div class="ant-form-item">
                            <div class="ant-form-item-label"></div>
                            <div class="ant-col-20"><button type="button" class="ant-btn-cz" @click="applyMoneyInByCompany"><span>提交申请</span></button></div>
                        </div>
                    </div>
                    <div class="description" v-html="method === 'GSRK' && methodsOfMoneyIn.GSRK.list[type] && methodsOfMoneyIn.GSRK.list[type].description"></div>
                </form>
                <form v-else>
                    <div class="ant-form-item">
                        <div class="ant-form-item-label">充值金额：</div>
                        <div class="ant-col-20"><input class="ant-input" style="width: 78px;" autocomplete="off" type="number" v-model="amount"></div>
                        <div class="validate" v-if="validators.amount">{{ validators.amount }}</div>
                    </div>
                    <div class="ant-form-item">
                        <div class="ant-form-item-label"></div>
                        <div class="ant-col-20"><button type="button" class="ant-btn-cz" @click="createOrderNo"><span>立即充值</span></button></div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    import * as ajax from '../api';
    import { length, getItemOfObject } from '../common/basic';
    import ProvCity from '../common/ProvCity';

    export default {
        name: 'ComAccountMoneyIn',
        data(){
            return {
                methodsOfMoneyIn: {
                    WX: {
                        name: '微信支付',
                        status: 1
                    },
                    ZFB: {
                        name: '支付宝',
                        status: 1
                    },
                    WY: {
                        name: '网银支付',
                        status: 1
                    },
                    CZK: {
                        name: '充值卡',
                        status: 1
                    },
                    GSRK: {
                        name: '公司入款',
                        status: 1,
                        list: {}
                    }
                },
                method: 'WX',
                amount: '',

                // GSRK
                type: '',
                bankList: ProvCity.banks,
                bankName: ProvCity.banks.b01,
                bankCardNo: '',
                userNameOfbankCard: '',
                userName: '',

                // validators
                validators: {
                    amount: '',
                    bankCardNo: '',
                    userNameOfbankCard: '',
                    userName: ''
                }
            };
        },
        computed: {
            // state
            stateBankCardNo(){
                return this.$store.state.user.bankCardNo;
            },
            stateRealName(){
                return this.$store.state.user.realName;
            }
        },
        watch: {
            amount(val){
                this.validateAmount(val);
            },
            bankCardNo(val){
                if(val === this.stateBankCardNo){
                    this.userNameOfbankCard = this.stateRealName;
                }
                if(val.length > 19){
                    this.bankCardNo = val.substr(0, 19);
                    return;
                }
                this.validateBankCardNo(val);
            },
            userNameOfbankCard(val){
                this.validateUserNameOfBankCard(val);
            },
            userName(val){
                this.validateUserName(val);
            },
            method(){
                this.amount = '';
                let vm = this;
                setTimeout(function(){
                    vm.validators.amount = '';
                    vm.validators.bankCardNo = '';
                    vm.validators.userNameOfbankCard = '';
                    vm.validators.userName = '';
                }, 50);
            }
        },
        methods: {
            // mutations

            // actions

            // methods
            fetchMoneyInConfigsOfCompany(){
                return ajax.apiFetchMoneyInConfigsOfCompany().then(json => {
                    if(typeof json.S !== 'undefined'){
                        console.log(json);
                    }else{
                        let list = {}, key;
                        json.forEach((item, index) => {
                            if(index === 0) this.type = item.id;

                            list[item.id] = {
                                id: item.id,
                                name: item.name,
                                description: item.description
                            };
                        });
                        this.methodsOfMoneyIn.GSRK.list = list;
                    }
                });
            },
            applyMoneyInByCompany(){
                if(this.method !== 'GSRK') return;
                if(length(this.methodsOfMoneyIn.GSRK.list.name) === 0) return;
                if(!this.validate()) return;

                let vm = this,
                    info = '类型： ' + this.methodsOfMoneyIn.GSRK.list[this.type].name + '; ';
                if(this.type === 'bank'){
                    info += '银行：　' + this.bankName;
                    info += '; 银行卡卡号： ' + this.bankCardNo;
                    info += '; 户名： ' + this.userNameOfbankCard;
                }else{
                    info += '账号： ' + this.userName;
                }
                return ajax.apiApplyMoneyInByCompany({
                    amount: this.amount,
                    infoOfAccount: info
                }).then(json => {
                    if(json.S === 824){
                        this.$alert({
                            type: 'success',
                            title: "成功！",
                            content: json.S + ': ' + json.D,
                            cancelButton: function(){
                                vm.amount = '';
                                vm.bankCardNo = '';
                                vm.userNameOfbankCard = '';
                                vm.userName = '';
                                setTimeout(function(){
                                    vm.validators.amount = '';
                                    vm.validators.bankCardNo = '';
                                    vm.validators.userNameOfbankCard = '';
                                    vm.validators.userName = '';
                                }, 50);
                            }
                        });
                    }else{
                        this.$alert({
                            type: 'error',
                            title: '错误！',
                            content: json.S + ': ' + json.D
                        });
                    }
                });
            },
            setActiveMethod(methodId){
                this.method = methodId;
                if(methodId === 'GSRK' && length(this.methodsOfMoneyIn.GSRK.list) === 0){
                    this.fetchMoneyInConfigsOfCompany();
                }
            },
            createOrderNo(payload){
                if(!this.validate()) return;

                return ajax.apiCreateOrderOfMoneyIn({
                    method: this.method,
                    amount: this.amount
                }).then(json => {
                    if(typeof json.S !== 'undefined'){
                        this.$alert({
                            type: 'error',
                            title: '错误',
                            content: json.S + ': ' + json.D
                        });
                    }else{
                        let url = json.PAY_URL + (json.PAY_URL.indexOf('?') > -1 ? '&' : '?') + 'ORDER_NO=' + json.ORDER_NO + '&ORDER_AMOUNT=' + this.amount + '&BACK_URL=' + encodeURIComponent(json.BACK_URL);

                        window.location.href = url;
                    }
                });
            },

            // validators
            validate(){
                let flag = true;
                if(!this.validateAmount(this.amount)) flag = false;
                if(this.type === 'bank'){
                    if(!this.validateBankCardNo(this.bankCardNo)) flag = false;
                    if(!this.validateUserNameOfBankCard(this.userNameOfbankCard)) flag = false;
                }else{
                    if(!this.validateUserName(this.userName)) flag = false;
                }

                return flag;
            },
            validateAmount(val){
                if(val === ''){
                    this.validators.amount = '充值金额不能为空！';
                    return false;
                }

                this.validators.amount = false;
                return true;
            },
            validateBankCardNo(val){
                if(val === ''){
                    this.validators.bankCardNo = '银行卡号不能为空！';
                    return false;
                }else if(!/^[1-9]\d{15,18}$/.test(val)){
                    this.validators.bankCardNo = '银行卡号无效，必须是16-19位银行卡号！';
                    return false;
                }

                this.validators.bankCardNo = false;
                return true;
            },
            validateUserNameOfBankCard(val){
                if(val === ''){
                    this.validators.userNameOfbankCard = '户名不能为空！';
                    return false;
                }else if(!/^[\u4E00-\u9FA5\uF900-\uFA2D]+$/.test(val)){
                    this.validators.userNameOfbankCard = '户名只能是中文';
                    return false;
                }else{
                    let len = val.replace(/[^\x00-\xff]/g, 'a');
                    len = len.length;
                    if(len > 4 || len < 2){
                        this.validators.userNameOfbankCard = '户名长度必须是2-4个中文字！';
                        return false;
                    }
                }

                this.validators.userNameOfbankCard = false;
                return true;
            },
            validateUserName(val){
                if(val === ''){
                    this.validators.userName = '账号不能为空！';
                    return false;
                }else if(val.length > 20){
                    this.validators.userName = '账号长度不能超过20个字符！';
                    return false;
                }else if(!/^[a-zA-Z0-9_]+$/.test(val)){
                    this.validators.userName = '账号格式不正确！';
                    return false;
                }

                this.validators.userName = false;
                return true;
            }
        }
    };
</script>

<style scoped>
    .fieldset {
        width: 50%;
        float: left;
    }
    .fieldset .ant-form-item-label {
        width: 22%;
    }
    .fieldset .ant-col-20 {
        width: auto;
    }
    .fieldset .validate {
        position: static;
        margin-left: 22%;
    }
    .description {
        width: 50%;
        float: right;
    }
</style>
