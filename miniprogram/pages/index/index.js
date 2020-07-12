const weatherMap = {
  'sunny': "晴天",
  'cloundy': "多云",
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
}
const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
 }
Page({
  data: {
    nowTemp: "",
    nowWeather: "sunny",
    nowWeatherBackground: ""
  },
  getNow(callback){
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now', //仅为示例，并非真实的接口地址
      data: {
        city: '广州市'
      },
      success: res => {
        console.log(res)
        let result = res.data.result
        let temp = result.now.temp
        let weather = result.now.weather
        console.log(temp,weather)
        this.setData({
          nowTemp: temp + "°",
          nowWeather: weatherMap[weather],
          nowWeatherBackground: "/images/" + weather + "-bg.png"
        })
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: weatherColorMap[weather]
        })
      },
      complete(){
        callback && callback()
      }
    })
  },
  onLoad(){
    this.getNow()
  },
  onPullDownRefresh(){
    this.getNow(() => {
      wx.stopPullDownRefresh()
  })}
})