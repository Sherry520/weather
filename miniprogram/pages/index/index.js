const weatherMap = {
  'sunny': "晴天",
  'cloundy': "多云",
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
}
Page({
  data: {
    nowTemp: 12,
    nowWeather: "多云"
  },
  onLoad(){
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
          nowWeather: weatherMap[weather]
        })
      }
    })
  }
})