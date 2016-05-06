'use strict'

const utils = {
  // DISTANCE
  NM_IN_KM: 1.852,
  KM_IN_NM: 0.539956803,
  // SPEED
  // Knots
  KNOTS_IN_MS: 0.514444,
  KNOTS_IN_MPH: 1.150779,
  KNOTS_IN_KPH: 1.852,
  // MPH
  MPH_IN_MS: 0.44704,
  MPH_IN_KPH: 1.609344,
  MPH_IN_KNOTS: 0.868976,
  // KPH
  KPH_IN_MS: 0.277778,
  KPH_IN_MPH: 0.621371,
  KPH_IN_KNOTS: 0.539957,
  // MS
  MS_IN_KPH: 3.6,
  MS_IN_MPH: 2.236936,
  MS_IN_KNOTS: 1.943844,
}

module.exports = {
  dmsToDd (pole, data) {
    let minsec = data.minutes

    if (data.seconds > 0) {
      minsec += (data.seconds / 60)
    }

    let decimal = data.degrees + (minsec / 60)

    if (pole.toUpperCase() === 'S' || pole.toUpperCase() === 'W') {
      decimal *= -1
    }

    return decimal
  },

  ddToDms (type, deg, precision) {
    let dd = Math.abs(deg)
    let d = Math.floor(dd)
    let m = (dd - d) * 60
    let S = ''

    if (type === 'longitude' && deg < 0) {
      S = 'W'
    }

    if (type === 'longitude' && deg >= 0) {
      S = 'E'
    }

    if (type === 'latitude' && deg < 0) {
      S = 'S'
    }

    if (type === 'latitude' && deg >= 0) {
      S = 'N'
    }

    return `${d}° ${m.toFixed(precision)}' ${S}`
  },

  convert (v, inputFormat, outputFormat) {
    let value = v

    if (typeof v !== 'number') {
      value = parseFloat(v)
    }

    if (isNaN(value)) {
      return v
    }

    inputFormat = inputFormat.toLowerCase()
    outputFormat = outputFormat.toLowerCase()

    if(inputFormat === outputFormat) {
      return value
    }

    if (inputFormat === 'rad' && outputFormat === 'deg') {
      return value * (180 / Math.PI)
    }

    if (inputFormat === 'deg' && outputFormat === 'rad') {
      return value * (Math.PI / 180)
    }

    // KM
    if(inputFormat == 'km') {
      if(outputFormat == 'nm') return value / utils.RATIOS.NM_IN_KM
    }

    // NM
    if(inputFormat == 'nm') {
      if(outputFormat == 'km') return value / utils.RATIOS.KM_IN_NM
    }

    // KNOTS
    if(inputFormat == 'knots') {
      if(outputFormat == 'kph') return value / utils.RATIOS.KPH_IN_KNOTS
      if(outputFormat == 'ms') return value / utils.RATIOS.MS_IN_KNOTS
      if(outputFormat == 'mph') return value / utils.RATIOS.MPH_IN_KNOTS
    }

    // KPH
    if(inputFormat == 'kph') {
      if(outputFormat == 'knots') return value / utils.RATIOS.KNOTS_IN_KPH
      if(outputFormat == 'ms') return value / utils.RATIOS.MS_IN_KPH
      if(outputFormat == 'mph') return value / utils.RATIOS.MPH_IN_KPH
    }

    // MPH
    if(inputFormat == 'mph') {
      if(outputFormat == 'knots') return value / utils.RATIOS.KNOTS_IN_MPH
      if(outputFormat == 'ms') return value / utils.RATIOS.MS_IN_MPH
      if(outputFormat == 'kph') return value / utils.RATIOS.KPH_IN_MPH
    }

    // MS
    if(inputFormat == 'ms') {
      if(outputFormat == 'knots') return value / utils.RATIOS.KNOTS_IN_MS
      if(outputFormat == 'mph') return value / utils.RATIOS.MPH_IN_MS
      if(outputFormat == 'kph') return value / utils.RATIOS.KPH_IN_MS
    }

    // Just return input if input/output formats are not recognised.
    return value
  }
}
