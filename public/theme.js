// Applique le thème avant le premier rendu (évite le flash) : choix stocké, sinon sombre par défaut.
;(function () {
  var t
  try {
    t = localStorage.getItem('theme')
  } catch (e) {}
  document.documentElement.dataset.theme = t === 'light' ? 'light' : 'dark'
})()
