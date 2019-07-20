import _ from 'lodash'

// https://medium.com/@mhagemann/the-ultimate-way-to-slugify-a-url-string-in-javascript-b8e4a0d849e1
function slugify (string = '', lang = 'en') {
  const a = 'àáäâãåăæąçćčđďèéěėëêęǵḧìíïîįłḿǹńňñòóöôœøṕŕřßśšșťțùúüûǘůűūųẃẍÿýźžż·/_,:;'
  const b = 'aaaaaaaaacccddeeeeeeeghiiiiilmnnnnooooooprrssssttuuuuuuuuuwxyyzzz------'
  const p = new RegExp(a.split('').join('|'), 'g')

  lang = lang.split('-')[0].toLowerCase()
  const ands = {
    en: 'and',
    es: 'y',
    fr: 'et',
    pr: 'e',
    de: 'und',
    it: 'e'
  }
  const and = ands[lang] || ands['en']

  return string.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, `-${and}-`) // Replace & with 'and'
    .replace(/[^\w-]+/g, '') // Remove all non-word characters
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}
_.mixin({ 'slugify': slugify })

export default ({ Vue }) => {
  Vue.prototype._ = _
}
