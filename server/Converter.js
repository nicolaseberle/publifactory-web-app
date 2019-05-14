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
      strong: {
        strong: /<strong>(.*?)<\/strong>/,
        bold: /<b>(.*?)<\/b>/
      },
      emphasis: {
        emphasis: /<em>(.*?)<\/em>/,
        italic: /<i>(.*?)<\/i>/
      },
      hr: /<hr.?\/>/,
      href: /<a href=(.*?)>(.*?)<\/a>/,
      preCode: /<pre><code>(.*?)<\/code><\/pre>/,
      code: /<code>(.*?)<\/code>/,
      sub: /<sub>(.*?)<\/sub>/,
      sup: /<sup>(.*?)<\/sup>/,
      quote: /<blockquote>(.*?)<\/blockquote>/,
      strike: {
        simplified: /<s>(.*?)<\/s>/,
        full: /<strike>(.*?)<\/strike>/
      },
      list: {
        unordered: /<ul>(.*?)<\/ul>/m,
        ordered: /<ol>(.*?)<\/ol>/m,
        elem: /<li>(.*?)<\/li>/
      }
    };
    this.MarkdownRegex = {
      strong: {
        stars: /\*{2}(.*?)\*{2}/,
        underscore: /_{2}(.*?)_{2}/
      },
      emphasis: /\*(.*?)\*/,
      hr: {
        dash: /-{3,}/,
        stars: /\*{3,}/,
        underscore: /_{3,}/
      },
      href: /\[(.*?)]\((.*?)\)/,
      preCode: /```(.*?)```/,
      code: /`(.*?)`/,
      sub: /\^\(_(.*?)\)/,
      sup: /\^\((.*?)\)/,
      quote: /^> (.*?)$/,
      strike: /~~(.*?)~~/,
      // TODO Trouver le moyen de faire fonctionner le regex from md to ltx / LE
      list: {
        unordered: /[*|-] (.*?)\n/,
        ordered: /([0-9]+)\. (.*?)\n/
      }
    };
    this.LatexRegex = {
      strong: /\\textbf{(.*?)}/,
      emphasis: /\\emph{(.*?)}/,
      hr: /\\begin{.*?}\\rule{.*?\\linewidth}{.*?\\linethickness}\\end{.*?}/,
      href: /\\href{(.*?)}{(.*?)}/,
      preCode: /\\begin{verbatim}(.*?)\\end{verbatim}/,
      code: /\\texttt{(.*?)}/,
      sub: /\\textsubscript{(.*?)}/,
      sup: /\\textsuperscript{(.*?)}/,
      quote: /\\begin{quote}(.*?)\\end{quote}/,
      strike: /\\sout{(.*?)}/,
      list: {
        list: /\\begin{(.*?)}\\tightlist(.*?)\\end{.*?}/,
        elem: /\\item ([a-zA-Z ]+)/
      }
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
 * This class is used to convert the markup of the different other languages
 * This class contains several methods which permit to actually translate your Mardown Editor text into :
 *   - Light Editor
 *   - LaTeX
 */
class ConverterMarkdown extends Converter {
  constructor () {
    super("markdown");
  }

  replaceMarkdownOccurrence (string, destFormat) {
    const MarkdownRegex = super.getRegex.getMarkdownRegex
    let matches;
    while ((matches = MarkdownRegex.strong.underscore.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'latex' ? `\\textbf{${matches[1]}}` : `<strong>${matches[1]}</strong>`);
    while ((matches = MarkdownRegex.strong.stars.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'latex' ? `\\textbf{${matches[1]}}` : `<strong>${matches[1]}</strong>`);
    while ((matches = MarkdownRegex.emphasis.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'latex' ? `\\emph{${matches[1]}}` : `<em>${matches[1]}</em>`);
    while ((matches = MarkdownRegex.hr.stars.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'light' ? `\\begin{center}\\rule{0.5\\linewidth}{\\linethickness}\\end{center}` : `<hr />`);
    while ((matches = MarkdownRegex.hr.dash.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'light' ? `\\begin{center}\\rule{0.5\\linewidth}{\\linethickness}\\end{center}` : `<hr />`);
    while ((matches = MarkdownRegex.hr.underscore.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'light' ? `\\begin{center}\\rule{0.5\\linewidth}{\\linethickness}\\end{center}` : `<hr />`);
    while ((matches = MarkdownRegex.href.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'latex' ? `\\href{${matches[2]}}{${matches[1]}}` : `<a href=${matches[2]}>${matches[1]}</a>`);
    while ((matches = MarkdownRegex.preCode.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'latex' ? `\\begin{verbatim}${matches[1]}\\end{verbatim}` :
          `<pre><code>${matches[1]}</code></pre>`);
    while ((matches = MarkdownRegex.code.exec(string)) !== null)
      string = string.replace(matches[0], destFormat === 'latex' ? `\\texttt{${matches[1]}}` :
        `<code>${matches[1]}</code>`);
    while ((matches = MarkdownRegex.sub.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'latex' ? `\\textsubscript{${matches[1]}}` : `<sub>${matches[1]}</sub>`);
    while ((matches = MarkdownRegex.sup.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'latex' ? `\\textsuperscript{${matches[1]}}` : `<sup>${matches[1]}</sup>`);
    while ((matches = MarkdownRegex.quote.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'latex' ? `\\textgreater{}${matches[1]}` : `<blockquote>${matches[1]}</blockquote>`);
    while ((matches = MarkdownRegex.strike.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'latex' ? `\\sout{${matches[1]}}` : `<s>${matches[1]}</s>`);
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
 * This class is used to convert the markup of the different other languages
 * This class contains several methods which permit to actually translate your LaTeX Editor text into :
 *   - Markdown
 *   - Light Editor
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
        destFormat === 'light' ? `<em>${matches[1]}</em>` : `*${matches[1]}*`);
    while ((matches = LatexRegex.strong.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'light' ? `<strong>${matches[1]}</strong>` : `**${matches[1]}**`);
    while ((matches = LatexRegex.hr.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'light' ? `\\begin{center}\\rule{0.5\\linewidth}{\\linethickness}\\end{center}` : `<hr />`);
    while ((matches = LatexRegex.href.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'light' ? `<a href=${matches[1]}>${matches[2]}</a>` : `[${matches[2]}](${matches[1]})`);
    while ((matches = LatexRegex.preCode.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'light' ? `<pre><code>${matches[1]}</code></pre>` : `\`\`\`${matches[1]}\`\`\``);
    while ((matches = LatexRegex.code.exec(string)) !== null)
      string = string.replace(matches[0], destFormat === 'light' ? `<code>${matches[1]}</code>` : `\`${matches[1]}\``);
    while ((matches = LatexRegex.sub.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'light' ? `<sub>${matches[1]}</sub>` : `^(_${matches[1]})`);
    while ((matches = LatexRegex.sup.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'light' ? `<sup>${matches[1]}</sup>` : `^(${matches[1]})`);
    while ((matches = LatexRegex.quote.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'light' ? `<blockquote>${matches[1]}</blockquote>` : `> ${matches[1]}\n`);
    while ((matches = LatexRegex.strike.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'light' ? `<s>${matches[1]}</s>` : `~~${matches[1]}~~`);
    while ((matches = LatexRegex.list.list.exec(string)) !== null) {
      let iterator = 1, tmpValue = [], tmpString = matches[2];
      while ((tmpValue = LatexRegex.list.elem.exec(matches[2])) !== null) {
        tmpString = tmpString.replace(tmpValue[0], destFormat === 'light' ? `<li>${tmpValue[1]}</li>` :
          (matches[1] === 'enumerate' ? `${iterator}. ${tmpValue[1]}\n` : `- ${tmpValue[1]}\n`));
        iterator++;
      }
      string = string.replace(matches[0], destFormat === 'light' ?
        (matches[1] === 'enumerate' ? `<ol>${tmpString}</ol>` : `<ul>${tmpString}</ul>`) : `\n${tmpString}`);
    }
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
    light.title = this.replaceLatexOccurrence(article.title, "light");
    light.abstract = this.replaceLatexOccurrence(article.abstract, "light");
    light.arr_content = [];
    for (let i = 0, len = article.arr_content.length; i < len; ++i) {
      light.arr_content[i] = {};
      light.arr_content[i].title = this.replaceLatexOccurrence(article.arr_content[i].title, "light");
      light.arr_content[i].block = [[]];
      for (let j = 0, len = article.arr_content[i].block.length; j < len; ++j) {
        light.arr_content[i].block[j] = [{}];
        for (let k = 0, sLen = article.arr_content[i].block[j].length; k < sLen; ++k) {
          light.arr_content[i].block[j][k].type = article.arr_content[i].block[j][k].type;
          light.arr_content[i].block[j][k].uuid = article.arr_content[i].block[j][k].uuid;
          if (light.arr_content[i].block[j][k].type === 'text')
            light.arr_content[i].block[j][k].content = this.replaceLatexOccurrence(article.arr_content[i].block[j][k].content, "light");
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
    while ((matches = HtmlRegex.emphasis.emphasis.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'latex' ? `\\emph{${matches[1]}}` : `*${matches[1]}*`);
    while ((matches = HtmlRegex.emphasis.italic.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'latex' ? `\\emph{${matches[1]}}` : `*${matches[1]}*`);
    while ((matches = HtmlRegex.strong.strong.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'latex' ? `\\textbf{${matches[1]}}` : `**${matches[1]}**`);
    while ((matches = HtmlRegex.strong.bold.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'latex' ? `\\textbf{${matches[1]}}` : `**${matches[1]}**`);
    while ((matches = HtmlRegex.hr.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'latex' ? `\\begin{center}\\rule{0.5\\linewidth}{\\linethickness}\\end{center}` : `---`);
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
    while ((matches = HtmlRegex.strike.simplified.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'latex' ? `\\sout{${matches[1]}}` : `~~${matches[1]}~~`);
    while ((matches = HtmlRegex.strike.full.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'latex' ? `\\sout{${matches[1]}}` : `~~${matches[1]}~~`);
    while ((matches = HtmlRegex.list.elem.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'latex' ? `\\item ${matches[1]}` : `- ${matches[1]}\n`);
    while ((matches = HtmlRegex.list.ordered.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'latex' ? `\\begin{enumerate}\\tightlist${matches[1]}\\end{enumerate}` : `\n${matches[1]}`);
    while ((matches = HtmlRegex.list.unordered.exec(string)) !== null)
      string = string.replace(matches[0],
        destFormat === 'latex' ? `\\begin{itemize}\\tightlist${matches[1]}\\end{enumerate}` : `\n${matches[1]}`);
    console.log(string);
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
 * This route able to convert a format to another.
 * It take in parameters :
 *   - @params sourceFormat -> the source format to convert.
 *   - @params destFormat   -> the format needed.
 * It take in the body field the article models, in json format.
 * It will return a json with parameters success: true and response: containing the translated article.
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
