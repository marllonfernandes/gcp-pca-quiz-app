export function formatQuestionText(text) {
  if (!text) return '';
  
  // First escape all HTML characters to avoid <tags> being swallowed by v-html
  let escapedText = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  // Replace code blocks
  // ```language code ```
  let html = escapedText.replace(/```([\w-]*)\s*\n?([\s\S]*?)```/g, (match, language, code) => {
    return `<pre style="background-color: var(--bg-subtle, #f5f5f5); padding: 1rem; border-radius: 8px; overflow-x: auto; font-family: monospace; margin: 1rem 0;"><code class="language-${language}">${code}</code></pre>`;
  });
  
  // Replace inline code
  // `code`
  html = html.replace(/`([^`]+)`/g, (match, code) => {
    return `<code style="background-color: var(--bg-subtle, #f5f5f5); padding: 0.2rem 0.4rem; border-radius: 4px; font-family: monospace;">${code}</code>`;
  });
  
  // Convert markdown bold **bold** to <strong>
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  
  // Convert newlines to <br> for plain text outside of <pre> blocks
  let parts = html.split(/(<pre[\s\S]*?<\/pre>)/);
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) {
      // Not a <pre> block
      parts[i] = parts[i].replace(/\n/g, '<br/>');
    }
  }
  
  return parts.join('');
}
