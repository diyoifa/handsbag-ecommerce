const requestLogger = (request, response, next) => {
  console.log(
    '----------------------------', '\n',
     'CLIENT REQUEST', '\n',
     'Method: ', request.method, '\n', 
     'Path: ', request.path, '\n', 
    //  'Headers: ', request.headers, '\n',
     'Body: ', request.body, '\n',

     '---------------------------')
  // console.log('Path:  ', request.path)
  // console.log('Body:  ', request.body)
    next()
  }

module.exports = requestLogger;