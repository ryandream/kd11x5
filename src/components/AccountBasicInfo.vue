<template>
    <div class="wrap_righthead">
        <div class="header_righthead">
            <div class="avatar_righthead"><i class="iconfont icon-avatar"></i></div>
            <ul class="info_righthead">
                <li class="username_righthead">{{ userName }}</li>
                <li class="progress_righthead">安全等级：
                    <div class="ant-progress ant-progress-line ant-progress-status-normal ant-progress-show-info">
                        <div>
                            <div class="ant-progress-outer">
                                <div class="ant-progress-inner">
                                    <div class="ant-progress-bg" :style="securityLevelStyle"></div>
                                </div>
                            </div>
                            <span class="ant-progress-text">{{ securityLevel }}</span>
                        </div>
                    </div>
                </li>
                <li>
                    <router-link to="/account/real-name-authentication" title="点击去认证" :class="{'col-gray': !authenticated}"><i class="iconfont" :class="'icon-' + (authenticated ? 'authed' : 'noauth')"></i> {{ authenticated ? '已认证' : '未认证' }}</router-link>
                    <router-link to="/account/bind-bank-card" title="点击去绑定" :class="{'col-gray': !hasBankCard}"><i class="iconfont icon-bankcard col-gray"></i> {{ hasBankCard ? '已绑定' : '未申请' }}</router-link>
                    <router-link to="/account/bind-mobile" title="已绑定手机" :class="{'col-gray': !hasMobile}"><i class="iconfont icon-phone"></i> {{ hasMobile ? '已绑定' : '未绑定' }}</router-link>
                </li>
            </ul>
            <div class="amount_righthead">
                <p>
                    <a href="javasctipt:;" title="刷新余额">
                        <i class="anticon anticon-reload icon_righthead_3XWlY"></i>
                    </a>
                    余额：<span class="fs24_righthead">{{ balance }}</span> 元
                </p>
                <p>
                    <i class="anticon anticon-exclamation-circle icon_righthead_3XWlY"></i>
                    积分：
                    <span class="colred_righthead">{{ score }}</span>
                    <span class="space_righthead">冻结金额：</span>
                    <span class="colred_righthead">{{ frozenFund }}</span> 元
                </p>
            </div>
            <div class="button_righthead">
                <router-link to="/account/money-in" class="btn_button btn-warn_button">充值</router-link>
                <router-link to="/account/money-out" class="btn_button btn-red_button">提现</router-link>
            </div>
        </div>
        <div class="account_2_righthead" v-if="!authenticated">
            <ul class="a_2_1">
                <li><img src="../../static/css/images/tan.png" class="pointimg">
                    <strong class="f16px_righthead">您的账户有风险！</strong></li>
                <li>系统检测到您尚未填写真实姓名，真实姓名是提取账户资金时的重要核对依据，填写后可有效防止资金被盗取。</li>
            </ul>
            <ul class="a_2_2">
                <li><router-link to="/account/real-name-authentication"><img src="../../static/css/images/tianxie.png"></router-link></li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'AccountBasicInfo',
        computed: {
            // state
            userName(){
                return this.$store.state.user.userName;
            },
            balance(){
                return this.$store.state.user.balance;
            },
            score(){
                return this.$store.state.user.score;
            },
            frozenFund(){
                return this.$store.state.user.frozenFund;
            },
            securityLevel(){
                return this.$store.state.user.securityLevel;
            },

            // getters
            hasMobile(){
                return this.$store.getters.uHasMobile;
            },
            authenticated(){
                return this.$store.getters.uAuthenticated;
            },
            hasBankCard(){
                return this.$store.getters.uHasBankCard;
            },

            // computed
            securityLevelStyle(){
                let level = parseInt(this.securityLevel, 10),
                    style = {
                        width: this.securityLevel
                    };
                level = isNaN(level) ? 0 : level;
                if(level > 50){
                    style.background = '#09f';
                }else{
                    style.background = '#ef122f';
                }

                return style;
            }
        },
        created(){
            this.fetchUserDetail();
        },
        methods: {
            // mutations

            // actions
            fetchUserDetail(){
                return this.$store.dispatch('uFetchUserDetail');
            }

            // methods
        }
    };
</script>
