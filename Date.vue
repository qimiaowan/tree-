<template>
  <div class="select-date" @click.prevent.stop>
    <div class="w">
      <div class="date-top clearfix">
        <div class="year-left fl" @click="yearLeft">
          <img src="@/assets/img/arrow-double-left.png" alt="">
        </div>
        <div class="year-right fr" @click="yearRight">
          <img src="@/assets/img/arrow-double-right.png" alt="">
        </div>
        <div class="time clearfix">
          <div v-show="curShowCt===2" class="month-left fl" @click="monthLeft">
            <img src="@/assets/img/arrow-left-bold.png" alt="">
          </div>
          <div v-show="curShowCt===2" class="month-right fr" @click="monthRight">
            <img src="@/assets/img/arrow-right-bold.png" alt="">
          </div>
          <div class="tooltip">
            <span @click="year(false)" class="year">{{setY}}年</span>
            <span @click="month" class="month" v-show="curShowCt===2">{{getM}}月</span>
          </div>
        </div>
      </div>
      <div class="date-content">
        <div v-show="curShowCt===0" class="year-content">
          <span @click="yearBtnClick(item)" :class="{curActive: setY === item}" class="btn-month" v-for="(item, index) in cnYearStr" :key="index">{{item}}年</span>
        </div>
        <div v-show="curShowCt===1" class="month-content">
          <span @click="monthBtnClick(index + 1)" :class="{curActive: getM === (index + 1)}" class="btn-month" v-for="(item, index) in cnMonthStr" :key="index">{{item}}月</span>
        </div>
        <div v-show="curShowCt===2" class="date-content">
          <div class="date-day-top">
            <span v-for="(item, index) in cnDateStr" :key="index">{{item}}</span>
          </div>
          <div class="date-day-content">
            <template v-for="item in cnDayStr">
              <template v-if="Array.isArray(item)">
                <span @click="dateBtnClick(item, gItem)" class="gray" v-for="gItem in item">{{gItem}}</span>
              </template>
              <span @click="dateBtnClick(item)" :class="{curActive:getD === item}" v-else>{{item}}</span>
            </template>
          </div>
        </div>
      </div>
      <div class="date-footer clearfix">
        <span class="fr" @click="sub">确定</span>
        <span class="fr" @click="clear">清除</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SelectDate',
  data () {
    return {
      getY: '',
      getM: '',
      getD: '',
      getDay: '',
      setY: '',
      curShowCt: 2,
      comD: null,
      cnYearStr: [],
      cnMonthStr: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
      cnDateStr: ['日', '一', '二', '三', '四', '五', '六'],
      cnDayStr: []
    }
  },
  props: {
    curDate: {
      type: Object,
      default: () => new Date()
    }
  },
  created () {
    this.comD = new Date(this.curDate)
    this.getY = this.comD.getFullYear()
    this.getM = this.comD.getMonth() + 1
    this.getD = this.comD.getDate()
    this.getDay = this.comD.getDay()
    this.setY = this.getY
    this.initDate()
  },
  methods: {
    initDate () {
      this.day()
    },
    yearLeft () {
      if (this.curShowCt !== 0) {
        this.getY--
        this.setY--
        this.getDay = new Date(this.setY, this.getM - 1, this.getD).getDay()
        this.day()
      } else {
        this.getY -= 12
        this.year(true)
      }
    },
    yearRight () {
      if (this.curShowCt !== 0) {
        this.getY++
        this.setY++
        this.getDay = new Date(this.setY, this.getM - 1, this.getD).getDay()
        this.day()
      } else {
        this.getY += 12
        this.year(true)
      }
    },
    monthLeft () {
      this.getM = --this.getM % 12 === 0 ? 12 : this.getM
      this.getDay = new Date(this.setY, this.getM - 1, this.getD).getDay()
      this.day()
    },
    monthRight () {
      this.getM = ++this.getM % 13 === 0 ? 1 : this.getM
      this.getDay = new Date(this.setY, this.getM - 1, this.getD).getDay()
      this.day()
    },
    yearBtnClick (cur) {
      this.setY = cur
      this.curShowCt = 1
    },
    monthBtnClick (cur) {
      this.getM = cur
      this.getDay = new Date(this.setY, this.getM - 1, this.getD).getDay()
      this.day()
      this.curShowCt = 2
    },
    dateBtnClick (cur) {
      this.getD = cur
    },
    sub () {
      this.$emit('selectDateEmit', this.setY + '-' + this.getM + '-' + this.getD)
      console.log(this.setY + '-' + this.getM + '-' + this.getD)
    },
    clear () {
      this.$emit('selectDateEmit', '')
    },
    year (off) {
      this.curShowCt = 0
      const temYearPosi = (this.getY - 1) % 4
      const startYear = this.getY - temYearPosi - 4
      const endYear = this.getY + 7 - temYearPosi
      if (off) {
        this.setY = `${startYear}~${endYear}`
      }
      const yearArr = []
      for (var i = startYear; i <= endYear; i++) {
        yearArr.push(i)
      }
      this.cnYearStr = yearArr
    },
    month () {
      this.curShowCt = 1
    },
    day () {
      this.cnDayStr = []
      const xq = (this.getDay === 7) ? 0 : this.getDay
      if (xq > 0) {
        let temYear = this.setY
        let temMonth = this.getM
        const xqArr = []
        if (this.getM === 1) {
          temYear--
          temMonth = 12
        } else {
          temMonth--
        }
        let daynum = this.geMonthNum(temYear, temMonth)
        for (let temj = 0; temj < xq; temj++) {
          xqArr.unshift(daynum)
          daynum--
        }
        this.cnDayStr.unshift(xqArr)
      }
      const thisMonthDayNum = this.geMonthNum(this.setY, this.getM)
      for (let i = 1; i <= thisMonthDayNum; i++) {
        this.cnDayStr.push(i)
      }
      let nextDay = (xq + thisMonthDayNum) % 7
      if (nextDay !== 0) {
        const nextArr = []
        nextDay = 7 - nextDay
        for (var temj = 0; temj < nextDay; temj++) {
          nextArr.push(temj + 1)
        }
        this.cnDayStr.push(nextArr)
      }
    },
    geMonthNum (Year, Month) {
      var d = new Date(Year, Month, 0)
      return d.getDate()
    }
  }
}
</script>

