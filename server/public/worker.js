const cacheName = 'v1'
const cacheAssets = [
  '/',
  '/css/main.css',
  '/js/noscript.js',
  '/js/main.js',
  '/offline'
]

const intervalTimer = 15 // in seconds

const url = 'http://mirabeau.denniswegereef.nl/api/v1/rooms'

const newData = async () => {
  return await fetch(url).then(res => res.json())
}

// Install
self.addEventListener('install', event => {
  console.log('Service worker installed')
})

self.addEventListener('activate', event => {
  console.log('Service worker activated')
  // Remove old caches
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cache => {
          console.log(`Clearing old cache ${cache}`)

          return cache != cacheName ? caches.delete(cache) : null
        })
      )
    )
  )

  // Fetching new data
  if (navigator.onLine) {
    setInterval(() => {
      caches.open(cacheName).then(async cache => {
        console.log('Service worker: Caching files')

        let data = await newData()

        let roomUrls = data.data.map(
          room => 'room/' + room.room_name.replace(/\s+/g, '%20')
        )
        cache.addAll([...cacheAssets, ...roomUrls])
      })
    }, intervalTimer * 1000)

    console.log('Fetching new data')
    event.waitUntil(
      caches
        .open(cacheName)
        .then(async cache => {
          console.log('Service worker: Caching files')

          let data = await newData()

          let roomUrls = data.data.map(
            room => 'room/' + room.room_name.replace(/\s+/g, '%20')
          )
          cache.addAll([...cacheAssets, ...roomUrls])
        })
        .then(() => self.skipWaiting())
    )
  }
})

self.addEventListener('fetch', event => {
  console.log('fetching')

  event.respondWith(
    caches
      .match(event.request)
      .then(response => (response ? response : fetch(event.request)))
      .catch(() => caches.match('/offline'))
  )
})

self.addEventListener('push', e => {
  const data = e.data.json()

  self.registration.showNotification('Mirabeau meeting-rooms', {
    body: data.title,
    icon:
      'https://pbs.twimg.com/profile_images/886883466456989696/XTOh4kAL_400x400.jpg',
    vibrate: [
      500,
      110,
      500,
      110,
      450,
      110,
      200,
      110,
      170,
      40,
      450,
      110,
      200,
      110,
      170,
      40,
      500
    ]
  })
})
