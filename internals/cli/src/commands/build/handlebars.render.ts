/*
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */
import Handlebars from 'handlebars'

let RegCache = {}
let HandlebarsCompile

const replaceDelimiters = function (str, sourceReg, escape) {
  let regex = RegCache[sourceReg] || (RegCache[sourceReg] = new RegExp(sourceReg, 'g'))
  let match

  while ((match = regex.exec(str))) {
    let prefix = str.slice(0, match.index)
    let inner = (escape ? '\\' : '') + '{{' + match[1] + '}}'
    let suffix = str.slice(match.index + match[0].length)

    str = prefix + inner + suffix
  }

  return str
}

Handlebars.setDelimiter = function (delimiters) {
  if (delimiters[0].slice(-1) !== '=') {
    delimiters[0] += '(?!=)'
  }

  let source = delimiters[0] + '([\\s\\S]+?)' + delimiters[1]

  if (!HandlebarsCompile) {
    HandlebarsCompile = Handlebars.compile
  }

  Handlebars.compile = function (str) {
    let args = [].slice.call(arguments)

    if (typeof str === 'string') {
      if (delimiters[0] !== '{{' && delimiters[1] !== '}}') {
        args[0] = replaceDelimiters(args[0], '{{([\\s\\S]+?)}}', true)
      }

      args[0] = replaceDelimiters(args[0], source)
    }

    return HandlebarsCompile.apply(Handlebars, args)
  }
}

/**
 * 格式化模板
 *
 * delimiter 匹配字符模板
 * template 格式化模板
 * options Handlebars配置
 * data 数据
 * @param {Object} delimiter
 * @returns {String}
 */
export default function ({ delimiter, template, options, data }) {
  delimiter && Handlebars.setDelimiter(delimiter)

  return Handlebars.compile(template, options)(data)
}
