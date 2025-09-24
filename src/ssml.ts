/**
 * SSML (Speech Synthesis Markup Language) is a subset of XML specifically
 * designed for controlling synthesis. You can see examples of how the SSML
 * should be parsed in `ssml.test.ts`.
 *
 * DO NOT USE CHATGPT, COPILOT, OR ANY AI CODING ASSISTANTS.
 * Conventional auto-complete and Intellisense are allowed.
 *
 * DO NOT USE ANY PRE-EXISTING XML PARSERS FOR THIS TASK.
 * You may use online references to understand the SSML specification, but DO NOT read
 * online references for implementing an XML/SSML parser.
 */

/** Parses SSML to a SSMLNode, throwing on invalid SSML */
export function parseSSML(ssml: string): SSMLNode {
  // NOTE: Don't forget to run unescapeXMLChars on the SSMLText
  ssml = unescapeXMLChars(ssml.trim())
  if (!ssml.startsWith('<') || !ssml.endsWith('>')) {
    throw new Error('Invalid SSML: Must start with < and end with >')
  }
  // Very naive implementation, replace with actual parsing logic


  function parseSSMLRecursive(ssml: string): SSMLNode {
    ssml = ssml.trim();
    const tagMatch = ssml.match(/<\s*(\w+)([^>]*)>(.*?)<\/\s*\1\s*>/s)
    fsfasfasfafsdfsdfsfsfdsdfsdfdsfsdfds

    return { name: '', attributes: [], children: [ssml] };
  }
  const tagMatch = ssml.match(/^<\s*(\w+)([^>]*)>(.*?)<\/\s*\1\s*>$/s)
  if (!tagMatch) {
    throw new Error('Invalid SSML: Malformed tag')
  }
  console.log('ssml', ssml, tagMatch);
  const tagName = tagMatch[1]
  const attrString = tagMatch[2].trim()
  const innerContent = tagMatch[3].trim()

  const attributes: SSMLAttribute[] = []
  if (attrString) {
    const attrRegex = /([a-zA-Z0-9:_-]+)\s*=\s*"([^"]*)"/g
    let match
    while ((match = attrRegex.exec(attrString)) !== null) {
      attributes.push({ name: match[1], value: match[2] })
    }
    const totalAttrLength = attributes.reduce((sum, attr) => sum + attr.name.length + attr.value.length + 3, 0)
    if (totalAttrLength !== attrString.replace(/\s+/g, '').length) {
      throw new Error('Invalid SSML: Malformed attributes')
    }
  }

  const children: SSMLNode[] = []
  let remainingContent = innerContent
  while (remainingContent) {
    if (remainingContent.startsWith('<')) {
      const childTagMatch = remainingContent.match(/^<\s*([a-zA-Z0-9:_-]+)([^>]*)>(.*?)(<\/\s*\1\s*>|\/>)/s)
      if (!childTagMatch) {
        throw new Error('Invalid SSML: Malformed child tag')
      }
      const childTagName = childTagMatch[1]
      const childAttrString = childTagMatch[2].trim()
      const childInnerContent = childTagMatch[3].trim()
      const childClosingTag = childTagMatch[4]

      const childAttributes: SSMLAttribute[] = []
      if (childAttrString) {
        const childAttrRegex = /([a-zA-Z0-9:_-]+)\s*=\s*"([^"]*)"/g
        let childMatch
        while ((childMatch = childAttrRegex.exec(childAttrString)) !== null) {
          childAttributes.push({ name: childMatch[1], value: childMatch[2] })
        }
        const totalChildAttrLength = childAttributes.reduce((sum, attr) => sum + attr.name.length + attr.value.length + 3, 0)
        if (totalChildAttrLength !== childAttrString.replace(/\s+/g, '').length) {
          throw new Error('Invalid SSML: Malformed child attributes')
        }
      }

      if (childClosingTag === '/>') {
        children.push({ name: childTagName, attributes: childAttributes, children: [] })
        remainingContent = remainingContent.slice(childTagMatch[0].length).trim()
      } else {
        const closingTagIndex = remainingContent.indexOf(`</${childTagName}>`)
        if (closingTagIndex === -1) {
          throw new Error('Invalid SSML: Missing closing tag for child')
        }
        const fullChildTag = remainingContent.slice(0, closingTagIndex + childTagName.length + 3)
        children.push({
          name: childTagName,
          attributes: childAttributes,
          children: [unescapeXMLChars(childInnerContent)],
        })
        remainingContent = remainingContent.slice(fullChildTag.length).trim()
      }
    } else {
      const textEndIndex = remainingContent.indexOf('<')
      if (textEndIndex === -1) {
        children.push(unescapeXMLChars(remainingContent))
        remainingContent = ''
      } else {
        const textContent = remainingContent.slice(0, textEndIndex)
        children.push(unescapeXMLChars(textContent))
        remainingContent = remainingContent.slice(textEndIndex).trim()
      }
    }
  }

  if (tagName !== 'speak') {
    throw new Error('Invalid SSML: Root tag must be <speak>')
  }

  return { name: tagName, attributes, children };
}

/** Recursively converts SSML node to string and unescapes XML chars */
export function ssmlNodeToText(node: SSMLNode): string {
  return ''
}

// Already done for you
const unescapeXMLChars = (text: string) =>
  text.replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&')

type SSMLNode = SSMLTag | SSMLText
type SSMLTag = {
  name: string
  attributes: SSMLAttribute[]
  children: SSMLNode[]
}
type SSMLText = string
type SSMLAttribute = { name: string; value: string }
