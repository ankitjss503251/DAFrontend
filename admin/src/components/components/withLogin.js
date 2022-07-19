import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from "../pages/Login";
import { isSuperAdmin,deleteIsAdmin } from '../../helpers/utils';
import Navbar from "../Navbar";
export default function withLogin(Component,callback=()=>{})
{
    return function(props){
        let navigateTo = useNavigate();
        const [is_admin,setIsAdmin] = useState();
        const [state,setState] = useState({is_admin});
        useEffect(()=>{
           let lastCookie = isSuperAdmin();
           let interval = setInterval(()=> {
               let cookie = isSuperAdmin();
               if (cookie !== lastCookie) {
               try {
                   // setIsAdmin(false);
                   callback();
                   navigateTo({pathname:'/sadmin',search:'?next='+window.location.pathname});
                   //deleteIsAdmin();
                   //setState(state=>({is_admin:false}))
               } finally {
                   lastCookie = cookie;
               }
               }
           }, 1100);
          return ()=>window.clearInterval(interval); 
        },[isSuperAdmin()])
        //callback();
        //if(!state.is_admin)
          // return <Login next={window.location.pathname}/>
        return <><Component {...props} isAdmin={isSuperAdmin()} /></>;
    }
    
}