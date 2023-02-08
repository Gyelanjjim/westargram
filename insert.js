// const { appDataSource } = require('./src/models/dataSource');
const fileSystem = require('fs')

const likes = fileSystem.readFileSync('./likes.csv', 'utf-8')
const comments = fileSystem.readFileSync('./comments.csv', 'utf-8')

const csvToObject = (csv) => {
  csv = csv.replace(/\r/g, '') // users에 있는 \r을 제거
  csv = csv.replace(/, /g, "\',\'") // posts에 있는 ", "을 ","로 변경
  //   const rows = csv
  //     .trim() // 양옆의 공백, 개행문자 삭제
  //     .split('\n')
  //     .map((el) => el.split(','));
  //   const result = [];
  //   rows[0];
  console.log(csv)
  const rows = csv.split('\n')
  const result = `INSERT likes INTO (${rows[0]}) VALUES ('${rows[1]}')`
  return result
}

const likesArr = csvToObject(likes)

console.log(likesArr)
