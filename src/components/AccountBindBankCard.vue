<template>
    <div class="oreder_oredercenter"><!-- 银行卡绑定 -->
        <div class="account_mb_titile">银行卡绑定</div>
        <div class="account_mb_content" v-if="hasBankCard">
            <div class="acc_Password">
                <table>
                    <tbody>
                    <tr>
                        <td><img src="../../static/css/images/gg.png"></td>
                        <td><strong style="font-size: 14px;">银行卡绑定成功！</strong></td>
                    </tr>
                   <tr>
                        <td>银行卡号：</td>
                        <td class="li22px_BankBind">{{ stateBankCardNo }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="account_mb_content" v-else>
            <p class="color4 account_aq1" style="padding-left: 60px;"><strong class="color14">温馨提示：</strong>您还没有绑定银行卡！您需要绑定银行卡后才能提款！
                注：您绑定的银行卡信息需与实名认证的信息一致。</p>
            <div class="acc_Password">
                <table>
                    <tbody>
                        <tr :class="{error: !!validators.bankId, success: validators.bankId === false}">
                            <td>开户银行名称：</td>
                            <td>
                                <select class="kd-select" v-model="bankId">
                                    <option value="">请选择银行</option>
                                    <option v-for="(bank, id) in banks" :value="id">{{ bank }}</option>
                                </select>
                            </td>
                            <td class="validate" v-if="validators.bankId">{{ validators.bankId }}</td>
                        </tr>
                        <tr :class="{error: !!validators.provId, success: validators.provId === false}">
                            <td>省份：</td>
                            <td>
                                <select class="kd-select" v-model="provId">
                                    <option value="">请选择...</option>
                                    <option v-for="(prov, id) in provs" :value="id">{{ prov }}</option>
                                </select>
                            </td>
                            <td class="validate" v-if="validators.provId">{{ validators.provId }}</td>
                        </tr>
                        <tr :class="{error: !!validators.cityId, success: validators.cityId === false}">
                            <td>城市：</td>
                            <td>
                                <select class="kd-select" v-model="cityId">
                                    <option value="">请选择...</option>
                                    <option v-if="cities" v-for="(city, id) in cities" :value="id">{{ city }}</option>
                                </select>
                            </td>
                            <td class="validate" v-if="validators.cityId">{{ validators.cityId }}</td>
                        </tr>
                        <tr :class="{error: !!validators.bankAddress, success: validators.bankAddress === false}">
                            <td>开户行地址：</td>
                            <td>
                                <textarea class="bank-address" v-model="bankAddress" placeholder="请填写具体开户行具体地址"></textarea>
                            </td>
                            <td class="validate" v-if="validators.bankAddress">{{ validators.bankAddress }}</td>
                        </tr>
                        <tr :class="{error: !!validators.bankCardNo, success: validators.bankCardNo === false}">
                            <td>银行卡号码：</td>
                            <td>
                                <input v-model="bankCardNo" type="number" class="input4_TureName" placeholder="请输入您的银行卡号">
                            </td>
                            <td class="validate" v-if="validators.bankCardNo">{{ validators.bankCardNo }}</td>
                        </tr>
                        <tr :class="{error: !!validators.confirmedBankCardNo, success: validators.confirmedBankCardNo === false}">
                            <td>确认银行卡号：</td>
                            <td>
                                <input v-model="confirmedBankCardNo" type="number" class="input4_TureName" placeholder="请再次输入您的银行卡号">
                            </td>
                            <td class="validate" v-if="validators.confirmedBankCardNo">{{ validators.confirmedBankCardNo }}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td><a class="keep_CashNum" @click="doBindBankCard">保存</a></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    import * as ajax from '../api';
    import ProvCity from '../common/ProvCity';

    export default {
        name: 'ComAccountBindBankCard',
        data(){
            return {
                banks: ProvCity.banks,
                provs: ProvCity.provinces,
                cities: '',

                bankId: '',
                provId: '',
                cityId: '',

                bankAddress: '',
                bankCardNo: '',
                confirmedBankCardNo: '',

                validators: {
                    bankId: '',
                    provId: '',
                    cityId: '',

                    bankAddress: '',
                    bankCardNo: '',
                    confirmedBankCardNo: ''
                }
            };
        },
        computed: {
            // state
            stateBankCardNo(){
                return this.$store.state.user.bankCardNo;
            },

            // getters
            hasBankCard(){
                return this.$store.getters.uHasBankCard;
            },

            // computed
            bank(){
                return this.banks[this.bankId];
            },
            prov(){
                return this.provs[this.provId];
            },
            city(){
                return this.cities[this.cityId];
            }
        },
        watch: {
            bankId(val){
                this.validateBankId(val);
            },
            provId(val){
                this.cityId = '';
                this.validators.cityId = '';
                if(val === '' || !ProvCity.cities.hasOwnProperty(val)){
                    this.cities = '';
                }else{
                    this.cities = ProvCity.cities[val];
                }
                this.validateProvId(val);
            },
            cityId(val){
                this.validateCityId(val);
            },

            bankAddress(val){
                this.validateBankAddress(val);
            },
            bankCardNo(val){
                this.validateBankCardNo(val);
            },
            confirmedBankCardNo(val){
                this.validateConfirmedBankCardNo(val);
            }
        },
        methods: {
            // mutations
            setUser(payload){
                this.$store.commit('uSetUser', payload);
            },

            // actions

            // methods
            doBindBankCard(){
                if(!this.validate()) return;

                return ajax.apiBindBankCard({
                    bankCardNo: this.bankCardNo,
                    bankDetail: this.bank + '-地址： ' + this.prov + this.city + this.bankAddress
                }).then(json => {
                    if(typeof json === 'undefined') return;
                    if(json.S === 780){
                        this.setUser({
                            bankCardNo: this.bankCardNo
                        });
                    }else{
                        this.$alert({
                            type: 'error',
                            title: '错误',
                            content: json.S + ': ' + json.D
                        });
                    }
                });
            },

            // validators
            validate(){
                let flag = true;
                if(!this.validateBankId(this.bankId)) flag = false;
                if(!this.validateProvId(this.provId)) flag = false;
                if(!this.validateCityId(this.cityId)) flag = false;
                if(!this.validateBankAddress(this.bankAddress)) flag = false;
                if(!this.validateBankCardNo(this.bankCardNo)) flag = false;
                if(!this.validateConfirmedBankCardNo(this.confirmedBankCardNo)) flag = false;

                return flag;
            },
            validateBankId(val){
                if(val === ''){
                    this.validators.bankId = '请选择开户银行名称！';
                    return false;
                }

                this.validators.bankId = false;
                return true;
            },
            validateProvId(val){
                if(val === ''){
                    this.validators.provId = '请选择省份！';
                    return false;
                }

                this.validators.provId = false;
                return true;
            },
            validateCityId(val){
                if(val === ''){
                    this.validators.cityId = '请选择城市！';
                    return false;
                }

                this.validators.cityId = false;
                return true;
            },

            validateBankAddress(val){
                if(val === ''){
                    this.validators.bankAddress = '开户行地址不能为空！';
                    return false;
                }

                this.validators.bankAddress = false;
                return true;
            },
            validateBankCardNo(val){
                if(val === ''){
                    this.validators.bankCardNo = '银行卡卡号不能为空！';
                    return false;
                }else if(val.length < 16 && val.length > 19){
                    this.validators.bankCardNo = '银行卡卡好无效，必须是16-19位银行卡卡号！';
                    return false;
                }

                this.validators.bankCardNo = false;
                return true;
            },
            validateConfirmedBankCardNo(val){
                if(val === ''){
                    this.validators.confirmedBankCardNo = '确认银行卡卡号不能为空！';
                    return false;
                }else if(val !== this.bankCardNo){
                    this.validators.confirmedBankCardNo = '确认银行卡卡号和银行卡卡号不一致！';
                    return false;
                }

                this.validators.confirmedBankCardNo = false;
                return true;
            }
        }
    };
</script>
