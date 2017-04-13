<template>
    <main class="kd-body content_openprize">
        <mod-history-nav-side-bar v-model="viewByDigit"></mod-history-nav-side-bar>
        <mod-history-body :viewByDigit="viewByDigit"></mod-history-body>
    </main>
</template>

<script>
    import * as ajax from '../api';
    import HistoryNavSideBar from '../components/HistoryNavSideBar';
    import HistoryBody from '../components/HistoryBody';

    export default {
        name: 'PageHistory',
        data(){
            return {
                viewByDigit: false
            };
        },
        components: {
            modHistoryNavSideBar: HistoryNavSideBar,
            modHistoryBody: HistoryBody
        }
    };
</script>
