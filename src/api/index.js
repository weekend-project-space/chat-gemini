// export async function req(data) {
//   const API_BASE = localStorage.getItem('geminiApi') || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key='
//   const API = API_BASE + localStorage.getItem('geminiKey')
//   return await (await fetch(API, {
//     method: 'POST',
//     body: JSON.stringify(data)
//   })).json()
// }


// async function f() {
//   await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:streamGenerateContent?key=AIzaSyDp2ZFINm52zyxLE0-Z4GXVd-_oycmwJOc", {
//       method: 'POST',
//       body: JSON.stringify({
//         "contents": [{
//           "role": "user",
//           "parts": [{
//             "text": "1+1为什么等于2"
//           }]
//         }]
//       })
//     })
//     .then((response) => response.body)
//     .then((rb) => {
//       const reader = rb.getReader();
//       const textDecoder = new TextDecoder();
//       return new ReadableStream({
//         start(controller) {
//           // The following function handles each data chunk
//           function push() {
//             // "done" is a Boolean and value a "Uint8Array"
//             reader.read().then(({
//               done,
//               value
//             }) => {
//               // If there is no more data to read
//               if (done) {
//                 console.log("done", done);
//                 controller.close();
//                 return;
//               }
//               console.log(textDecoder.decode(value))
//               // Get the data and send it to the browser via the controller
//               controller.enqueue(value);
//               // Check chunks by logging to the console
//               console.log(done, value);
//               push();
//             });
//           }
//           push();
//         },
//       });
//     })
//     .then((stream) =>
//       // Respond with our stream
//       new Response(stream, {
//         headers: {
//           "Content-Type": "text/html"
//         }
//       }).text(),
//     )
//     .then((result) => {
//       // Do things with result
//       console.log(result);
//     });

// }
// const controller = new AbortController();
// const {
//   signal
// } = controller;

export async function* reqGemini(data, signal) {
  // const API_BASE = localStorage.getItem('qaiApi') || 'https://api-gm.xfjy.in/v1beta/models/gemini-pro:streamGenerateContent?key='
  const API = 'https://zhidayingxiao.cn/v1/completions'

  const rb = await fetch(API, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('qaiKey') || ''
    },
    signal
  }).then(res => res.status < 300 ? res : Promise.reject(res.text())).then((response) => response.body).catch(async e => {
    throw new Error(await e)
  });
  const reader = rb.getReader();
  const textDecoder = new TextDecoder();
  let hasNext = true
  while (hasNext) {
    const {
      done,
      value
    } = await reader.read()
    if (done) {
      hasNext = !done
    } else {
      yield textDecoder.decode(value)
    }
  }
}
