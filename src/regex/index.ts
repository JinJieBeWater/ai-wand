const JavaScriptRegex = /(function\s+(\w+)|(?:const|let|var)\s+(\w+)\s*=\s*(?:function\s*(\w*)|\([^)]*\)\s*=>))/g

function getRegex() {
  return JavaScriptRegex
}

export { getRegex }
