/**
 * 秒数をMM:SS形式に変換
 * @param seconds - 秒数
 * @returns MM:SS形式の文字列（例: "25:00", "05:03"）
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${paddedMinutes}:${paddedSeconds}`;
}
