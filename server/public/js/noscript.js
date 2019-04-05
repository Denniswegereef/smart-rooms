var noscripts = document.getElementsByClassName('no-script')

for (let i = 0; i < noscripts.length; i++) {
  var element = noscripts[i]

  if (typeof element.remove === 'function') {
    element.remove()
  }

  element.innerHTML = ''
}
