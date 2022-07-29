class api
{
  #response =  new Promise(()=>{});  
  #headers  = {'Content-Type':""};

  ajax(url,method,data,header='json')
  {
    let headers=this.#headers;
    let body;
    
    // let formData = new FormData();

    if(header=='json')
    {
      headers['Content-Type'] = "application/json";
      body   = JSON.stringify(data);
    }
    
    if(header=='form')
    {
      body   = data   
    }
    return fetch(process.env.REACT_APP_API_BASE_URL+url,{
      method, // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', 
      credentials: 'include', // include, *same-origin, omit
      'headers': headers,
      body
    });
  }
  addHeaders(headers)
  {
    this.#headers = headers;
    return this;
  }
  get(url)
  {
     return this.ajax(url,'GET','','').then(res=>res.json())
  }
  post(url,body,file=false)
  {
       this.#response = this.ajax(url,'POST',body,file?'form':'json').then(res=>{ if(res.ok)return res;console.log(res);throw new CustomError(res.statusText,res)});
       return this.getAsJSON();
  }
  getAsJSON(){ return this.#response.then((res)=>res.json()); }

  getAsRaw(){ return this.#response.then(res=>res); }
  
  postRawJson(url,body)
  {
     
     return this.ajax(url,'POST',body,'raw').then(res=>res.json())
  }
}
export class CustomError extends Error
{
  status;
  #body;
  constructor(message,response)
  {
    super(message);
    this.status = response.status;
    this.#body   = response.json(); 
  }
  getBody(){ return this.#body; }

}

export default new api();