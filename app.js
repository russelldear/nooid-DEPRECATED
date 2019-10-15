require ('newrelic');

var http = require("http");
var uuid = require('node-uuid');

var port = process.env.PORT || 8081

http.createServer(function (request, response) {

  try {

    if(request.headers && request.headers['accept'] && request.headers['accept'].includes('text/html')){
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.end(getHtml());
    } else {
      response.writeHead(200, {'Content-Type': 'text/plain'});
      response.end(uuid.v4());
    }

  } catch (err) {
    console.log(err);
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Soz! ' + err);
  }

}).listen(port);

// Console will print the message
console.log('Server running at http://127.0.0.1:8081/');

function getHtml(){
    var guid = uuid.v4();
    return `
    <html>
      <head>
        <style>
          textarea {
            width: 320px; 
            border-style: none; 
            border-color: transparent; 
            overflow: auto; 
            outline: none; 
            resize:none;
            font-size: 14px;
          }
        </style>
      </head>
      <body style='text-align: center; font-family: courier; padding: 10px;'>
        <textarea readonly='readonly' class='js-copytextarea'>`
         + guid + 
         `</textarea>
.
        <img title='Copy' class='js-textareacopybtn' style='vertical-align: top; margin-left: 5px;' src='https://s3-us-west-2.amazonaws.com/nooid/copy.png' />
        <img title='Refresh' style='vertical-align: top; margin-left: 5px;' src='https://s3-us-west-2.amazonaws.com/nooid/new.png' onclick='location.reload();' />
        ` + getScript() + `
      </body>
    </html>`;
}

function getScript(){
  return `
  <script>
  var copyTextareaBtn = document.querySelector('.js-textareacopybtn');
  copyTextareaBtn.addEventListener('click', function(event) {
    var copyTextarea = document.querySelector('.js-copytextarea');
    copyTextarea.select();
    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Copying text command was ' + msg);

      if (successful) {
        copyTextareaBtn.setAttribute('src', 'https://s3-us-west-2.amazonaws.com/nooid/tick.png');
        setTimeout(revertButton, 3000);
      }

    } catch (err) {
      console.log('Oops, unable to copy');
    } 
  });

  function revertButton(){
    copyTextareaBtn.setAttribute('src', 'https://s3-us-west-2.amazonaws.com/nooid/copy.png');
  }

  </script>`
}
