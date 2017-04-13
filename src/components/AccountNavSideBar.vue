<template>
    <div class="accountNav_leftnav">
        <h2>我的彩票</h2>
        <ul>
            <li><router-link to="/account/records?buy=1"><i class="iconfont icon-buyRecord"></i>购彩记录</router-link></li>
            <li><router-link to="/account/records?continue=1"><i class="iconfont icon-followNumberRecord"></i>追号记录</router-link></li>
            <li><router-link to="/account/balance-sheet"><i class="iconfont icon-accountDetail"></i>账户明细</router-link></li>
        </ul>
        <h2>帐户安全</h2>
        <ul>
            <li><router-link to="/account/safity-center"><i class="iconfont icon-safecenter"></i>安全中心</router-link></li>
            <li><router-link to="/account/edit-password"><i class="iconfont icon-modifyPassword"></i>修改密码</router-link></li>
            <li><router-link to="/account/real-name-authentication"><i class="iconfont icon-auth"></i>实名认证</router-link></li>
            <li><router-link to="/account/bind-bank-card"><i class="iconfont icon-bankcard"></i>银行卡绑定</router-link></li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'AccountNavSideBar'
    };
</script>
