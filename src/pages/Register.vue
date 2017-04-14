<template>
    <main class="kd-body login_style">
        <div class="head">会员注册</div>
        <div class="login_body">
            <ul class="login-mid mar">
                <li :class="{error: !!validators.user.name, success: validators.user.name === false}">
                    <label><span>*</span>用户名：</label>
                    <input type="text" v-model.trim="user.name" class="txt">
                    <div class="validate" v-if="validators.user.name">{{ validators.user.name }}</div>
                </li>
                <li :class="{error: !!validators.user.qq, success: validators.user.qq === false}">
                    <label><span>*</span>QQ：</label>
                    <input type="text" v-model.trim="user.qq" class="txt">
                    <div class="validate" v-if="validators.user.qq">{{ validators.user.qq }}</div>
                </li>
                <li :class="{error: !!validators.user.weixin, success: validators.user.weixin === false}">
                    <label><span>*</span>微信：</label>
                    <input type="text" v-model.trim="user.weixin" class="txt">
                    <div class="validate" v-if="validators.user.weixin">{{ validators.user.weixin }}</div>
                </li>
                <li :class="{error: !!validators.user.mobile, success: validators.user.mobile === false}">
                    <label><span>*</span>手机：</label>
                    <input type="text" v-model.trim="user.mobile" class="txt">
                    <div class="validate" v-if="validators.user.mobile">{{ validators.user.mobile }}</div>
                </li>
                <li :class="{error: !!validators.user.password, success: validators.user.password === false}">
                    <label><span>*</span>密码：</label>
                    <input type="password" v-model="user.password" class="txt">
                    <div class="validate" v-if="validators.user.password">{{ validators.user.password }}</div>
                </li>
                <li :class="{error: !!validators.confirmedPassword, success: validators.confirmedPassword === false}">
                    <label><span>*</span>确认密码：</label>
                    <input type="password" v-model="confirmedPassword" class="txt">
                    <div class="validate" v-if="validators.confirmedPassword">{{ validators.confirmedPassword }}</div>
                </li>
                <li :class="['secure-code', {error: !!validators.secureCode, success: validators.secureCode === false}]">
                    <label><span>*</span>验证码：</label>
                    <input type="text" v-model.trim="secureCode" class="graph-ver">
                    <div class="img-Veri"><img :src="secureCodeUrl" alt="验证码" @click="changeSecureCode"></div>
                    <div class="validate" v-if="validators.secureCode">{{ validators.secureCode }}</div>
                </li>
            </ul>
            <div class="btn-w30 wagn">
                <button class="ant-btn-primary" @click="doRegister">点击注册</button>
                <span>已有账号？<router-link to="login">点击登录</router-link> <a href="javascript:;" style="color: red; font-size: 14px;">/在线客服</a></span>
            </div>
        </div>
    </main>
</template>

