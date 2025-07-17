// 时间戳格式化
export function formatTimestamp(
  timestamp: number | string | null | undefined,
  format: string = "YYYY-MM-DD HH:mm:ss"
): string {
  if (timestamp === null || timestamp === undefined) return "";
  let numTimestamp: number;
  if (typeof timestamp === "string") {
    numTimestamp = parseInt(timestamp, 10);
    // 检查转换结果是否是有效的数字
    if (isNaN(numTimestamp)) {
      console.warn(
        "Invalid timestamp string provided. Returning original format string."
      );
      return format;
    }
  } else {
    numTimestamp = timestamp;
  }

  // 判断时间戳是秒级还是毫秒级，并统一转换为毫秒级
  // 如果时间戳小于 10 的 10 次方（通常认为是秒级），则乘以 1000 转换为毫秒
  const date = new Date(
    numTimestamp < 10000000000 ? numTimestamp * 1000 : numTimestamp
  );

  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 月份从0开始，所以要加1
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();

  // 定义一个对象，存储所有可替换的占位符及其对应的值
  const replacements: { [key: string]: string | number } = {
    YYYY: year,
    YY: String(year).slice(-2), // 取年份后两位
    MM: String(month).padStart(2, "0"), // 月份补零
    M: month,
    DD: String(day).padStart(2, "0"), // 日期补零
    D: day,
    HH: String(hours).padStart(2, "0"), // 24小时制小时补零
    H: hours,
    hh: String(hours % 12 || 12).padStart(2, "0"), // 12小时制小时补零 (0点和12点都显示为12)
    h: hours % 12 || 12,
    mm: String(minutes).padStart(2, "0"), // 分钟补零
    m: minutes,
    ss: String(seconds).padStart(2, "0"), // 秒补零
    s: seconds,
    SSS: String(milliseconds).padStart(3, "0"), // 毫秒补零
    SS: String(milliseconds).padStart(3, "0").slice(0, 2), // 毫秒前两位
    S: milliseconds,
  };

  let formattedString = format;
  // 遍历替换对象，将格式字符串中的占位符替换为实际值
  // 注意：为了避免例如 'MM' 替换后影响 'M'，需要按照占位符长度降序遍历
  // 这样 'YYYY' 会在 'YY' 之前被替换，'SSS' 会在 'SS' 和 'S' 之前被替换
  const sortedKeys = Object.keys(replacements).sort(
    (a, b) => b.length - a.length
  );

  for (const key of sortedKeys) {
    // 使用正则表达式进行全局替换
    formattedString = formattedString.replace(
      new RegExp(key, "g"),
      String(replacements[key])
    );
  }

  return formattedString;
}
