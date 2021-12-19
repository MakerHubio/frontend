export default function getCookie(name: string): any {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts === undefined) return '';
  const cookie_value = parts.pop()
    ?.split(';')
    .shift();
  if (cookie_value === undefined) return '';
  return cookie_value;
}