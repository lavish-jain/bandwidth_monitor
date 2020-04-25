import inquirer from 'inquirer'
import getBytes from './getBytes.mjs'
import writeToFile from './writeToFile.mjs'

let baseBytes = {
  received: null,
  transmitted: null
}
const main = async () => {
  // Getting total bandwidth used at the start of monitoring to have a reference
  baseBytes = await getBytes()
  // Commented questions needed when implementing mailing functionality
  const questions = [
    // {
    //     type: 'input',
    //     name: 'senderEmail',
    //     message: `Sender's email:`
    // },
    // {
    //     type: 'input',
    //     name: 'senderPass',
    //     message: `Sender's password:`
    // },
    {
      type: 'input',
      name: 'name',
      message: 'Receiver\'s name:'
    },
    // {
    //     type: 'input',
    //     name: 'receiverEmail',
    //     message: `Receiver's email:`
    // },
    // {
    //     type: 'input',
    //     name: 'choice',
    //     message: 'Data communication choice? (file/mail) (default: file)'
    // },
    {
      type: 'input',
      name: 'timeperiod',
      message: 'Frequency of bandwidth collection and mailing (default: 1D):'
    }
  ]
  inquirer.prompt(questions).then(answers => {
    answers.timeperiod = resolveTime(answers.timeperiod)
    monitor(answers)
  })
}

const monitor = async (userinfo, counter = 0) => {
  // counter = 0 implies that monitor has been called the first time
  if (counter !== 0) {
    // Time to calculate bandwidth
    const bytes = await getBytes()
    if (bytes) {
      // size in MB
      const received = (bytes.received - baseBytes.received) / 1000000
      const transmitted = (bytes.transmitted - baseBytes.transmitted) / 1000000
      writeToFile(userinfo, received, transmitted)
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
  if (period === 0) { period = 24 * 60 * 60 }
  return period
}

export default main
