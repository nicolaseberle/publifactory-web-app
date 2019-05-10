'use strict';

const express = require('express')
const router = express.Router()

/**
 * This class contains every Regular expression use to translate text
 * from a programming language to another.
 * He actually contains :
 *   - HTML
 *   - Markdown
 *   - LaTeX
 */
class Regex {
  constructor () {
    this.HtmlRegex = {
      strong: /(<strong>(.*?)<\/strong>)/g,
      emphasis: /(<em>(.*?)<\/em>)/g,
      hr: /<hr.?\/>/g,
      href: /(<a href=(.*?)>(.*?)<\/a>)/g,
      preCode: /(<pre><code>(.*?)<\/code><\/pre>)/g,
      code: /(<code>(.*?)<\/code>)/g,
      sub: /(<sub>(.*?)<\/sub>)/g,
      sup: /(<sup>(.*?)<\/sup>)/g,
      quote: /(<blockquote>(.*?)<\/blockquote>)/g
    };
    this.MarkdownRegex = {
      strong: /(\*{2}(\w*)\*{2})/g,
      emphasis: /(\*(\w*)\*)/g,
      hr: /(-{3,})/g,
      href: /(\[(.*?)]\((.*?)\))/g,
      preCode: /(```(.*?)```)/g,
      code: /(`(.*?)`)/g,
      sub: /(\^\(_(.*?)\))/g,
      sup: /(\^\((.*?)\))/g,
      quote: /(^> (.*?)$)/g
    };
    this.LatexRegex = {
      strong: /(\\textbf{(.*?)})/g,
      emphasis: /(\\emph{(.*?)})/g,
      hr: /(\\begin{.*?}\\rule{.*?\\linewidth}{.*?\\linethickness}\\end{.*?})/g,
      href: /(\\href{(.*?)}{(.*?)})/g,
      preCode: /(\\begin{verbatim}(.*?)\\end{verbatim})/g,
      code: /(\\texttt{(.*?)})/g,
      sub: /(\\textsubscript{(.*?)})/g,
      sup: /(\\textsuperscript{(.*?)})/g,
      quote: /(\\begin{quote}(.*?)\\end{quote})/g
    };
  }

  get getHtmlRegex() {
    return this.HtmlRegex;
  }

  get getLatexRegex() {
    return this.LatexRegex;
  }

  get getMarkdownRegex() {
    return this.MarkdownRegex;
  }
}

/**
 * This class is the pseudo-Interface of the Converter of language.
 * He extends Latex, Markdown and Light Editor converters.
 */
class Converter {
  constructor (originFileType) {
    this.originFileType = originFileType
    this.regex = new Regex;
    if (!Converter.fileTypeExist(this.originFileType))
      throw new Error('This file type isn\'t covered yet.')
  }

  static fileTypeExist (fileType) {
    return ['markdown', 'latex', 'light'].includes(fileType)
  }

  get getOriginFileType() {
    return this.originFileType
  }

  set setOriginFileType(originFileType) {
    this.originFileType = originFileType
  }

  get getRegex() {
    return this.regex;
  }
}

/**
 * TODO TBD
 */
class ConverterMarkdown extends Converter {
  constructor () {
    super("markdown");
  }

  async convertToLatex () {

  }

  convertToLightEditor() {

  }
}

/**
 * TODO TBD
 */
class ConverterLatex extends Converter {
  constructor () {
    super("markdown");
  }

  async convertToMarkdown () {

  }

  convertToLightEditor() {

  }
}

/**
 * This class is used to convert the markup of the different other languages
 * This class contains several methods which permit to actually translate your Light Editor text into :
 *   - Markdown
 *   - LaTeX
 */
class ConverterLight extends Converter {
  constructor () {
    super("light");
  }

