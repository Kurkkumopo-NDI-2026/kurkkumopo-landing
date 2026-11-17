// Applique le thème avant le premier rendu (évite le flash) : choix stocké, sinon préférence système.
;(function () {
  var t
  try {
    t = localStorage.getItem('theme')
  } catch (e) {}
  if (t !== 'light' && t !== 'dark') t = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  document.documentElement.dataset.theme = t
})()
