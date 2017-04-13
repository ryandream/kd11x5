<template>
    <div class="kd-page" id="page">
        <template v-if="onlyShowBody">
            <router-view ref="viewBody"></router-view>
        </template>
        <template v-else>
            <header>
                <mod-header-user-top></mod-header-user-top>
                <mod-header-top-nav></mod-header-top-nav>
                <mod-navigation></mod-navigation>
            </header>
            <router-view ref="viewBody"></router-view>
            <mod-vip-teach></mod-vip-teach>
            <mod-footer></mod-footer>
        </template>
        <mod-promptbox ref="promptbox"></mod-promptbox>
        <mod-alert ref="alert"></mod-alert>
    </div>
</template>

<script>
    import { kdTimestamp, kdDateTime } from '../common/basic';
    import * as ajax from '../api';
    
    import HeaderUserTop from '../components/HeaderUserTop';
    import HeaderTopNav from '../components/HeaderTopNav';

    import Navigation from '../components/Navigation';

    import VipTeach from '../components/VipTeach';
    import Footer from '../components/Footer';

    export default {
        name: 'LayoutDefault',
        data(){
            return {
                updateSystemTimer: null,
                counter: 0,
                realtimeTimer: null
            };
        },
        computed: {
            // state
            systemTime(){
                return this.$store.state.time;
            },
            isUserLogined(){
                return this.$store.state.user.isUserLogined;
            },

            // getters

            // computed
            onlyShowBody(){
                return this.$route.name === 'LoginPage' || this.$route.name === 'RegisterPage';
            }
        },
        watch: {
            '$route'(){
                window.scrollTo(0, 0);
            },
            isUserLogined(val){
                if(val){
                    this.startRealtimeFetch();
                }else{
                    this.stopRealtimeFetch();
                }
            }
        },
        created(){
            this.fetchSystemTime();
        },
        methods: {
            // mutations
            setSite(payload){
                this.$store.commit('setSite', payload);
            },
            setUser(payload){
                this.$store.commit('uSetUser', payload);
            },

            // actions

            // methods
            fetchRealtimeData(){
                return ajax.apiLoopRealtimeData('noloading').then(json => {
                    if(typeof json.S !== 'undefined'){
                        console.log(json);
                    }else{
                        if(json.I === 0){ // 下线
                            this.setUser({
                                isUserLogined: false
                            });
                        }else{
                            if(json.A === 1){
                                this.setUser({
                                    balance: json.B
                                });
                            }
                        }
                    }
                });
            },
            startRealtimeFetch(){
                let vm = this;
                this.realtimeTimer = setTimeout(function(){
                    vm.fetchRealtimeData();

                    vm.startRealtimeFetch();
                }, 1000);
            },
            stopRealtimeFetch(){
                clearTimeout(this.realtimeTimer);
            },
            fetchSystemTime(){
                return ajax.apiFetchSystemTime('noloading').then(text => {
                    this.setSite({
                        time: text
                    });

                    // 当获取系统时间后，马上开启更新时间的定时器
                    this.startUpdateSystemTime();
                });
            },
            startUpdateSystemTime(){
                let vm = this, newTime;
                this.updateSystemTimer = setTimeout(function(){
                    newTime = kdTimestamp(vm.systemTime, true) + 1;
                    vm.setSite({
                        time: kdDateTime(newTime)
                    });
                    vm.counter++;

                    if(vm.counter === 5){ // 5秒钟重新更新一次系统时间
                        vm.counter = 0;
                        vm.stopUpdateSystemTime();
                        vm.fetchSystemTime();
                        return;
                    }
                    vm.startUpdateSystemTime();
                }, 1000);
            },
            stopUpdateSystemTime(){
                clearTimeout(this.updateSystemTimer);
            }
        },
        components: {
            modHeaderUserTop: HeaderUserTop,
            modHeaderTopNav: HeaderTopNav,
            modNavigation: Navigation,
            modVipTeach: VipTeach,
            modFooter: Footer
        }
    };
</script>

<style>
    .kd-page {}
</style>
