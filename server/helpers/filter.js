function filterData(data) {
  let tempConfig = {
    minTemp: 24,
    minMicLevel: 25,
    minLighting: 18000
  }

  let roomspace = {
    babbage: 4,
    bell: 6,
    edison: 4,
    lamar: 6,
    analytics_dojo: 'unknown',
    hull: 4,
    lippershey: 10,
    starkweather: 8,
    marconi: 4,
    desk_area_1: 'unknown',
    desk_area_2: 'unknown',
    isd1_corner: 'unknown'
  }

  let checkTemperature = temp => {
    let newTemp = (temp / 1000).toFixed(1)
    return {
      celcius: newTemp,
      svg: newTemp > tempConfig.minTemp ? true : false
    }
  }

  let dataObj = data.map(item => {
    let tempRoomName = item.room_name.toLowerCase().replace(/\s+/g, '_')
    return {
      roomName: item.room_name,
      occupation: item.measurements.occupancy,
      micLevel:
        Math.floor(item.measurements.mic_level / 100) === tempConfig.minMicLevel
          ? true
          : false,
      decibels: Math.floor(item.measurements.mic_level / 100),
      roomTemp: checkTemperature(item.measurements.temperature),
      uvLight:
        item.measurements.ambient_light > tempConfig.minLighting ? true : false,
      space: roomspace[tempRoomName]
    }
  })
  return dataObj
}

module.exports.filterData = filterData