  replaceHtmlOccurrence (string, destFormat) {
    const HtmlRegex = super.getRegex.getHtmlRegex;
    switch (true) {
      case HtmlRegex.strong.test(string):
        if (destFormat === 'latex') {

        } else {

        }
        break;
      case HtmlRegex.emphasis.test(string):
        if (destFormat === 'latex') {

        } else {

        }
        break;
      case HtmlRegex.hr.test(string):
        if (destFormat === 'latex') {

        } else {

        }
        break;
      case HtmlRegex.href.test(string):
        if (destFormat === 'latex') {

        } else {

        }
        break;
      case HtmlRegex.preCode.test(string):
        if (destFormat === 'latex') {

        } else {

        }
        break;
      case HtmlRegex.code.test(string):
        if (destFormat === 'latex') {

        } else {

        }
        break;
      case HtmlRegex.sub.test(string):
        if (destFormat === 'latex') {

        } else {

        }
        break;
      case HtmlRegex.sup.test(string):
        if (destFormat === 'latex') {

        } else {

        }
        break;
      case HtmlRegex.quote.test(string):
        if (destFormat === 'latex') {

        } else {

        }
        break;
    }
    return string;
  }

  convertToMarkdown (article) {
    let markdown = {};
    markdown.title = "# " + this.replaceHtmlOccurrence(article.title, "markdown");
    markdown.abstract = "#### " + this.replaceHtmlOccurrence(article.abstract, "markdown");
    markdown.arr_content = [];
    for (let i = 0, len = article.arr_content.length; i < len; ++i)
      markdown.arr_content[i].title = "## " + this.replaceHtmlOccurrence(article.arr_content[i].title, "markdown");
    markdown.blocks = [];
    for (let i = 0, len = article.blocks.length; i < len; ++i) {
      markdown.blocks[i] = [];
      for (let j = 0, sLen = article.blocks[i].length; j < sLen; ++j) {
        markdown.blocks[i][j].type = article.blocks[i][j].type;
        markdown.blocks[i][j].uuid = article.blocks[i][j].uuid;
        if (markdown.blocks[i][j].type === 'text')
          markdown.blocks[i][j].content = "### " + this.replaceHtmlOccurrence(article.blocks[i][j].content, "markdown");
        markdown.blocks[i][j].nbEdit = article.blocks[i][j].nbEdit;
      }
    }
    markdown.authors = article.authors;
    markdown.tags = article.tags;
    return markdown;
  }

  convertToLatex(article) {
    let latex = {};
    latex.title = "\\title{" + this.replaceHtmlOccurrence(article.title, "latex") + "}";
    latex.abstract = this.replaceHtmlOccurrence(article.abstract, "latex");
    latex.arr_content = [];
    for (let i = 0, len = article.arr_content.length; i < len; ++i)
      latex.arr_content[i].title = "\\section{" + this.replaceHtmlOccurrence(article.arr_content[i], "latex") + "}";
    latex.blocks = article.blocks;
    for (let i = 0, len = article.blocks.length; i < len; ++i) {
      latex.blocks[i] = [];
      for (let j = 0, sLen = article.blocks[i].length; j < sLen; ++j) {
        latex.blocks[i][j].type = article.blocks[i][j].type;
        latex.blocks[i][j].uuid = article.blocks[i][j].uuid;
        if (latex.blocks[i][j].type === 'text')
          latex.blocks[i][j].content = "### " + this.replaceHtmlOccurrence(article.blocks[i][j].content, "latex");
        latex.blocks[i][j].nbEdit = article.blocks[i][j].nbEdit;
      }
    }
    latex.authors = article.authors;
    latex.tags = article.tags;
    return latex;
  }
}

/**
 * TODO Implémenter cette route dans le code
 */
router.post('/:sourceFormat(markdown|latex|light)/:destFormat(markdown|latex|light)',
  async function (req, res, next) {
    try {
      let converter, response;
      if (req.params.sourceFormat === req.params.destFormat)
        throw new Error('You cannot convert a language to itself.')
      if (req.body.article === undefined)
        throw new Error('Article information is needed in the body field.')
      if (req.params.sourceFormat === 'markdown') {
        converter = new ConverterMarkdown;
        response = req.params.destFormat === 'latex' ?
          converter.convertToLatex() : converter.convertToLightEditor();
      } else if (req.params.sourceFormat === 'latex') {
        converter = new ConverterLatex;
        response = req.params.destFormat === 'markdown' ?
          converter.convertToMarkdown() : converter.convertToLightEditor();
      } else {
        converter = new ConverterLight;
        response = req.params.destFormat === 'latex' ?
          converter.convertToLatex() : converter.convertToMarkdown();
      }
      res.json({success: true, response: response});
    } catch (e) {
      res.status(e.code ? e.code : 500).json({
        success: false,
        message: e.message ? e.message : "An error occured"
      });
    }
})

module.exports = router;
