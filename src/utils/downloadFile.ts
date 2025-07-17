import { ElMessage } from "element-plus";

/**
 * 下载文件函数的选项接口
 */
interface DownloadOptions {
  /** 文件的 URL。函数将异步获取此 URL 的内容以供下载。 */
  url?: string;
  /** 文件的 Blob 或 File 对象。如果提供，将直接从该对象下载。 */
  blob?: Blob | File;
  /** 下载文件的名称（必须包含扩展名），例如 "document.pdf"。 */
  fileName: string;
}

/**
 * 封装的下载文件函数，支持从 URL 或 Blob 下载。
 * 对于 URL，它会通过 fetch 获取文件内容来强制触发下载，绕过浏览器预览。
 *
 * @param {DownloadOptions} options - 下载选项
 * @returns {Promise<void>} 一个在下载开始后解析的 Promise
 */
export async function downloadFile(options: DownloadOptions): Promise<void> {
  const { url, blob, fileName } = options;

  if (!fileName) {
    console.error("下载失败：必须提供 fileName。");
    return Promise.reject(new Error("fileName is required."));
  }

  let fileBlob: Blob;

  try {
    if (blob) {
      fileBlob = blob;
    } else if (url) {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `网络请求失败: ${response.status} ${response.statusText}`
        );
      }
      fileBlob = await response.blob();
    } else {
      throw new Error("下载失败：未提供有效的下载源 (url 或 blob)。");
    }

    const objectUrl = URL.createObjectURL(fileBlob);

    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
  } catch (error: any) {
    return Promise.reject(error);
  }
}
