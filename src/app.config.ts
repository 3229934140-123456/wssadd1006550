export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/remind/index',
    'pages/mine/index',
    'pages/report/index',
    'pages/share/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#5BB8C9',
    navigationBarTitleText: '口腔影像报告',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    color: '#7F8C8D',
    selectedColor: '#5BB8C9',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '报告'
      },
      {
        pagePath: 'pages/remind/index',
        text: '提醒'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})
