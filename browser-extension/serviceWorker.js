import "/assets/src/entrypoint/Background-260b06d1.js";
chrome.runtime.onMessage.addListener((message, sender, reply) => {
  if (message?.action !== 'abdmYouTubeButton') return;
  if (sender.frameId !== 0 || sender.tab?.id == null) {
    reply({error:'请在 YouTube 视频页操作'});
    return;
  }
  chrome.tabs.get(sender.tab.id, tab => {
  if (chrome.runtime.lastError) {
    reply({error:'无法读取当前标签页'});
    return;
  }
  const url = URL.parse(tab?.url ?? '');
  if (url?.protocol === 'https:' && ['www.bilibili.com', 'bilibili.com'].includes(url.hostname)) {
    if (!/^\/video\/(?:BV[A-Za-z0-9]{10}|av\d+)\/?$/.test(url.pathname)) {
      reply({error:'请打开哔哩哔哩普通视频播放页'});
      return;
    }
    const page = new URL(url.pathname, 'https://www.bilibili.com');
    const part = url.searchParams.get('p');
    if (/^[1-9]\d{0,5}$/.test(part ?? '')) page.searchParams.set('p', part);
    chrome.cookies.get({url:'https://api.bilibili.com/', name:'SESSDATA'}, cookie => {
      const unavailable = chrome.runtime.lastError;
      const rows = !unavailable && cookie && !cookie.partitionKey &&
          !/[\t\r\n]/.test(cookie.domain + cookie.path + cookie.value)
        ? [[cookie.domain, cookie.domain.startsWith('.') ? 'TRUE' : 'FALSE', cookie.path,
          cookie.secure ? 'TRUE' : 'FALSE', Math.floor(cookie.expirationDate ?? 0),
          cookie.name, cookie.value].join('\t')] : [];
    chrome.runtime.sendNativeMessage('com.abdownloadmanager', {
      id:'B_' + crypto.randomUUID(),
      content:{action:'downloadBilibili', isError:false, payload:JSON.stringify({url:page.href, cookies:rows})}
    }, response => {
      if (chrome.runtime.lastError) {
        reply({error:'连接失败，请启动 AB'});
      } else if (response?.content?.payload === 'true' && !response.content.isError) {
        reply({started:true});
      } else {
        let error;
        try { error = JSON.parse(response?.content?.payload).message; } catch {}
        reply({error: error === 'No compatible combined MP4 or HLS format is available.'
          ? '此视频没有可导入的带声 MP4'
          : '哔哩哔哩解析或导入失败'});
      }
    });
    });
    return;
  }
  const id = url?.searchParams.get('v');
  if (url?.protocol !== 'https:' || url.pathname !== '/watch' ||
      !['youtube.com','www.youtube.com','m.youtube.com'].includes(url.hostname) ||
      !/^[A-Za-z0-9_-]{11}$/.test(id ?? '')) {
    reply({error:'请在 YouTube 视频页操作'});
    return;
  }
  chrome.cookies.getAll({domain:'youtube.com'}, cookies => {
  if (chrome.runtime.lastError || !cookies.some(cookie => /^(LOGIN_INFO|SID|SAPISID|__Secure-3PSID)$/.test(cookie.name))) {
    reply({error:'请先在当前 Chrome 登录 YouTube'});
    return;
  }
  const rows = cookies.filter(cookie => !cookie.partitionKey &&
      !/[\t\r\n]/.test(cookie.domain + cookie.path + cookie.name + cookie.value)).map(cookie => [
    cookie.domain, cookie.domain.startsWith('.') ? 'TRUE' : 'FALSE',
    cookie.path, cookie.secure ? 'TRUE' : 'FALSE',
    Math.floor(cookie.expirationDate ?? 0), cookie.name, cookie.value
  ].join('\t'));
  chrome.runtime.sendNativeMessage('com.abdownloadmanager', {
    id:'B_' + crypto.randomUUID(),
    content:{action:'downloadYouTube', isError:false,
      payload:JSON.stringify({url:'https://www.youtube.com/watch?v=' + id, cookies:rows})}
  }, response => {
    if (response?.content?.isError) {
      let error;
      try { error = JSON.parse(response.content.payload).message; } catch {}
      const messages = {
        'YouTube requires additional sign-in verification.': 'YouTube 要求额外登录验证',
        'No compatible combined MP4 or HLS format is available.': '该视频没有兼容的 MP4 或 HLS 格式',
        'YouTube connection timed out.': '连接 YouTube 超时',
        'YouTube format lookup timed out.': '解析超时，请检查代理',
        'This video requires account access.': '当前账号无法访问该视频',
        'Could not connect using the AB proxy.': '无法通过 AB 代理连接',
        'YouTube media lookup failed.': '无法获取 YouTube 媒体地址'
      };
      reply({error: Object.hasOwn(messages, error) ? messages[error] : 'AB 导入失败，请检查桌面端'});
      return;
    }
    if (chrome.runtime.lastError || response?.content?.payload !== 'true') {
      reply({error:'连接失败，请先启动新版桌面程序'});
    } else {
      reply({started:true});
    }
  });
  });
  });
  return true;
});
