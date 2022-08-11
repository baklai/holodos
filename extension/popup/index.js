document.getElementById('btn-get-list').addEventListener('click', (e) => {
  console.log(e);
  const getActiveTab = browser.tabs.query({
    active: true,
    currentWindow: true
  });
  getActiveTab.then((tabs) => {
    browser.tabs.sendMessage(
      tabs[0].id,
      { method: 'getList' },
      function (msg, err) {
        document.body.appendChild(msg.response);
        alert(msg.response);
      }
    );
  });
});

document.getElementById('btn-reload-page').addEventListener('click', (e) => {
  browser.tabs.reload();
  window.close();
});
