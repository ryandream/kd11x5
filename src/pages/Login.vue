<template>
    <main class="kd-body login_style">
        <div class="head">会员登录</div>
        <div class="login_body">
            <div class="lf_fr">
                <ul class="login-mid">
                    <li :class="{error: !!validators.user.name, success: validators.user.name === false}">
                        <label><span>*</span>用户名：</label>
                        <input type="text" v-model.trim="user.name" class="txt">
                        <div class="validate" v-if="validators.user.name">{{ validators.user.name }}</div>
                    </li>
                    <li :class="{error: !!validators.user.password, success: validators.user.password === false}">
                        <label><span>*</span>密码：</label>
                        <input type="password" v-model="user.password" class="txt">
                        <div class="validate" v-if="validators.user.password">{{ validators.user.password }}</div>
                    </li>
                    <li :class="['secure-code', {error: !!validators.secureCode, success: validators.secureCode === false}]">
                        <label><span>*</span>验证码：</label>
                        <input type="text" v-model.trim="secureCode" class="graph-ver">
                        <div class="img-Veri"><img :src="secureCodeUrl" alt="验证码" @click="changeSecureCode"></div>
                        <div class="validate" v-if="validators.secureCode">{{ validators.secureCode }}</div>
                    </li>
                </ul>
                <div class="btn-w30">
                <button class="ant-btn-primary" @click="doLogin">点击登录</button>
                    <span>没有账号？<router-link to="/register">点击注册</router-link> <a href="" target="_blank" style="color: red; font-size: 14px;">/在线客服</a></span>
                </div>
            </div>
            <div class="lf_fr">
                <img alt="example" width="100%" src="../../static/upload/loginimg.jpg">
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
                    password: ''
                },
                secureCode: '',
                secureCodeVersion: Math.random(),

                validators: {
                    user: {
                        name: '',
                        password: ''
                    },
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
            },
            introducer(){
                let pid = this.$route.query.p;
                if(pid && /^\d+$/.test(pid)){
                    return pid;
                }else{
                    return false;
                }
            }
        },
        watch: {
            'user.name': {
                handler(val){
                    this.validateUserName(val);
                },
                deep: true
            },
            'user.password': {
                handler(val){
                    this.validateUserPassword(val);
                },
                deep: true
            },
            secureCode(val){
                this.validateSecureCode(val);
            }
        },
        created(){
            this.writeIntroducer();
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
            doLogin(){
                if(!this.validate()) return;
                let vm = this;

                return ajax.apiLogin({
                    userName: this.user.name,
                    password: this.user.password,
                    secureCode: this.secureCode
                }).then(json => {
                    if(typeof json === 'undefined') return;
                    this.changeSecureCode();
                    
                    if(json.S === 120){ // 登录成功
                        this.$success({
                            title: '登录成功',
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
            writeIntroducer(){
                if(this.introducer === false) return;

                return ajax.apiSaveIntroducer({
                    introducerId: this.introducer
                }).then(json => {
                    if(typeof json === 'undefined') return;
                    if(json.S !== '180'){
                        console.log(json);
                    }else{
                        this.setUser({
                            introducerId: this.introducer
                        });
                    }
                });
            },

            // validators
            validate(){
                let flag = true;
                if(!this.validateUserName(this.user.name)) flag = false;
                if(!this.validateUserPassword(this.user.password)) flag = false;
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