<style lang="scss" scoped>
.select-date{
  position: absolute;
  text-align: left;
  z-index: 4;
  top: 0;
  left: -0.3rem;
  background: url("../assets/img/bj.png");
  background-size: cover;
  width: 1.8rem;
  color: #BBF5FF;
  .w {
    margin: 0 .15rem;
  }
  .date-top {
    img {
      width: 100%;
    }
    .month-left, .month-right, .year-left, .year-right {
      width: .15rem;
      cursor: pointer;
    }
    .time {
      margin: 0 .15rem;
      overflow: hidden;
      .tooltip {
        margin: 0 .15rem;
        height: .15rem;
        line-height: .15rem;
        text-align: center;
        overflow: hidden;
        color: #BBF5FF;
        font-size: .1rem;
        .year {
          margin-right: .05rem;
          cursor: pointer;
          &:hover {
            color: #219EFF;
          }
        }
        .month {
          cursor: pointer;
          &:hover {
            color: #219EFF;
          }
        }
      }
    }
  }
  .date-content {
    line-height: 1;
    .btn-month {
      width: .5rem;
      height: .25rem;
      display: inline-block;
      text-align: center;
      line-height: .25rem;
      font-size: .1rem;
      cursor: pointer;
      &:hover {
        color: #219EFF;
      }
    }
    .date-day-top {
        padding: .03rem 0;
        font-size: 0;
      span {
        font-size: .1rem;
        color: #BBF5FF;
        display: inline-block;
        width: .15rem;
        height: .15rem;
        text-align: center;
        line-height: .15rem;
        padding: 0 .0315rem;
      }
    }
    .date-day-content {
      font-size: 0;
      span {
        font-size: .1rem;
        color: #BBF5FF;
        display: inline-block;
        width: .15rem;
        height: .15rem;
        text-align: center;
        line-height: .15rem;
        padding: 0 .0315rem;
        cursor: pointer;
      }
    }
  }
  .date-footer {
    border-top: 1px solid #BBF5FF;
    span {
      // height: .15rem;
      // line-height: .15rem;
      padding: .1rem .15rem;
      font-size: 0.1rem;
      margin: .05rem 0 .05rem .05rem;
      color: #BBF5FF;
      cursor: pointer;
      background: #02335F;
      &:hover {
        color: #219EFF;
      }
    }
  }
  .curActive {
    color: #219EFF !important;
  }
  .gray {
    color: #616266 !important;
  }
}
.fl {
  float: left;
}
.fr {
  float: right;
}
.clearfix::before, .clearfix::after {
  content: "";
  display: block;
  width: 0;
  overflow: hidden;
  clear: both;
}
</style>
