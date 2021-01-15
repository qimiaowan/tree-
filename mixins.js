import { formatDate, w, deepClone } from '@/utils/js/tools'
import SelectCity from '@/components/SelectCity'
import SelectMenu from '@/components/SelectMenu'
import { store, muations } from '@/service/store' // 保存全局变量
import api from '@/views/api'

export const commonMixins = {
  components: {
    SelectCity,
    SelectMenu
  },
  data () {
    return {
      now: '',
      api,
      w,
      selectMenuData: {},
      timeOut: 10000, // 轮播间隔时间
      curCity: {}, 
      handler: null
    }
  },
  created () {
    // 时间
    this.now = formatDate(new Date())
    // 更新时间
    setInterval(() => {
      this.now = formatDate(new Date())
    }, 1000)
    this.messageStateEvent().then(() => {
      this.init()
    })
  },
  methods: {
    messageStateEvent () {
      return new Promise((resolve, reject) => {
        const len = Object.keys(store.curCity).length
        if (len) {
          resolve()
        } else {
          this.handler = this.messageFun.bind(this, resolve)
          window.addEventListener('message', this.handler, false)
        }
      })
    },
    messageFun (resolve, messageEvent) {
      // window.removeEventListener('message', this.handler, false)
      // const data = JSON.parse(messageEvent.data)
   
      this.cityData(1).then(data => {
        const selectCityData = this.reduceCity(data)
        const cloneSelect = deepClone(selectCityData[0].textObj)
        muations.setCurCity(cloneSelect)
        this.mCityListData(selectCityData[0], selectCityData, resolve)
      })
    },
    mCityListData (curData, selectCityData, resolve) {
      const curZb = Object.values(curData.textObj)[0]
      this.cityListData(curZb).then(data => {
        const listData = this.reduceCity(data)
        curData.children = listData
        curData.offShow = false
      }).catch(e => {
        console.log(e)
        curData.children = [] // 点击过的默认 防止重复请求
      }).finally(() => {
        muations.setCityList(selectCityData)
        resolve && resolve()
      })
    },
    init (date = '') {
      this.selectMenuData = store.cityList
      this.curCity = store.curCity
      const curZb = Object.values(this.curCity)[0]
      const dataPromise = this.initData(curZb, this.apiKeysArr(), date)
      this.chartsView(dataPromise)
    },
    checkSelectEmitFun (curData) {
      if (!curData.children) {
        const updatePromise = new Promise((resolve, reject) => {
          this.mCityListData(curData, this.selectMenuData, resolve)
        })
        updatePromise.then(() => {
          this.selectMenuData = deepClone(store.cityList)
        })
      }
      curData.offShow = !curData.offShow
    },
    checkEmitFun (name) {
      // 菜单按钮点击事件
      muations.setCurCity(name)
      this.init()
      this.showMenu = !this.showMenu
    },
    replaceCityApt (name) {
      return name.replace('11', '').replace('22', '').replace('（汇总）', '')
    },
    reduceCity (data) {
      return data.reduce((prev, item) => {
        const obj = {}
        const name = this.replaceCityApt(item.name)
        obj.textObj = { [name]: item.deptId }
        obj.offShow = true
        prev.push(obj)
        return prev
      }, [])
    },
    chartsView (dataPromise) { console.log(dataPromise) },
    apiKeysArr () { return '' },
    initData (cityId, keysArr = '', date = '') {
      return this.api.fstPostData(cityId, keysArr, date)
    },
    cityData (userId) {
      return this.api.cityPostData(userId)
    },
    cityListData (depId) {
      return this.api.cityListPostData(depId)
    }
  }
}
