export const parseCookies = (request: any) => {
  const list = {},
    rc = request.headers.cookie;

  rc &&
    rc.split(';').forEach(function(cookie: any) {
      const parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('=')); // eslint-disable-line
    });

  return list;
};

export default parseCookies;
