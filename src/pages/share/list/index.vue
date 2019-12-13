<template>
  <div>
    <official-account></official-account>
    <van-tabs v-model="active">
      <van-tab title="发现">
        <van-notice-bar :text="notice.content"></van-notice-bar>
        <van-search placeholder="请输入关键词" @change="onChange"/>
        <ul>
          <li v-for="(share,index) in shares" :key="index">
            <Card :share="share" :key="index"></Card>
          </li>
        </ul>
      </van-tab>
      <van-tab title="使用说明">
        <div class="shuoming">
          <p>资源均为免费，兑换后即可查看下载地址；点击<span>我的 -> 我的兑换</span>，即可查看、下载兑换过的资源。</p>
          <h3>积分获得方式</h3>
          <ul>
            <li> > 每日签到</li>
            <li> > 投稿</li>
            <li> > 转发（尚未完成）</li>
            <li> > 提建议、意见（尚未完成）</li>
          </ul>
          <h3>深入交流</h3>
          <ul>
            <li> > 私人微信：m15938266626
              <van-button type="primary" size="mini" @click="doCopyMe">复制</van-button>
            </li>
          </ul>
          <h3>公众号(java泡泡糖)</h3>
        </div>
      </van-tab>

      <van-tab title="待审核" v-if="showFlag">
        <van-notice-bar :text="notice.content"></van-notice-bar>
        <van-search placeholder="请输入关键词" @change="onChange"/>
        <ul>
          <li v-for="(share_c,index) in shares_contribution" :key="index">
            <Card :share="share_c" :key="index"></Card>
          </li>
        </ul>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
  import Card from '@/components/card.vue';
  import {request} from "@/utils/request";
  import {NOTICE_URL, SHARE_POST_URL} from "@/utils/api";
  import {USER_URL_ME} from "../../../utils/api";

  export default {
    components: {
      Card
    },
    data() {
      return {
        notice: '',
        shares: '',
        more: true,
        pageNo: 1,
        searchWord: '',
        title: '',
        shares_contribution: '',
        showFlag: false
      }
    },
    methods: {
      async onChange(event) {
        this.title = event.mp.detail;
        this.fetchSharePosts(true);
      },
      async findAllNotices() {
        this.notice = await request(
          NOTICE_URL,
          'GET',
          {}
        );
      },
      async getUser() {
        let user = await request(
          USER_URL_ME,
          'GET',
          {}
        );

        if (user.roles === 'admin') {
          console.log("当前用户权限：" + user.roles)
          this.showFlag = true;
        }
      },
      async fetchSharePosts(init) {
        if (init) {
          this.pageNo = 1;
          this.more = true;
        }
        wx.showNavigationBarLoading();
        let title = this.title;
        const sharesRemote = await request(
          SHARE_POST_URL + '/q',
          'GET',
          {
            pageNo: this.pageNo,
            title: title
          }
        );
        if (sharesRemote.list.length < 10 && this.pageNo > 0) {
          this.more = false;
          console.log(this.more)
        }
        if (init) {
          this.shares = sharesRemote.list;
          wx.stopPullDownRefresh();
        } else {
          // 下拉刷新，不能直接覆盖books 而是累加
          this.shares = this.shares.concat(sharesRemote.list)
        }
        wx.hideNavigationBarLoading();
      },

      async fetchSharePosts_a(init) {
        if (init) {
          this.pageNo = 1;
          this.more = true;
        }
        wx.showNavigationBarLoading();
        let title = this.title;
        const sharesRemote = await request(
          SHARE_POST_URL + '/q',
          'GET',
          {
            pageNo: this.pageNo,
            title: title,
            type: 'NOT_YET'
          }
        );
        if (sharesRemote.list.length < 10 && this.pageNo > 0) {
          this.more = false;
          console.log(this.more)
        }
        if (init) {
          this.shares_contribution = sharesRemote.list;
          wx.stopPullDownRefresh();
        } else {
          // 下拉刷新，不能直接覆盖books 而是累加
          this.shares_contribution = this.shares_contribution.concat(sharesRemote.list)
        }
        wx.hideNavigationBarLoading();
      },
      doCopyMe: function () {
        wx.setClipboardData({
          data: 'jumping_me',
          success(res) {
            wx.getClipboardData({
              success(res) {
                console.log(res);
              }
            })
          }
        })
      },
      doCopyGZH: function () {
        wx.setClipboardData({
          data: 'itmuch_com',
          success(res) {
            wx.getClipboardData({
              success(res) {
                console.log(res);
              }
            })
          }
        })
      }
    },
    onReachBottom() {
      // 没有更多了
      if (!this.more) {
        return false
      }
      this.pageNo = this.pageNo + 1;
      this.fetchSharePosts();
      this.fetchSharePosts_a()
    },
    onPullDownRefresh() {
      this.fetchSharePosts(true);
      this.fetchSharePosts_a(true);
    },
    mounted() {
      this.findAllNotices();
      this.getUser();
    },
    onShow() {
      this.fetchSharePosts(true);
      this.fetchSharePosts_a(true);
    }
  }
</script>
<style lang="scss" scoped>
  .shuoming {
    padding: 15px;
    font-size: 14px;

    span {
      font-weight: bold;
    }

    h3 {
      font-size: 16px;
      line-height: 32px;
      font-weight: bold;
    }

    ul {
      margin: 0 10px 0 10px;

      li {
      }
    }
  }
</style>
