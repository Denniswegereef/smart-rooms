window.addEventListener('load', () => {
  const forms = document.getElementsByClassName('subscribe-form')
  const timer = document.getElementById('timer')

  const getDateTime = () => {
    const weekday = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ]
    let date = new Date()

    let hour = date.getHours()
    hour = (hour < 10 ? '0' : '') + hour

    let day = date.getDay()
    console.log(day)

    let min = date.getMinutes()
    min = (min < 10 ? '0' : '') + min

    timer.innerHTML = `${weekday[day]} ${hour}:${min}`
  }
  getDateTime()
  setInterval(() => {
    getDateTime()
  }, 60000)

  // service workers not supported
  if (!'serviceWorker' in navigator) {
    document.body.insertAdjacentHTML(
      'beforebegin',
      '<p>Service worker not supported</p>'
    )
    return
  }
  const publicKey = `BEEXX5ECkg-tm8YLBwIMo7VgjrD0KXIXi0FyhQ1g-2edujCJptDYTfIijK5e7Bl1L2heumbnEbbabj4WX0VZORs`

  const send = async () => {
    let register = await navigator.serviceWorker.register('/worker.js')

    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey)
    })

    for (form of forms) {
      form.addEventListener('change', subscribeForm)
    }

    async function subscribeForm(e) {
      e.preventDefault()

      subscription.name = e.target.value

      if (e.target.checked) {
        await fetch('/subscribe', {
          method: 'POST',
          body: JSON.stringify({
            name: e.target.value,
            subscription: JSON.stringify(subscription)
          }),
          headers: {
            'content-type': 'application/json'
          }
        })
      }
    }

    // setTimeout(async function() {

    // }, 3000)
  }

  send()
  // navigator.serviceWorker.ready.then(swRegistration => {
  //   return swRegistration.sync
  //     .register('myFirstSync')
  //     .then(res => {
  //       console.log('Sync installed')
  //     })
  //     .catch(err => {
  //       console.err(err)
  //     })
  // })
})

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
