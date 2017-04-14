<template>
    <div class="user_Top">
        <div class="user_control">
            <div class="fn-left">
                <span>您好, </span>
                <span class="color_red">{{ userName }}</span>
                <span>欢迎来到十一选五！余额： {{ balance }} 元 </span>
                <span>[ <router-link to="/account/money-in">充值</router-link> ] </span>
                <span>[ <a @click="doLogout">退出</a> ]</span>
            </div>
            <div class="fn-right topIn">
                <ul>
                    <li><router-link to="/account/records">我的账户</router-link></li>
                    <li><router-link to="/activities">活动中心</router-link></li>
                    <li><a href="javascript:;" target="_blank"><img src="../../static/css/images/indexkf.png"></a></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import * as ajax from '../api';
    
    export default {
        name: 'HeaderUserTop',
        computed: {
            // state
            userName(){
                return this.$store.state.user.userName;
            },
            balance(){
                return this.$store.state.user.balance;
            }

            // getters

            // computed
        },
        methods: {
            // mutations
            setUser(payload){
                this.$store.commit('uSetUser', payload);
            },

            // actions

            // methods
            doLogout(){
                let vm = this;
                return ajax.apiLogout().then(json => {
                    if(typeof json === 'undefined') return;
                    if(json.S === 190){
                        this.$success({
                            title: '登出成功',
                            content: '欢迎再来十一选五！',
                            cancelButton: function(){
                                this.$router.push({
                                    name: 'LoginPage'
                                });
                            }
                        });
                        this.setUser({
                            isUserLogined: false
                        });
                    }else{
                        console.log(json);
                    }
                });
            }
        }
    };
</script>
