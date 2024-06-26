import { Request } from 'express';

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

export const getReqMainInfo: (req: Request) => {
  [prop: string]: any;
} = (req) => {
  const { query, headers, url, method, body, connection } = req;

  const xRealIp = headers['X-Real-IP'];
  const xForwardedFor = headers['X-Forwarded-For'];
  const { ip: cIp } = req;
  const { remoteAddress } = connection || {};
  const ip = xRealIp || xForwardedFor || cIp || remoteAddress;

  return {
    url,
    host: headers.host,
    ip,
    method,
    query,
    body,
  };
};
