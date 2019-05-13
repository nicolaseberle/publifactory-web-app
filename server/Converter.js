'use strict';

const express = require('express')
const router = express.Router()
const matchAll = require('string.prototype.matchall');

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
      strong: /<strong>(.*?)<\/strong>/g,
      emphasis: /<em>(.*?)<\/em>/gi,
      hr: /<hr.?\/>/g,
      href: /<a href=(.*?)>(.*?)<\/a>/g,
      preCode: /<pre><code>(.*?)<\/code><\/pre>/g,
      code: /<code>(.*?)<\/code>/g,
      sub: /<sub>(.*?)<\/sub>/g,
      sup: /<sup>(.*?)<\/sup>/g,
      quote: /<blockquote>(.*?)<\/blockquote>/g
    };
    this.MarkdownRegex = {
      strong: /\*{2}(\w*)\*{2}/g,
      emphasis: /\*(.*?)\*/g,
      hr: /-{3,}/g,
      href: /\[(.*?)]\((.*?)\)/g,
      preCode: /```(.*?)```/g,
      code: /`(.*?)`/g,
      sub: /\^\(_(.*?)\)/g,
      sup: /\^\((.*?)\)/g,
      quote: /^> (.*?)$/g
    };
    this.LatexRegex = {
      strong: /\\textbf{(.*?)}/g,
      emphasis: /\\emph{(.*?)}/g,
      hr: /\\begin{.*?}\\rule{.*?\\linewidth}{.*?\\linethickness}\\end{.*?}/g,
      href: /\\href{(.*?)}{(.*?)}/g,
      preCode: /\\begin{verbatim}(.*?)\\end{verbatim}/g,
      code: /\\texttt{(.*?)}/g,
      sub: /\\textsubscript{(.*?)}/g,
      sup: /\\textsuperscript{(.*?)}/g,
      quote: /\\begin{quote}(.*?)\\end{quote}/g
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

  replaceMarkdownOccurrence (string, destFormat) {
    const LatexRegex = super.getRegex.getMarkdownRegex
    let matches;
    while ((matches = LatexRegex.strong.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'latex' ? `\\textbf{${matches[1]}}` : `<strong>${matches[1]}</strong>`);
    while ((matches = LatexRegex.emphasis.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'latex' ? `\\emph{${matches[1]}}` : `<em>${matches[1]}</em>`);
    while ((matches = LatexRegex.hr.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'latex' ? `\\emph{${matches[1]}}` : `<hr />`);
    while ((matches = LatexRegex.href.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'latex' ? `\\href{${matches[2]}}{${matches[1]}}` : `<a href=${matches[2]}>${matches[1]}</a>`);
    while ((matches = LatexRegex.preCode.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'latex' ? `\\begin{verbatim}${matches[1]}\\end{verbatim}` :
          `<pre><code>${matches[1]}</code></pre>`);
    while ((matches = LatexRegex.code.exec(string)) !== null)
      string = string.replace(matches[0], destFormat === 'latex' ? `\\texttt{${matches[1]}}` :
        `<code>${matches[1]}</code>`);
    while ((matches = LatexRegex.sub.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'latex' ? `\\textsubscript{${matches[1]}}` : `<sub>${matches[1]}</sub>`);
    while ((matches = LatexRegex.sup.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'latex' ? `\\textsuperscript{${matches[1]}}` : `<sup>${matches[1]}</sup>`);
    while ((matches = LatexRegex.quote.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'latex' ? `\\textgreater{}${matches[1]}` : `<blockquote>${matches[1]}</blockquote>`);
    console.log(string);
    return string;
  }

  convertToLatex (article) {
    let latex = {};
    latex.title = "\\title{" + this.replaceMarkdownOccurrence(article.title, "latex") + "}";
    latex.abstract = this.replaceMarkdownOccurrence(article.abstract, "latex");
    latex.arr_content = [];
    for (let i = 0, len = article.arr_content.length; i < len; ++i) {
      latex.arr_content[i] = {};
      latex.arr_content[i].title = "\\section{" + this.replaceMarkdownOccurrence(article.arr_content[i].title, "latex") + "}";
      latex.arr_content[i].block = [[]];
      for (let j = 0, len = article.arr_content[i].block.length; j < len; ++j) {
        latex.arr_content[i].block[j] = [{}];
        for (let k = 0, sLen = article.arr_content[i].block[j].length; k < sLen; ++k) {
          latex.arr_content[i].block[j][k].type = article.arr_content[i].block[j][k].type;
          latex.arr_content[i].block[j][k].uuid = article.arr_content[i].block[j][k].uuid;
          if (latex.arr_content[i].block[j][k].type === 'text')
            latex.arr_content[i].block[j][k].content = this.replaceMarkdownOccurrence(article.arr_content[i].block[j][k].content, "latex");
          latex.arr_content[i].block[j][k].nbEdit = article.arr_content[i].block[j][k].nbEdit;
        }
      }
    }
    latex.authors = article.authors;
    latex.tags = article.tags;
    return latex;
  }

  convertToLightEditor(article) {
    let light = {};
    light.title = this.replaceMarkdownOccurrence(article.title, "light");
    light.abstract = this.replaceMarkdownOccurrence(article.abstract, "light");
    light.arr_content = [];
    for (let i = 0, len = article.arr_content.length; i < len; ++i) {
      light.arr_content[i] = {};
      light.arr_content[i].title = this.replaceMarkdownOccurrence(article.arr_content[i].title, "light");
      light.arr_content[i].block = [[]];
      for (let j = 0, len = article.arr_content[i].block.length; j < len; ++j) {
        light.arr_content[i].block[j] = [{}];
        for (let k = 0, sLen = article.arr_content[i].block[j].length; k < sLen; ++k) {
          light.arr_content[i].block[j][k].type = article.arr_content[i].block[j][k].type;
          light.arr_content[i].block[j][k].uuid = article.arr_content[i].block[j][k].uuid;
          if (light.arr_content[i].block[j][k].type === 'text')
            light.arr_content[i].block[j][k].content = this.replaceMarkdownOccurrence(article.arr_content[i].block[j][k].content, "light");
          light.arr_content[i].block[j][k].nbEdit = article.arr_content[i].block[j][k].nbEdit;
        }
      }
    }
    light.authors = article.authors;
    light.tags = article.tags;
    return light;
  }
}

/**
 * TODO TBD
 */
class ConverterLatex extends Converter {
  constructor () {
    super("markdown");
  }

  replaceLatexOccurrence (string, destFormat) {
    const LatexRegex = super.getRegex.getLatexRegex
    let matches;
    while ((matches = LatexRegex.emphasis.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'light' ? `\\emph{${matches[1]}}` : `*${matches[1]}*`);
    while ((matches = LatexRegex.strong.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'light' ? `\\textbf{${matches[1]}}` : `**${matches[1]}**`);
    while ((matches = LatexRegex.hr.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'light' ? `\\emph{${matches[1]}}` : `*${matches[1]}*`);
    while ((matches = LatexRegex.href.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'light' ? `\\href{${matches[1]}}{${matches[2]}}` : `[${matches[2]}](${matches[1]})`);
    while ((matches = LatexRegex.preCode.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'light' ? `\\begin{verbatim}${matches[1]}\\end{verbatim}` : `\`\`\`${matches[1]}\`\`\``);
    while ((matches = LatexRegex.code.exec(string)) !== null)
      string = string.replace(matches[0], destFormat === 'light' ? `\\texttt{${matches[1]}}` : `\`${matches[1]}\``);
    while ((matches = LatexRegex.sub.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'light' ? `\\textsubscript{${matches[1]}}` : `^(_${matches[1]})`);
    while ((matches = LatexRegex.sup.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'light' ? `\\textsuperscript{${matches[1]}}` : `^(${matches[1]})`);
    while ((matches = LatexRegex.quote.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'light' ? `\\textgreater{}${matches[1]}` : `> ${matches[1]}\n`);
    return string;
  }

  convertToMarkdown (article) {
    let markdown = {};
    markdown.title = "# " + this.replaceLatexOccurrence(article.title, "markdown");
    markdown.abstract = "#### " + this.replaceLatexOccurrence(article.abstract, "markdown");
    markdown.arr_content = [];
    for (let i = 0, len = article.arr_content.length; i < len; ++i) {
      markdown.arr_content[i] = {};
      markdown.arr_content[i].title = "## " + this.replaceLatexOccurrence(article.arr_content[i].title, "markdown");
      markdown.arr_content[i].block = [[]];
      for (let j = 0, len = article.arr_content[i].block.length; j < len; ++j) {
        markdown.arr_content[i].block[j] = [{}];
        for (let k = 0, sLen = article.arr_content[i].block[j].length; k < sLen; ++k) {
          markdown.arr_content[i].block[j][k].type = article.arr_content[i].block[j][k].type;
          markdown.arr_content[i].block[j][k].uuid = article.arr_content[i].block[j][k].uuid;
          if (markdown.arr_content[i].block[j][k].type === 'text')
            markdown.arr_content[i].block[j][k].content = "### " + this.replaceLatexOccurrence(article.arr_content[i].block[j][k].content, "markdown");
          markdown.arr_content[i].block[j][k].nbEdit = article.arr_content[i].block[j][k].nbEdit;
        }
      }
    }
    markdown.authors = article.authors;
    markdown.tags = article.tags;
    return markdown;
  }

  convertToLightEditor(article) {
    let light = {};
    light.title = this.replaceHtmlOccurrence(article.title, "light");
    light.abstract = this.replaceHtmlOccurrence(article.abstract, "light");
    light.arr_content = [];
    for (let i = 0, len = article.arr_content.length; i < len; ++i) {
      light.arr_content[i] = {};
      light.arr_content[i].title = this.replaceHtmlOccurrence(article.arr_content[i].title, "light");
      light.arr_content[i].block = [[]];
      for (let j = 0, len = article.arr_content[i].block.length; j < len; ++j) {
        light.arr_content[i].block[j] = [{}];
        for (let k = 0, sLen = article.arr_content[i].block[j].length; k < sLen; ++k) {
          light.arr_content[i].block[j][k].type = article.arr_content[i].block[j][k].type;
          light.arr_content[i].block[j][k].uuid = article.arr_content[i].block[j][k].uuid;
          if (light.arr_content[i].block[j][k].type === 'text')
            light.arr_content[i].block[j][k].content = this.replaceHtmlOccurrence(article.arr_content[i].block[j][k].content, "light");
          light.arr_content[i].block[j][k].nbEdit = article.arr_content[i].block[j][k].nbEdit;
        }
      }
    }
    light.authors = article.authors;
    light.tags = article.tags;
    return light;
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
    let matches;
    while ((matches = HtmlRegex.emphasis.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'latex' ? `\\emph{${matches[1]}}` : `*${matches[1]}*`);
    while ((matches = HtmlRegex.strong.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'latex' ? `\\textbf{${matches[1]}}` : `**${matches[1]}**`);
    while ((matches = HtmlRegex.hr.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'latex' ? `\\emph{${matches[1]}}` : `*${matches[1]}*`);
    while ((matches = HtmlRegex.href.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'latex' ? `\\href{${matches[1]}}{${matches[2]}}` : `[${matches[2]}](${matches[1]})`);
    while ((matches = HtmlRegex.preCode.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'latex' ? `\\begin{verbatim}${matches[1]}\\end{verbatim}` : `\`\`\`${matches[1]}\`\`\``);
    while ((matches = HtmlRegex.code.exec(string)) !== null)
      string = string.replace(matches[0], destFormat === 'latex' ? `\\texttt{${matches[1]}}` : `\`${matches[1]}\``);
    while ((matches = HtmlRegex.sub.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'latex' ? `\\textsubscript{${matches[1]}}` : `^(_${matches[1]})`);
    while ((matches = HtmlRegex.sup.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'latex' ? `\\textsuperscript{${matches[1]}}` : `^(${matches[1]})`);
    while ((matches = HtmlRegex.quote.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'latex' ? `\\textgreater{}${matches[1]}` : `> ${matches[1]}\n`);
    return string;
  }

  convertToMarkdown (article) {
    let markdown = {};
    markdown.title = "# " + this.replaceHtmlOccurrence(article.title, "markdown");
    markdown.abstract = "#### " + this.replaceHtmlOccurrence(article.abstract, "markdown");
    markdown.arr_content = [];
    for (let i = 0, len = article.arr_content.length; i < len; ++i) {
      markdown.arr_content[i] = {};
      markdown.arr_content[i].title = "## " + this.replaceHtmlOccurrence(article.arr_content[i].title, "markdown");
      markdown.arr_content[i].block = [[]];
      for (let j = 0, len = article.arr_content[i].block.length; j < len; ++j) {
        markdown.arr_content[i].block[j] = [{}];
        for (let k = 0, sLen = article.arr_content[i].block[j].length; k < sLen; ++k) {
          markdown.arr_content[i].block[j][k].type = article.arr_content[i].block[j][k].type;
          markdown.arr_content[i].block[j][k].uuid = article.arr_content[i].block[j][k].uuid;
          if (markdown.arr_content[i].block[j][k].type === 'text')
            markdown.arr_content[i].block[j][k].content = "### " + this.replaceHtmlOccurrence(article.arr_content[i].block[j][k].content, "markdown");
          markdown.arr_content[i].block[j][k].nbEdit = article.arr_content[i].block[j][k].nbEdit;
        }
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
    for (let i = 0, len = article.arr_content.length; i < len; ++i) {
      latex.arr_content[i] = {};
      latex.arr_content[i].title = "\\section{" + this.replaceHtmlOccurrence(article.arr_content[i].title, "latex") + "}";
      latex.arr_content[i].block = [[]];
      for (let j = 0, len = article.arr_content[i].block.length; j < len; ++j) {
        latex.arr_content[i].block[j] = [{}];
        for (let k = 0, sLen = article.arr_content[i].block[j].length; k < sLen; ++k) {
          latex.arr_content[i].block[j][k].type = article.arr_content[i].block[j][k].type;
          latex.arr_content[i].block[j][k].uuid = article.arr_content[i].block[j][k].uuid;
          if (latex.arr_content[i].block[j][k].type === 'text')
            latex.arr_content[i].block[j][k].content = this.replaceHtmlOccurrence(article.arr_content[i].block[j][k].content, "latex");
          latex.arr_content[i].block[j][k].nbEdit = article.arr_content[i].block[j][k].nbEdit;
        }
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
          converter.convertToLatex(req.body.article) : converter.convertToLightEditor(req.body.article);
      } else if (req.params.sourceFormat === 'latex') {
        converter = new ConverterLatex;
        response = req.params.destFormat === 'markdown' ?
          converter.convertToMarkdown(req.body.article) : converter.convertToLightEditor(req.body.article);
      } else {
        converter = new ConverterLight;
        response = req.params.destFormat === 'latex' ?
          converter.convertToLatex(req.body.article) : converter.convertToMarkdown(req.body.article);
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
