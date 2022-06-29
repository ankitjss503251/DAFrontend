import React, { useEffect, useState } from 'react';
import Login from "../pages/Login";
import { isAdmin } from '../../helpers/utils';
export default function withLogin(Component)
{
    return function(){
        const [is_admin,setIsAdmin] = useState(isAdmin());
        const [state,setState] = useState({is_admin:true});
        useEffect(()=>{
          console.log(is_admin,"auth withLogin");
          if(!is_admin)
             setState(state=>({is_admin:false}))
        },[is_admin]);
        useEffect(()=>{
            let lastCookie = document.cookie;
            let interval = setInterval(()=> {
                let cookie = document.cookie;
                if (cookie !== lastCookie) {
                try {
                    setIsAdmin(isAdmin());
                } finally {
                    lastCookie = cookie;
                }
                }
            }, 1100);
           return ()=>window.clearInterval(interval); 
        },[])
        if(!state.is_admin)
           return <Login next={window.location.pathname}/>
        return <Component />;
    }
    
}