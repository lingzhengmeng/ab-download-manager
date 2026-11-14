(() => {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = '用 AB 下载';
  button.style.cssText = 'position:fixed;right:18px;bottom:24px;z-index:2147483647;background:#6049d8;color:white;border:0;border-radius:24px;padding:10px 16px;font:600 14px system-ui;cursor:pointer';
  const update = () => {
    const url = new URL(location.href);
    const isBilibili = ['www.bilibili.com', 'bilibili.com'].includes(url.hostname);
    button.hidden = isBilibili
      ? !/^\/video\/(?:BV[A-Za-z0-9]{10}|av\d+)\/?$/.test(url.pathname)
      : url.pathname !== '/watch' || !/^[A-Za-z0-9_-]{11}$/.test(url.searchParams.get('v') ?? '');
    if (!button.isConnected) document.body.append(button);
  };
  button.addEventListener('click', async event => {
    if (!event.isTrusted || button.disabled) return;
    update();
    if (button.hidden) return;
    button.disabled = true;
    button.textContent = '正在解析视频…';
    try {
      const result = await chrome.runtime.sendMessage({action:'abdmYouTubeButton'});
      button.textContent = result?.started ? '请在 AB 确认添加' : (result?.error ?? '连接失败');
    } catch {
      button.textContent = '连接失败，请刷新网页';
    } finally {
      setTimeout(() => {
        button.disabled = false;
        button.textContent = '用 AB 下载';
      }, 4500);
    }
  });
  document.addEventListener('yt-navigate-finish', update);
  window.addEventListener('popstate', update);
  window.navigation?.addEventListener('currententrychange', update);
  update();
})();
