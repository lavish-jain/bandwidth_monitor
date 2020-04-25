import { exec } from 'child_process'

const getBytes = async () => {
  // Bash command reads the /proc/net/dev file and extracts the bytes recieved and transmitted by each interface
  const stdout = await execPromisified('awk \'$1 ~ /:/ {print $2,$10}\' /proc/net/dev')
  if (!stdout) { return null }
  let bytesRecieved = 0
  let bytesTransmitted = 0
  // Split bytes received and transmitted for each interface
  const lines = stdout.split('\n').slice(0, -1)
  lines.forEach(line => {
    bytesRecieved = bytesRecieved + parseInt(line.split(' ')[0])
    bytesTransmitted = bytesTransmitted + parseInt(line.split(' ')[1])
  })
  const obj = {
    received: bytesRecieved,
    transmitted: bytesTransmitted,
    lastTimestamp: Date.now()/1000
  }
  return obj
}

// Promise wrapper on exec
const execPromisified = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.warn(err)
        resolve(null)
      }
      resolve(stdout || null)
    })
  })
}

export default getBytes
