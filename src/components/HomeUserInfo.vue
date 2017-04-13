<template>
    <div class="index_login">
        <div class="logincontent">
                <div class="center_login">Hi, {{ userName }}
                <div>余额：<span><i class="loginred">{{ balance }}</i> 元</span>
                </div>
            </div>
            <div class="button_login">
                <router-link to="/account/money-in" class="btn_button btn-red">充值</router-link>
                <router-link to="/account/money-out" class="btn_button btn-warn">提现</router-link>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'HomeUserInfo',
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
        }
    };
</script>
