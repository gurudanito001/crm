export function setToken(token){
  localStorage.setItem('token', token);
}
export function getToken(){
  let token = localStorage.getItem('token')
  if(token !== undefined){
    return token;
  }
  return false;
}
export function deleteToken(){
  localStorage.removeItem('userData')
}

export function setUserData(data){
  localStorage.setItem('userData', data )
}

export function getUserData(){
  let data = localStorage.getItem('userData')
  if(data){
    return JSON.parse(data)
  }
  return false;
}

export function deleteUserData(){
  localStorage.removeItem('userData')
}



export function setFingerprint(fingerprint){
  localStorage.setItem('fingerprint', fingerprint);
}
export function getFingerprint(){
  let fingerprint = localStorage.getItem('fingerprint')
  if(fingerprint !== undefined){
      return fingerprint;
  }
  return false;
}
export function deleteFingerprint(){
  localStorage.removeItem('fingerprint')
}
