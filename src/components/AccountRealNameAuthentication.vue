<template>
    <div class="oreder_oredercenter"><!-- 实名认证 -->
        <div class="account_mb_titile">实名认证</div>
        <div class="account_mb_content" v-if="authenticated">
            <div class="acc_Password">
                <table>
                    <tbody>
                        <tr>
                            <td><img src="../../static/css/images/gg.png"></td>
                            <td><strong style="font-size: 14px;">实名认证成功！</strong></td>
                        </tr>
                        <tr>
                            <td>真实姓名:：</td>
                            <td class="li22px_BankBind">{{ stateRealName }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="account_mb_content" v-else>
            <p class="color4 account_aq1" style="padding-left: 60px;"><strong class="color14">温馨提示：</strong>真实姓名和身份证号码是您提款时的重要依据，请务必真实填写。</p>
            <div class="acc_Password">
                <table>
                    <tbody>
                        <tr :class="{error: !!validators.realName, success: validators.realName === false}">
                            <td>真实姓名：</td>
                            <td><input type="text" v-model.trim="realName" class="input4_TureName"></td>
                            <td class="validate" v-if="validators.realName">{{ validators.realName }}</td>
                        </tr>
                        <tr :class="{error: !!validators.password, success: validators.password === false}">
                            <td>输入登录密码：</td>
                            <td><input type="password" v-model="password" class="input4_TureName"></td>
                            <td class="validate" v-if="validators.password">{{ validators.password }}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td><a class="keep_CashNum" @click="doAuthenticate">确定</a></td>
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
        name: 'ComAccountRealNameAuthentication',
        data(){
            return {
                realName: '',
                password: '',

                validators: {
                    realName: '',
                    password: ''
                }
            };
        },
        computed: {
            // state
            stateRealName(){
                return this.$store.state.user.realName;
            },

            // getters
            authenticated(){
                return this.$store.getters.uAuthenticated;
            }

            // computed
        },
        watch: {
            realName(val){
                this.validateRealName(val);
            },
            password(val){
                this.validatePassword(val);
            }
        },
        methods: {
            // mutations
            setUser(payload){
                this.$store.commit('uSetUser', payload);
            },

            // actions

            // methods
            doAuthenticate(){
                if(!this.validate()) return;

                return ajax.apiAuthenticateRealName({
                    realName: this.realName,
                    password: this.password
                }).then(json => {
                    if(typeof json === 'undefined') return;
                    if(json.S === 805){
                        this.setUser({
                            realName: this.realName
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
                if(!this.validateRealName(this.realName)) flag = false;
                if(!this.validatePassword(this.password)) flag = false;

                return flag;
            },
            validateRealName(val){
                if(val === ''){
                    this.validators.realName = '姓名不能为空！';
                    return false;
                }else if(!/^[\u4E00-\u9FA5\uF900-\uFA2D]+$/.test(val)){
                    this.validators.realName = '姓名只能是中文';
                    return false;
                }else{
                    let len = val.replace(/[^\x00-\xff]/g, 'a');
                    len = len.length;
                    if(len > 4 || len < 2){
                        this.validators.realName = '姓名长度必须是2-4个中文字！';
                        return false;
                    }
                }

                this.validators.realName = false;
                return true;
            },
            validatePassword(val){
                if(val === ''){
                    this.validators.password = '密码不能为空！';
                    return false;
                }else if(/[\s\t\n\r]+/g.test(val)){
                    this.validators.password = '密码不能包含空格！';
                    return false;
                }else if(val.length > 20 || val.length < 6){
                    this.validators.password = '密码长度只能是6-20个字符！';
                    return false;
                }

                this.validators.password = false;
                return true;
            }
        }
    };
</script>
