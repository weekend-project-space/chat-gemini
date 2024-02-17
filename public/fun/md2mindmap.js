async () => {
  let id = new Date().getTime()
  return {
    content: `<iframe src="https://gptplugins.vercel.app/md2mindmap.html" id="iframe-${id}" width="700px" height="500px" frameborder="0" scrolling="no"> </iframe>`,
    lazyfun: `(args) => {
      var iframe = document.getElementById('iframe-${id}').contentWindow;
      iframe.postMessage(args.content.replaceAll('\\\\\\\\n','\\n').replaceAll('\\\\n','\\n'), '*');
    }`
  }
};
