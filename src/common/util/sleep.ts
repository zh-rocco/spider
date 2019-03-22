export default function sleep(time: number = 3000) {
  return new Promise(resolve => setTimeout(resolve, time));
}
