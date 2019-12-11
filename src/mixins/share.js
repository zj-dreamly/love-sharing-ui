export default {
  onShareAppMessage() {
    return {
      title: '爱分享1024',
      desc: '各种学习笔记、干货分享，你值得拥有！',
      path: 'pages/share/list/main',
      imageUrl: '/static/img/xuanchuan.png',
      success() {
        console.log('分享成功');
      }
    };
  }
};
