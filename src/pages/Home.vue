<template>
    <main class="kd-body wrpper">
        <div class="wapp-box clearfix hidden">
            <section class="wapp_top_midle">
                <mod-home-carousel></mod-home-carousel>
                <mod-home-lottery-tab></mod-home-lottery-tab>
            </section>
            <section class="wapp_right_root">
                <mod-home-user-info></mod-home-user-info>
                <mod-home-latest-notices></mod-home-latest-notices>
            </section>
        </div>
        <mod-home-user-news></mod-home-user-news>
        <div class="wrpper">
            <mod-home-lottery-boxes></mod-home-lottery-boxes>
            <div class="mid_fr">
                <mod-home-user-news-2></mod-home-user-news-2>
                <div class="mgt10_root"><a href=""><img src="../../static/upload/index_zjad.gif" style="width: 100%;"></a></div>
                <mod-home-ranking-list></mod-home-ranking-list>
                <div class="l_code_root"><a><img src="../../static/upload/index_25.png"></a></div>
            </div>
        </div>
    </main>
</template>

<script>
    import * as ajax from '../api';
    import { datatype } from '../common/basic';
    import * as Lottery from '../common/Lottery';

    import HomeCarousel from '../components/HomeCarousel';
    import HomeLotteryTab from '../components/HomeLotteryTab';
    import HomeUserInfo from '../components/HomeUserInfo';
    import HomeLatestNotices from '../components/HomeLatestNotices';
    import HomeUserNews from '../components/HomeUserNews';
    import HomeUserNews2 from '../components/HomeUserNews2';
    import HomeRankingList from '../components/HomeRankingList';
    import HomeLotteryBoxes from '../components/HomeLotteryBoxes';

    export default {
        name: 'PageHome',
        created(){
            this.fetchGameStateInfo();
        },
        methods: {
            // mutations
            setPrevLottery(gameId, payload){
                this.$store.commit('ga' + gameId + 'SetPrevLottery', payload);
            },

            // actions

            // methods
            fetchGameStateInfo(){
                return ajax.apiFetchGameStateInfo({
                    gameId: ''
                }).then(json => {
                    if(typeof json === 'undefined') return;
                    if(typeof json.S !== 'undefined'){
                        console.log(json);
                        return;
                    }
                    
                    if(datatype(json) !== 'array') return;

                    json.forEach(data => {
                        this.setPrevLottery(data.GAMENO, {
                            number: data.OPEN_RESULTS.N,
                            balls: data.OPEN_RESULTS.R.split(',')
                        });
                    });
                });
            }
        },
        components: {
            modHomeCarousel: HomeCarousel,
            modHomeLotteryTab: HomeLotteryTab,
            modHomeUserInfo: HomeUserInfo,
            modHomeLatestNotices: HomeLatestNotices,
            modHomeUserNews: HomeUserNews,
            modHomeUserNews2: HomeUserNews2,
            modHomeRankingList: HomeRankingList,
            modHomeLotteryBoxes: HomeLotteryBoxes
        }
    };
</script>
