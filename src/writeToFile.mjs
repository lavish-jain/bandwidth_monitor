import fs from 'fs'

const writeToFile = (userinfo, received, transmitted, timestamp) => {
    const content = `Timestamp: ${new Date().toString()}\n\nHi ${userinfo.name},\nBelow are your bandwidth usage stats:\nData Received: ${received} MB\nData Transmitted: ${transmitted} MB\nTotal Bandwidth used: ${received+transmitted} MB`
    fs.writeFile(`${process.env.HOME}/Desktop/bandwidth_monitor_stats.txt`,content, err=>{
        if(err) {
            console.error(err)
            return
        }
    })
    // Write to bandwidth.tmp
    const tmp = `${received} ${transmitted} ${timestamp}`
    fs.writeFile(`${process.env.HOME}/bandwidth.tmp`, tmp, err => {
        if(err) {
            console.error(err)
            return
        }
    })
}

export default writeToFile