<script>
    import * as ajax from '../api';

    export default {
        data(){
            return {
                user: {
                    name: '',
                    qq: '',
                    weixin: '',
                    mobile: '',
                    password: ''
                },
                confirmedPassword: '',
                secureCode: '',
                secureCodeVersion: Math.random(),

                validators: {
                    user: {
                        name: '',
                        qq: '',
                        weixin: '',
                        mobile: '',
                        password: ''
                    },
                    confirmedPassword: '',
                    secureCode: ''
                }
            };
        },
        computed: {
            // state

            // getters

            // computed
            secureCodeUrl(){
                return '/api/index/secure_code_img.html?v=' + this.secureCodeVersion;
            }
        },
        watch: {
            'user.name': {
                handler(val){
                    this.validateUserName(val);
                },
                deep: true
            },
            'user.qq': {
                handler(val){
                    this.validateUserQQ(val);
                },
                deep: true
            },
            'user.weixin': {
                handler(val){
                    this.validateUserWeiXin(val);
                },
                deep: true
            },
            'user.mobile': {
                handler(val){
                    val = val.toString();
                    if(val.length > 11){
                        this.user.mobile = val.substr(0, 11);
                    }
                    this.validateUserMobile(val);
                },
                deep: true
            },
            'user.password': {
                handler(val){
                    this.validateUserPassword(val);
                },
                deep: true
            },
            confirmedPassword(val){
                this.validateConfirmedPassword(val);
            },
            secureCode(val){
                this.validateSecureCode(val);
            },
        },
        methods: {
            // mutations
            setUser(payload){
                return this.$store.commit('uSetUser', payload);
            },

            // actions
            fetchUserInfo(){
                return this.$store.dispatch('uFetchUserInfo');
            },

            // methods
            doRegister(){
                if(!this.validate()) return;
                let vm = this;
                return ajax.apiRegister({
                    userName: this.user.name,
                    password: this.user.password,
                    weixin: this.user.weixin,
                    qq: this.user.qq,
                    mobile: this.user.mobile,
                    secureCode: this.secureCode
                }).then(json => {
                    if(typeof json === 'undefined') return;
                    this.changeSecureCode();

                    if(json.S === 191){ // 注册成功
                        this.$success({
                            title: '注册成功',
                            content: '欢迎来到十一选五',
                            cancelButton: function(){
                                if(this.$route.query.redirect){
                                    this.$router.push({
                                        path: this.$route.query.redirect
                                    });
                                }else{
                                    this.$router.push({
                                        name: 'HomePage'
                                    });
                                }
                            }
                        });
                        this.fetchUserInfo();
                    }else{
                        this.$error({
                            title: '失败',
                            content: json.S + ': ' + json.D,
                            cancelButton: function(){
                                vm.secureCode = '';
                                vm.validators.secureCode = '';
                            }
                        });
                    }
                });
            },
            changeSecureCode(){
                this.secureCodeVersion = Math.random();
            },

            // validators
            validate(){
                let flag = true;
                if(!this.validateUserName(this.user.name)) flag = false;
                if(!this.validateUserQQ(this.user.qq)) flag = false;
                if(!this.validateUserWeiXin(this.user.weixin)) flag = false;
                if(!this.validateUserMobile(this.user.mobile)) flag = false;
                if(!this.validateUserPassword(this.user.password)) flag = false;
                if(!this.validateConfirmedPassword(this.confirmedPassword)) flag = false;
                if(!this.validateSecureCode(this.secureCode)) flag = false;

                return flag;
            },
            validateUserName(val){
                if(val === ''){
                    this.validators.user.name = '用户名不能为空！';
                    return false;
                }else if(!/^[a-zA-Z0-9_]+$/.test(val)){
                    this.validators.user.name = '用户名只能是数字、字母组合！';
                    return false;
                }else if(val.length > 20 || val.length < 2){
                    this.validators.user.name = '用户名长度必须在2-20个字符！';
                    return false;
                }

                this.validators.user.name = false;
                return true;
            },
            validateUserQQ(val){
                if(val === ''){
                    this.validators.user.qq = 'QQ不能为空！';
                    return false;
                }else if(/[^\d]/.test(val)){
                    this.validators.user.qq = 'QQ只能是数字！';
                    return false;
                }else if(val.length > 15 || val.length < 5){
                    this.validators.user.qq = '标准QQ长度为5-15个数字！';
                    return false;
                }else if(!/^[1-9][0-9]+$/.test(val)){
                    this.validators.user.qq = 'QQ格式不正确！';
                    return false;
                }

                this.validators.user.qq = false;
                return true;
            },
            validateUserWeiXin(val){
                if(val === ''){
                    this.validators.user.weixin = '微信不能为空！';
                    return false;
                }else if(val.length > 20){
                    this.validators.user.weixin = '微信长度不能超过20个字符！';
                    return false;
                }else if(!/^[a-zA-Z0-9_]+$/.test(val)){
                    this.validators.user.weixin = '微信格式不正确！';
                    return false;
                }

                this.validators.user.weixin = false;
                return true;
            },
            validateUserMobile(val){
                if(val === ''){
                    this.validators.user.mobile = '手机号码不能为空！';
                    return false;
                }else if(/[^\d]/.test(val)){
                    this.validators.user.mobile = '手机号码只能是数字组成！';
                    return false;
                }else if(!/^1[34578]\d+$/.test(val)){
                    this.validators.user.mobile = '手机号码无效！';
                    return false;
                }else if(val.length !== 11){
                    this.validators.user.mobile = '手机号码必须是11位标准号码！';
                    return false;
                }

                this.validators.user.mobile = false;
                return true;
            },
            validateUserPassword(val){
                if(val === ''){
                    this.validators.user.password = '密码不能为空！';
                    return false;
                }else if(/[\s\t\n\r]+/g.test(val)){
                    this.validators.user.password = '密码不能包含空格！';
                    return false;
                }else if(val.length > 20 || val.length < 6){
                    this.validators.user.password = '密码长度只能是6-20个字符！';
                    return false;
                }

                this.validators.user.password = false;
                return true;
            },
            validateConfirmedPassword(val){
                if(val === ''){
                    this.validators.confirmedPassword = '确认密码不能为空！';
                    return false;
                }else if(val !== this.user.password){
                    this.validators.confirmedPassword = '确认密码与密码不一致！';
                    return false;
                }

                this.validators.confirmedPassword = false;
                return true;
            },

            validateSecureCode(val){
                if(val === ''){
                    this.validators.secureCode = '验证码不能为空！';
                    return false;
                }else if(!/^\d{4}$/.test(val)){
                    this.validators.secureCode = '验证码不正确！';
                    return false;
                }

                this.validators.secureCode = false;
                return true;
            }
        }
    };
</script>
