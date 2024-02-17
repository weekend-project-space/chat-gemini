async () => {
  return {
    content: `<iframe src="https://gptplugins.vercel.app/md2mindmap.html"  width="700px" height="500px" frameborder="0" scrolling="no"> </iframe>`,
    lazyfun: `(el, args) => {
      var iframe = el.getElementsByTagName('iframe')[0].contentWindow;
      iframe.postMessage(args.content.replaceAll('\\\\\\\\n','\\n').replaceAll('\\\\n','\\n'), '*');
    }`
  }
};
