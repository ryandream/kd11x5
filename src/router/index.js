import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

let router = new Router({
    linkActiveClass: 'active',
    routes: [
        {
            path: '/',
            name: 'HomePage',
            meta: {
                requireAuth: true
            },
            component(resolve){
                require(['../pages/Home'], resolve);
            }
        },
        {
            path: '/login',
            name: 'LoginPage',
            component(resolve){
                require(['../pages/Login'], resolve);
            }
        },
        {
            path: '/register',
            name: 'RegisterPage',
            component(resolve){
                require(['../pages/Register'], resolve);
            }
        },
        {
            path: '/account',
            name: 'AccountPage',
            meta: {
                requireAuth: true
            },
            component(resolve){
                require(['../pages/Account'], resolve);
            },
            children: [
                {
                    path: 'records',
                    name: 'AccountRecordsBlock',
                    meta: {
                        requireAuth: true
                    },
                    component(resolve){
                        require(['../components/AccountRecords'], resolve);
                    }
                },
                {
                    path: 'real-name-authentication',
                    name: 'AccountRealNameAuthenticationBlock',
                    meta: {
                        requireAuth: true
                    },
                    component(resolve){
                        require(['../components/AccountRealNameAuthentication'], resolve);
                    }
                },
                {
                    path: 'bind-bank-card',
                    name: 'AccountBindBankCardBlock',
                    meta: {
                        requireAuth: true
                    },
                    component(resolve){
                        require(['../components/AccountBindBankCard'], resolve);
                    }
                },
                {
                    path: 'bind-mobile',
                    name: 'AccountBindMobileBlock',
                    meta: {
                        requireAuth: true
                    },
                    component(resolve){
                        require(['../components/AccountBindMobile'], resolve);
                    }
                },
                {
                    path: 'money-in',
                    name: 'AccountMoneyInBlock',
                    meta: {
                        requireAuth: true
                    },
                    component(resolve){
                        require(['../components/AccountMoneyIn'], resolve);
                    }
                },
                {
                    path: 'money-out',
                    name: 'AccountMoneyOutBlock',
                    meta: {
                        requireAuth: true
                    },
                    component(resolve){
                        require(['../components/AccountMoneyOut'], resolve);
                    }
                },
                {
                    path: 'balance-sheet',
                    name: 'AccountBalanceSheetBlock',
                    meta: {
                        requireAuth: true
                    },
                    component(resolve){
                        require(['../components/AccountBalanceSheet'], resolve);
                    }
                },
                {
                    path: 'safity-center',
                    name: 'AccountSafityCenterBlock',
                    meta: {
                        requireAuth: true
                    },
                    component(resolve){
                        require(['../components/AccountSafityCenter'], resolve);
                    }
                },
                {
                    path: 'edit-password',
                    name: 'AccountEditPasswordBlock',
                    meta: {
                        requireAuth: true
                    },
                    component(resolve){
                        require(['../components/AccountEditPassword'], resolve);
                    }
                }
            ]
        },
        {
            path: '/game/:gameId',
            name: 'GamePage',
            meta: {
                requireAuth: true
            },
            component(resolve){
                require(['../pages/Game'], resolve);
            }
        },
        {
            path: '/record-detail-of-betting/:gameId/:id',
            name: 'GameBettingDetailPage',
            meta: {
                requireAuth: true
            },
            component(resolve){
                require(['../pages/GameBettingDetail'], resolve);
            }
        },
        {
            path: '/record-detail-of-continous-betting/:gameId/:id',
            name: 'GameContinousBettingDetailPage',
            meta: {
                requireAuth: true
            },
            component(resolve){
                require(['../pages/GameContinousBettingDetail'], resolve);
            }
        },
        {
            path: '/buy-together/:gameId',
            name: 'BuyTogetherPage',
            meta: {
                requireAuth: true
            },
            component(resolve){
                require(['../pages/BuyTogether'], resolve);
            }
        },
        {
            path: '/buy-together-detail/:gameId/:id',
            name: 'BuyTogetherDetailPage',
            meta: {
                requireAuth: true
            },
            component(resolve){
                require(['../pages/BuyTogetherDetail'], resolve);
            }
        },
        {
            path: '/history/:gameId',
            name: 'HistoryPage',
            meta: {
                requireAuth: true
            },
            component(resolve){
                require(['../pages/History'], resolve);
            }
        },
        {
            path: '/activities',
            name: 'ActivitiesPage',
            meta: {
                requireAuth: true
            },
            component(resolve){
                require(['../pages/Activities'], resolve);
            }
        },
        {
            path: '/cooperation',
            name: 'CooperationPage',
            meta: {
                requireAuth: true
            },
            component(resolve){
                require(['../pages/Cooperation'], resolve);
            }
        },
        {
            path: '/on-phone-buy',
            name: 'OnPhoneBuyPage',
            meta: {
                requireAuth: true
            },
            component(resolve){
                require(['../pages/OnPhoneBuy'], resolve);
            }
        },
        {
            path: '*',
            name: 'Error404Page',
            meta: {
                requireAuth: true
            },
            component(resolve){
                require(['../pages/Error404'], resolve);
            }
        }
    ]
});

export default router;
