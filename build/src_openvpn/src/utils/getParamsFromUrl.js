// Expected format
// http://origin/?id=<id>#<key>
// - id: is an alphanumeric identifier
// - key: base64 encoded string
// 
// http://origin/7e00cfadbe61f2ed#mc5pGQQ4VbbuWJDayJD0kXsElAUddmUktJYUYSDNaDE=

const urlTemplate = 'http://origin/?id=<id>#<key>'

export default function getParamsFromUrl() {
  const idArg = clean(window.location.search).split('&').find(arg => arg.startsWith('id='))
  const id = (idArg || '').split('id=')[1]
  const key = clean(window.location.hash)
  if (!id) throw Error('No valid id provided. Url must be '+urlTemplate)
  if (!key) throw Error('No valid key provided. Url must be '+urlTemplate)
  return { 
    key: decodeURIComponent(key), 
    id: decodeURIComponent(id)
  };
}

function clean(s) {
  if (!s) return s
  return s.trim().replace('/', '').replace('#', '').replace('?', '')
}
