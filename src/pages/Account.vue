<template>
    <main class="kd-body wrpper mt10 usercenter_index">
        <div class="title_index">账户中心</div>
        <div class="content_index">
            <mod-account-nav-side-bar></mod-account-nav-side-bar>
            <div class="account_rightcontent">
                <mod-account-basic-info></mod-account-basic-info>
                <div class="contentwarp_centercontent">
                    <router-view ref="viewAccountBody"></router-view>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
    import AccountNavSideBar from '../components/AccountNavSideBar';
    import AccountBasicInfo from '../components/AccountBasicInfo';

    export default {
        name: 'PageAccount',
        components: {
            modAccountNavSideBar: AccountNavSideBar,
            modAccountBasicInfo: AccountBasicInfo
        }
    };
</script>
