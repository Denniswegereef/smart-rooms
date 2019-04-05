const axios = require('axios')
const chalk = require('chalk')

function get(searchQuery) {
  let url = `http://mirabeau.denniswegereef.nl${searchQuery}`
    .toLowerCase()
    .replace(/\s+/g, '_')

  console.log(`Request to: ${chalk.blue(url)}`)

  return axios
    .get(url)
    .then(res => res.data.data)
    .catch(err => {
      console.log(err)
    })
}

module.exports.get = get
