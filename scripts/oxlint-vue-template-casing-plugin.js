const HTML_TAGS = new Set([
  'a',
  'abbr',
  'address',
  'area',
  'article',
  'aside',
  'audio',
  'b',
  'base',
  'bdi',
  'bdo',
  'blockquote',
  'body',
  'br',
  'button',
  'canvas',
  'caption',
  'cite',
  'code',
  'col',
  'colgroup',
  'data',
  'datalist',
  'dd',
  'del',
  'details',
  'dfn',
  'dialog',
  'div',
  'dl',
  'dt',
  'em',
  'embed',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'head',
  'header',
  'hgroup',
  'hr',
  'html',
  'i',
  'iframe',
  'img',
  'input',
  'ins',
  'kbd',
  'label',
  'legend',
  'li',
  'link',
  'main',
  'map',
  'mark',
  'menu',
  'meta',
  'meter',
  'nav',
  'noscript',
  'object',
  'ol',
  'optgroup',
  'option',
  'output',
  'p',
  'picture',
  'pre',
  'progress',
  'q',
  'rp',
  'rt',
  'ruby',
  's',
  'samp',
  'script',
  'search',
  'section',
  'select',
  'slot',
  'small',
  'source',
  'span',
  'strong',
  'style',
  'sub',
  'summary',
  'sup',
  'table',
  'tbody',
  'td',
  'template',
  'textarea',
  'tfoot',
  'th',
  'thead',
  'time',
  'title',
  'tr',
  'track',
  'u',
  'ul',
  'var',
  'video',
  'wbr',
]);

function isPascalCase(name) {
  return /^[A-Z][A-Za-z0-9]*$/.test(name);
}

function isHtmlTag(name) {
  return HTML_TAGS.has(name);
}

function getTemplateRanges(source) {
  const ranges = [];
  const templatePattern = /<template(?:\s[^>]*)?>([\s\S]*?)<\/template>/g;

  let match = templatePattern.exec(source);
  while (match !== null) {
    const fullMatch = match[0];
    const inner = match[1] ?? '';
    const innerStartOffset = match.index + fullMatch.indexOf(inner);
    ranges.push({
      content: inner,
      startOffset: innerStartOffset,
    });
    match = templatePattern.exec(source);
  }

  return ranges;
}

function collectInvalidTags(templateContent, startOffset) {
  const invalidTags = [];
  const tagPattern = /<\/?\s*([A-Za-z][\w-]*)\b/g;

  let match = tagPattern.exec(templateContent);
  while (match !== null) {
    const fullTag = match[0];
    const tagName = match[1];
    const normalizedTagName = tagName.toLowerCase();

    if (fullTag.startsWith('</')) continue;
    if (!tagName.includes('-')) continue;
    if (isHtmlTag(normalizedTagName)) continue;

    const pascalName = tagName
      .split('-')
      .filter(Boolean)
      .map((segment) => segment[0].toUpperCase() + segment.slice(1))
      .join('');

    if (isPascalCase(tagName) || !isPascalCase(pascalName)) continue;

    invalidTags.push({
      tagName,
      pascalName,
      start: startOffset + match.index,
      end: startOffset + match.index + fullTag.length,
    });
    match = tagPattern.exec(templateContent);
  }

  return invalidTags;
}

export default {
  meta: {
    name: 'local-vue-template-casing',
  },
  rules: {
    'component-name-in-template-casing': {
      meta: {
        type: 'suggestion',
        docs: {
          description:
            'enforce PascalCase for Vue component tags in SFC templates',
        },
        messages: {
          usePascalCase:
            'Component tag "{{tagName}}" should use PascalCase "{{pascalName}}".',
        },
      },
      create(context) {
        const filename = context.filename;
        if (!filename.endsWith('.vue')) {
          return {};
        }

        return {
          Program() {
            const source = context.sourceCode.text;
            const templateRanges = getTemplateRanges(source);

            for (const templateRange of templateRanges) {
              const invalidTags = collectInvalidTags(
                templateRange.content,
                templateRange.startOffset,
              );

              for (const invalidTag of invalidTags) {
                context.report({
                  messageId: 'usePascalCase',
                  data: {
                    tagName: invalidTag.tagName,
                    pascalName: invalidTag.pascalName,
                  },
                  loc: {
                    start: context.sourceCode.getLocFromIndex(invalidTag.start),
                    end: context.sourceCode.getLocFromIndex(invalidTag.end),
                  },
                });
              }
            }
          },
        };
      },
    },
  },
};
