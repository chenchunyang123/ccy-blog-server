// 计算总字数
export function countSpecificCharacters(input) {
  // 匹配中文字符
  const chineseCharacterCount = (input.match(/[\p{Script=Han}]/gu) || [])
    .length;

  // 匹配英文单词
  const englishWordCount = (input.match(/\b\p{Script=Latin}+\b/gu) || [])
    .length;

  // 匹配数字
  const numberCount = (input.match(/\d+/g) || []).length;

  // 返回总数
  return chineseCharacterCount + englishWordCount + numberCount;
}

// 估算阅读时间 (一分钟约200字)
export function estimateReadingTimeInMinutes(input) {
  const length = countSpecificCharacters(input);
  const minutes = Math.ceil(length / 200);
  return minutes;
}
