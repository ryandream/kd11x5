<template>
    <div class="oreder_oredercenter"><!-- 安全中心 -->
        <div class="account_mb_titile">安全中心</div>
        <div class="account_mb_content">
            <p class="color4 account_aq1">建议使用字母加数字组合、混合大小写、特殊字符（如@）等提高密码强度。</p>
            <div class="account_aq_list">
                <ul class="hidden">
                    <li class="a_a_1">真实姓名</li>
                    <li class="a_a_2">{{ realName }}</li>
                </ul>
                <ul class="hidden">
                    <li class="a_a_1">手机</li>
                    <li class="a_a_2">{{ mobile }}</li>
                </ul>
                <ul class="hidden">
                    <li class="a_a_1">银行卡</li>
                    <li class="a_a_2">绑定银行卡是您提款时的唯一用卡，是资金提取的安全保证</li>
                    <li class="a_a_3"><router-link to="/account/bind-bank-card" class="write_SelfInfo">绑定</router-link></li>
                </ul>
                <ul class="hidden">
                    <li class="a_a_1">账户密码</li>
                    <li class="a_a_2">安全性高的密码可以使账户更安全</li>
                    <li class="a_a_3"><router-link to="/account/edit-password" class="modify_SelfInfo">修改</router-link></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ComAccountSafityCenter',
        computed: {
            // state
            realName(){
                return this.$store.state.user.realName;
            },
            mobile(){
                return this.$store.state.user.mobile;
            }
        }
    };
</script>
