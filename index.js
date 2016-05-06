'use strict'

const moment = require('moment')
const printer = require('printer')
const c = require('./convert')
const request = require('superagent-promise-plugin').patch(require('superagent'))
const endpoint = 'http://localhost:3000'

function data() {
  return new Promise((resolve, reject) => {
    request
    .get(`${endpoint}/signalk/v1/api/vessels/self`)
    .then((response) => {
      resolve(response.body)
    })
    .catch((err) => {
      reject(err)
    })
  })
}

function get(object, path) {
  path = path.split('.')

  for (let i in path) {
    const slice = path[i]

    if (typeof object[slice] !== 'undefined') {
      object = object[slice]
    } else {
      object = null
    }
  }

  return object
}

data().then((tree) => {
  const data = {
    longitude: c.ddToDms('longitude', get(tree, 'navigation.position.longitude'), 3),
    latitude: c.ddToDms('latitude', get(tree, 'navigation.position.latitude'), 3),
    speedThroughWater: c.convert(get(tree, 'navigation.speedThroughWater.value'), 'ms', 'kts').toFixed(3),
    speedOverGround: c.convert(get(tree, 'navigation.speedOverGround.value'), 'ms', 'kts').toFixed(3),
    courseOverGroundTrue: c.convert(get(tree, 'navigation.courseOverGroundTrue.value'), 'rad', 'deg').toFixed(3),
    depth: get(tree, 'environment.depth.belowTransducer.value').toFixed(3)
  }

  const str = `${moment().toISOString().split('T')[1].split('.')[0]}

LNG: ${data.longitude}
LAT: ${data.latitude}

SOG: ${data.speedOverGround} kts
STW: ${data.speedThroughWater} kts
COG: ${data.courseOverGroundTrue}°

DPT: ${data.depth} m
UTC: ${moment().toISOString()}`

  printer.printDirect({
    data: str,
    type: 'RAW',
    success: (id) => {
      console.log('Sent job to printer, #' + id)
    },
    error: (err) => {
      throw err
    }
  })
}).catch((err) => {
  console.error('Error:', err.message)
})
