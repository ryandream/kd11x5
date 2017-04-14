<template>
    <main class="kd-body error404">      
        <div class="error_style_404">
		   <h1 class="not_style_b">您查到的页面不存在！
		       <div>		       
		          <router-link to="/" class="error_btn">返回首页</router-link>
		       </div>
		   </h1>
		</div>
    </main>
</template>

<script>
    export default {
        name: 'Error404'
    };
</script>
