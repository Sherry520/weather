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
 const QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
 const UNPROMPTED = 0
 const UNAUTHORIZED = 1
 const AUTHORIZED = 2

 var qqmapsdk;
Page({
  data: {
    nowTemp: "",
    nowWeather: "",
    nowWeatherBackground: "",
    hourlyWeather: [],
    todayTemp: "",
    todayDate: "",
    city: "广州市",
    locationAuthType: UNPROMPTED
  },
  onLoad(){
    this.qqmapsdk = new QQMapWX({
      key: "RGQBZ-TTJRQ-PZ75U-GMSDT-J4WCO-TSBVW"
    });
    wx.getSetting({
      success: res => {
        let auth = res.authSetting["scope.userLocation"]
        this.setData({
          locationAuthType: auth? AUTHORIZED:(auth===false)?UNAUTHORIZED:UNPROMPTED,
        })
        if(auth)
          this.getCityAndWeather()
        else
          this.getNow()
      }
    })
    this.getNow()
  },
  onPullDownRefresh(){
    this.getNow(() => {
      wx.stopPullDownRefresh()
  })},
  getNow(callback){
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now', //仅为示例，并非真实的接口地址
      data: {
        city: this.data.city
      },
      success: res => {
        let result = res.data.result
        this.setNowWeather(result)
        this.setHourlyWeather(result)
        this.setToday(result)
      },
      complete(){
        callback && callback()
      }
    })
  },
  setNowWeather(result){
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
  setHourlyWeather(result){
    let hourlyWeather = []
    let forecast = result.forecast
    let nowHour = new Date().getHours()
    for (let i = 0; i < 8; i++) {
      hourlyWeather.push({
        time: (i*3 + nowHour) % 24 + "时",
        iconPath: "/images/" + result.forecast[i].weather + "-icon.png",
        temp: result.forecast[i].temp + "°"
      }
      )
    }
    hourlyWeather[0].time = "现在"
    this.setData({
      hourlyWeather: hourlyWeather
    })
  },
  setToday(result){
    let date = new Date()
    this.setData({
      todayTemp: `${result.today.minTemp}° - ${result.today.maxTemp}°`,
      todayDate: `${date.getFullYear()} - ${date.getMonth() + 1} - ${date.getDate()} 今天`
      })
  },
  onTapDayWeather(){
    wx.navigateTo({
      url: '/pages/list/list' + "?city=" + this.data.city,
    })
  },
  onTapLocation(){
    if (this.data.locationAuthType === UNAUTHORIZED){
      wx.openSetting({
        success: res => {
          let auth = res.authSetting["scope.userLocation"]
          if(auth)
            this.getCityAndWeather()
        }
      })
    }else{
      this.getCityAndWeather()
    }
    
  },
  getCityAndWeather(){
    wx.getLocation({
      success: res => {
        this.setData({
          locationAuthType: AUTHORIZED,
        })
        this.qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: res => {
            let city = res.result.address_component.city
            console.log(city)
            this.setData({
              city: city
            }),
            this.getNow()
          },
          fail: function(error) {
            console.error(error);
          },
          complete: function(res) {
            console.log(res);
          }
        })
      },
      fail: () => {
        this.setData({
          locationAuthType: UNAUTHORIZED
        })
      }    
    })
  },
})