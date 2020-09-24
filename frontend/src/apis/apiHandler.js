const baseUrl = "http://localhost:5000";

export const getAllStock = () => {
    const path = "/stock/allStocks";
    const url = baseUrl+path;
    const jwtAccessToken = localStorage.getItem('jwtAccessToken');
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                Authorization : jwtAccessToken
            },
        })
        .then(response => response.json())
        .then(resJson => {
            if(resJson.success === true){
                resolve(resJson.data);
            } else {
                reject(resJson);
            }
        })
    });
}

export const getEtfs = (symbol) => {
    const path = "/stock/etfs/"+symbol;
    const url = baseUrl+path;
    const jwtAccessToken = localStorage.getItem('jwtAccessToken');
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                Authorization : jwtAccessToken
            },
        })
        .then(response => response.json())
        .then(resJson => {
            console.log(resJson);
            if(resJson.success === true){
                resolve(resJson.data);
            } else {
                reject(resJson);
            }
        })
    });
}

export const logIn = (key) => {
    const path = "/user/login";
    const url = baseUrl+path;
    const jwtAccessToken = localStorage.getItem('jwtAccessToken');
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
                Authorization : jwtAccessToken
            },
            body: JSON.stringify({userKey : key})
        })
        .then(response => response.json())
        .then(resJson => {
            console.log(resJson);
            if(resJson.success === true){
                localStorage.setItem('jwtAccessToken', resJson.accessToken);
                resolve(resJson.data);
                window.location.href = "/";
            } else {
                reject(resJson);
            }
        })
    });
}