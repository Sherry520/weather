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
    nowWeather: "",
    nowWeatherBackground: "",
    hourlyWeather: []
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
        // set forecast
        let hourlyWeather = []
        let forecast = result.forecast
        let nowHour = new Date().getHours()
        for (let i = 0; i < 24; i+=3) {
          hourlyWeather.push({
            time: (i + nowHour) % 24 + "时",
            iconPath: "/images/" + result.forecast[i/3].weather + "-icon.png",
            temp: result.forecast[i/3].temp + "°"
          }
          )
        }
        hourlyWeather[0].time = "现在"
        this.setData({
          hourlyWeather: hourlyWeather
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