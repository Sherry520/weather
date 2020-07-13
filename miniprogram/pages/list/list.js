// miniprogram/pages/list/list.js
const dayMap = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"]
Page({
  data:{
    weekWeather: [1,2,3,4,5,6,7],
    day: "星期一",
    date: "2020-10-48",
    temp: "15",
    weatherIcon: "/images/sunny-icon.png"
  },
  onLoad(){
    this.getWeekWeather()
  }, 
  onPullDownRefresh(){
    this.getWeekWeather(() => {wx.stopPullDownRefresh()})
  },
  getWeekWeather(callback){
    wx.request({
      url: "https://test-miniprogram.com/api/weather/future",
      data: {
        city: "广州市",
        time: new Date().getTime()
      },
      success: res =>{
        console.log(res)
        let result = res.data.result
        this.setWeekWeather(result)
      },
      complete: () => {
        callback && callback()
      }
    })
  },
  setWeekWeather(result){
    let weekWeather = []
        for (let i = 0; i < 7; i++) {
          let date = new Date()
          date.setDate(date.getDate() + i)
          weekWeather.push({
            day: dayMap[date.getDay()],
            date: `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`,
            temp: result[i].minTemp + "° - " + result[i].maxTemp + "°",
            weatherIcon: "/images/" + result[i].weather +"-icon.png"
          })
        }
        this.setData({
          weekWeather: weekWeather
        })
  },
})