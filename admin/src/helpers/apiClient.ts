class api
{
  private response =  new Promise(()=>{});  
  private headers  = {'Content-Type':""};

  ajax(url:string,method:'GET'|'POST'|'PUT'|'DELETE',data:any,header:string='json')
  {
    let headers=this.headers;
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
      credentials: 'same-origin', // include, *same-origin, omit
      'headers': headers,
      body
    });
  }
  addHeaders(headers)
  {
    this.headers = headers;
    return this;
  }
  get(url:string)
  {
     return this.ajax(url,'GET','','').then(res=>res.json())
  }
  post(url:string,body:any,file:boolean=false)
  {
       this.response = this.ajax(url,'POST',body,file?'form':'json').then(res=>{ if(res.ok)return res;console.log(res);throw new CustomError(res.statusText,res)});
       return this.getAsJSON();
  }
  getAsJSON(){ return this.response.then((res:any)=>res.json()); }

  getAsRaw(){ return this.response.then(res=>res); }
  
  postRawJson(url:string,body:any)
  {
     
     return this.ajax(url,'POST',body,'raw').then(res=>res.json())
  }
}
export class CustomError extends Error
{
  status:number;
  #body:{};
  constructor(message,response)
  {
    super(message);
    this.status = response.status;
    this.#body   = response.json(); 
  }
  getBody(){ return this.#body; }

}

export default new api();