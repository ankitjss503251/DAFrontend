/******    Cookies         ******/
export function setCookie(cname:string, cvalue:any, exdays:number) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
export function getCookie(cname:string) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
export function deleteCookie(cname:string) {
     setCookie(cname,"",-1);
}
/******    Cookies  end       ******/
export function deleteIsAdmin()
{
  deleteCookie('connect.auth');
}
export function isSuperAdmin()
{
  return getCookie('connect.auth');
}

export function isLoggedIn()
{
  return isAdmin() || true;
}