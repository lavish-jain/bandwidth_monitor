import getBytes from './getBytes.mjs'
import writeToFile from './writeToFile.mjs'
import fs from 'fs'

let baseBytes = {
  received: null,
  transmitted: null,
  lastTimestamp: null
}
const main = async () => {
    // Getting total bandwidth used at the start of monitoring to have a referenc
    fs.stat(`${process.env.HOME}/bandwidth.tmp`, async(err, stat)=> {
        if(!err) {
            // File exists
            baseBytes = readBandwidthFromFile()
        } else {
            baseBytes = await getBytes()
        }
        const userinfo = {
            name: process.env.USER || 'client',
            timeperiod: process.env.BANDWIDTH_MONITOR_PERIOD || '1D'
        }
        userinfo.timeperiod = resolveTime(userinfo.timeperiod)
        monitor(userinfo)
    })
}

const monitor = async (userinfo, counter = 0) => {
  // counter = 0 implies that monitor has been called the first time
  // If system rebooted and the time since last update is greater than the frequency
  if (counter !== 0 || Date.now()/1000 - baseBytes.lastTimestamp >= userinfo.timeperiod) {
    // Time to calculate bandwidth
    const bytes = await getBytes()
    if (bytes) {
      // size in MB
      const received = (bytes.received - baseBytes.received) / 1000000
      const transmitted = (bytes.transmitted - baseBytes.transmitted) / 1000000
      const lastTimestamp = bytes.lastTimestamp
      writeToFile(userinfo, received, transmitted, lastTimestamp)
      baseBytes = bytes
    }
  }
  setTimeout(() => { monitor(userinfo, counter + 1) }, userinfo.timeperiod * 1000)
}

// Resolves the time frequency entered by user into seconds
const resolveTime = stringPeriod => {
  const years = parseInt(stringPeriod.match(/[0-9]+(?=Y)/) ? stringPeriod.match(/[0-9]+(?=Y)/)[0] : '0')
  const months = parseInt(stringPeriod.match(/[0-9]+(?=M)/) ? stringPeriod.match(/[0-9]+(?=M)/)[0] : '0')
  const days = parseInt(stringPeriod.match(/[0-9]+(?=D)/) ? stringPeriod.match(/[0-9]+(?=D)/)[0] : '0')
  const hours = parseInt(stringPeriod.match(/[0-9]+(?=h)/) ? stringPeriod.match(/[0-9]+(?=h)/)[0] : '0')
  const minutes = parseInt(stringPeriod.match(/[0-9]+(?=m)/) ? stringPeriod.match(/[0-9]+(?=m)/)[0] : '0')
  const seconds = parseInt(stringPeriod.match(/[0-9]+(?=s)/) ? stringPeriod.match(/[0-9]+(?=s)/)[0] : '0')
  let period = seconds + minutes * 60 + hours * 60 * 60 + days * 24 * 60 * 60 + months * 30 * 24 * 60 * 60 + years * 365 * 24 * 60 * 60
  return period
}

// Reads bandwidth data from last saved point 
const readBandwidthFromFile = () => {
    const data = fs.readFileSync(`${process.env.HOME}/bandwidth.tmp`).toString()
    const arr = data.split(' ')
    const obj = {
        received: arr[0],
        transmitted: arr[1],
        lastTimestamp: arr[2]
    }
    return obj
}

export default main
