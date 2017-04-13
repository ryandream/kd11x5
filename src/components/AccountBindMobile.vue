<template>
    <div class="oreder_oredercenter"><!-- 实名认证 -->
        <div class="account_mb_titile">手机绑定</div>
        <div class="account_mb_content" v-if="hasMobile">
            <div class="acc_Password">
                <table>
                    <tbody>
                        <tr>
                            <td><img src="../../static/css/images/gg.png"></td>
                            <td><strong style="font-size: 14px;">手机绑定成功！</strong></td>
                        </tr>
                        <tr>
                            <td>手机号码：</td>
                            <td class="li22px_BankBind">{{ stateMobile }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="account_mb_content" v-else>
            <p class="color4 account_aq1" style="padding-left: 60px;"><strong class="color14">温馨提示：</strong>绑定手机，可以收到网站优惠信息，账户异动等服务。</p>
            <div class="acc_Password">
                <table>
                    <tbody>
                        <tr :class="{error: !!validators.mobile, success: validators.mobile === false}">
                            <td>手机号码:</td>
                            <td><input type="text" v-model.trim="mobile" class="input4_TureName"></td>
                            <td class="validate" v-if="validators.mobile">{{ validators.mobile }}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td><a class="keep_CashNum" @click="doBindMobile">确定</a></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    import * as ajax from '../api';

    export default {
        name: 'ComAccountBindMobile',
        data(){
            return {
                mobile: '',

                validators: {
                    mobile: ''
                }
            };
        },
        computed: {
            // state
            stateMobile(){
                return this.$store.state.user.mobile;
            },

            // getters
            hasMobile(){
                return this.$store.getters.uHasMobile;
            }

            // actions
        },
        watch: {
            mobile(val){
                val = val.toString();
                if(val.length > 11){
                    this.mobile = val.substr(0, 11);
                }
                this.validateMobile(val);
            }
        },
        methods: {
            // mutations
            setUser(payload){
                this.$store.commit('uSetUser', payload);
            },

            // actions

            // methods
            doBindMobile(){
                if(!this.validate()) return;

                return ajax.apiBindMobile({
                    mobile: this.mobile
                }).then(json => {
                    if(json.S === 805){
                        this.setUser({
                            mobile: this.mobile
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
                if(!this.validateMobile(this.mobile)) flag = false;

                return flag;
            },
            validateMobile(val){
                if(val === ''){
                    this.validators.mobile = '手机号码不能为空！';
                    return false;
                }else if(/[^\d]/.test(val)){
                    this.validators.mobile = '手机号码只能是数字组成！';
                    return false;
                }else if(!/^1[34578]\d+$/.test(val)){
                    this.validators.mobile = '手机号码无效！';
                    return false;
                }else if(val.length !== 11){
                    this.validators.mobile = '手机号码必须是11位标准号码！';
                    return false;
                }

                this.validators.mobile = false;
                return true;
            }
        }
    };
</script>
