import React from 'react';
import Web3 from "web3";
import {useState,useEffect,useCallback,useRef} from "react";
import {useCookies} from "react-cookie";
import {updateProfile,getProfile} from "../../apiServices";
import {NotificationManager} from "react-notifications";

const twiterImg={
  backgroundImage: "url(./img/profile/akar-icons_twitter-fill.png)",
  backgroundRepeat: "no-repeat",
  backgroundSize: "18px",
  backgroundPosition: "10px center",
}
const instaImg={
  backgroundImage: "url(./img/profile/bxl_instagram-alt.png)",
  backgroundRepeat: "no-repeat",
  backgroundSize: "18px",
  backgroundPosition: "10px center",
}
const AddressImg={
  backgroundImage: "url(./img/profile/ic_round-web.png)",
  backgroundRepeat: "no-repeat",
  backgroundSize: "18px",
  backgroundPosition: "10px center",
}




function Profile() {


  const [fname,setFname]=useState("");

  const [bio,setBio]=useState("");

  const [email,setEmail]=useState("");
  const [walletAddress,setWalletAddress]=useState("");
  const [website,setWebsite]=useState("");
  const [uname,setUname]=useState("");
  const [profilePic,setProfilePic]=useState("");
  const [loading,setLoading]=useState(false);
  const [currentUser,setCurrentUser]=useState("");
  const [cookies]=useCookies(["selected_account"]);
  const [profile,setProfile]=useState();
  const [restrictSpace]=useState([" "])
  const [twitterHandle,setTwitterHandle]=useState("");
  const [instagramHandle,setInstagramHandle]=useState("")
  
  
  const [copySuccess, setCopySuccess] = useState('');
  const textAreaRef = useRef(null);
  

  useEffect(() => {
    const fetch=async () => {
      console.log("in user profile api")
      let _profile=await getProfile();
      setProfile(_profile.data);
    };
    fetch();
  },[]);



  //use Effect for setting Profile
  useEffect(() => {
    if(profile&&Object.keys(profile).length>0) {
      console.log("profile is---->",profile)
      let username=profile?.username;


      setUname(username.trim());

      setBio(
        profile.bio&&
          profile.bio!==undefined&&
          profile.bio!=="undefined"
          ? profile.bio
          :""
      );
      console.log("bio of user is--->",bio)

      setProfilePic(profile.profileIcon&&profile.profileIcon!==undefined&&profile.profileIcon!=='undefined'? profile.profileIcon:"")

      setEmail(
        profile.email&&
          profile.email!==undefined&&
          profile.email!=="undefined"
          ? profile.email
          :""
      );

      setWalletAddress(
        profile.walletAddress&&profile.walletAddress!==undefined&&profile.walletAddress!=='undefined'? profile.walletAddress:"0x00"
      )
      setTwitterHandle(
        profile.twitterHandle&&
          profile.twitterHandle!==undefined&&
          profile.twitterHandle!=="undefined"
          ? profile.twitterHandle
          :""
      );
      setInstagramHandle(
        profile.instagramHandle&&
          profile.instagramHandle!==undefined&&
          profile.instagramHandle!=="undefined"
          ? profile.instagramHandle
          :""
      );
    }
  },[profile]);


  //Update Profile 

  function copyToClipboard(e) {
    textAreaRef.current.select();
   
    document.execCommand('copy');
    // This is just personal preference.
    // I prefer to not show the whole text area selected.
    e.target.focus();
    setCopySuccess('Copied!');
    NotificationManager.success("Wallet Address Copied!")
  };
  
  const handleUpdateProfile=async () => {
    console.log("in handle update profile pic")
    let data={
      uname: uname,

      bio: bio,
      website: website,

      profilePic: profilePic,
      email: email,
    };
    console.log("profile pic",profilePic)
    if(profilePic===""||profilePic===undefined) {
      NotificationManager.error("Please choose profile pic","",800);
      return;
    }





    console.log("uname uname---->",uname.indexOf(' '))
    if(uname===""||uname===undefined||uname.length==0) {
      console.log("uname is invalid")
      NotificationManager.error("Please choose valid username","",800);
      return;
    }
    if((uname.indexOf(' ')) !==-1) {
      NotificationManager.error("Space in username is not allowed","",800);
      return;
    }

    console.log("email is---->",email)
    if(email!==""||email!==undefined) {
      let res=await isValidEmail(email);
      if(!res) {
        return;
      }
    }

    console.log("data to be updated is---->",data)
    try {
      let res=await updateProfile(data);
      if(res==="User Details Updated successfully") {
        NotificationManager.success(res);
        setTimeout(() => {
          window.location.href = "/userprofile";
        }, 200);
      } else {
        NotificationManager.error(res);
      }
    } catch(e) {
      console.log("error",e);
      NotificationManager.error("Something Went Wrong");
    }
    //if (currentUser) {
    //  setLoading(true);
    //  try {
    //    let res = await updateProfile( data);
    //    if (res === "User Details Updated successfully") {
    //      NotificationManager.success(res);
    //      setTimeout(() => {
    //        window.location.href = "/userprofile";
    //      }, 200);
    //    } else {
    //      NotificationManager.error(res);
    //    }
    //  } catch (e) {
    //    console.log("error", e);
    //    NotificationManager.error("Something Went Wrong");
    //  }

    //  setLoading(false);
    //}
  };

  const isValidEmail=async (email) => {
    var atposition=email.indexOf("@");
    var dotposition=email.lastIndexOf(".");
    if(
      atposition<1||
      dotposition<atposition+2||
      dotposition+2>=email.length
    ) {
      NotificationManager.error("Please enter a valid e-mail address");
      return false;
    }
    return true;
  };


  const uploadedImage=React.useRef(null);
  const imageUploader=React.useRef(null);

  const handleImageUpload=e => {
    const [file]=e.target.files;
    if(file) {
      const reader=new FileReader();
      const {current}=uploadedImage;
      current.file=file;
      reader.onload=e => {
        current.src=e.target.result;

      };
      let image=reader.readAsDataURL(file);

    }
    if(e.target.files&&e.target.files[0]) {
      let img=e.target.files[0];

      setProfilePic(img);

    }
  };

  useEffect(() => {

  },[])
  return (
    <div className="profile_area pdd_8">
      <h1 className='profile_h1 mb-3'>Profile Settings</h1>
      <div className="row">
        <div className="col-lg-6 col-md-8 order-md-0 order-sm-2">
          <form action="/action_page.php">
            <div class="mb-3 mt-3">
              <label HTMLfor="user" class="form-label">Username</label>
              <input type="text" class="form-control profile_input" id="user" placeholder="Digital Arms Dealer" name="user" onChange={(r) => {
                setUname(r.target.value);
              }} value={uname} />
            </div>
            <div class="mb-3 mt-3">
              <label HTMLfor="comment" class="form-label">Bio</label>
              <textarea class="form-control profile_textarea" placeholder="Describe yourself here..."
                rows="5" id="comment" name="comment" value={bio}
                onChange={(r) => {
                  setBio(r.target.value);
                }}></textarea>
            </div>
            <div class="mb-3 mt-3">
              <label for="email">Email Address</label>
              <input type="email" class="form-control profile_input" id="email" placeholder="User_Account@email.com"
                onChange={(r) => {
                  setEmail(r.target.value);
                }}
                value={email} name="email" />
            </div>
            <div class="mb-3 mt-3">
              <label for="links">Links</label>
              <div className="add_links_input">
                <input type="url" class="form-control" id="Twitter" name="Your Twitter Handle"
                  placeholder='Your Twitter Handle' value={twitterHandle} onChange={(r) => {
                    setTwitterHandle(r.target.value);
                  }} style={twiterImg} />
                <input type="url" class="form-control" id="Instagram"
                  name="You Instagram handle" placeholder='You Instagram handle' value={instagramHandle} onChange={(r) => {
                    setInstagramHandle(r.target.value);
                  }} style={instaImg} />
                <input type="url" class="form-control" id="address" name="Your Site address"
                  placeholder='Your Site address' value={website} style={AddressImg} />
              </div>
            </div>
            <div class="mb-3 mt-3">
              <label for="Wallet">Wallet Address</label>
              <div className="copy_input">
              <textarea
          ref={textAreaRef}
          value={walletAddress} id="myInput" className="form-control profile_input"
        />

                {/*<input type="text" value={walletAddress} id="myInput" className="form-control profile_input" />*/}
                <button type='button' onClick={copyToClipboard}>
                  <svg width="21" height="24" viewBox="0 0 21 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 21V22.875C15 23.4963 14.4963 24 13.875 24H1.125C0.503672 24 0 23.4963 0 22.875V5.625C0 5.00367 0.503672 4.5 1.125 4.5H4.5V18.375C4.5 19.8225 5.67755 21 7.125 21H15ZM15 4.875V0H7.125C6.50367 0 6 0.503672 6 1.125V18.375C6 18.9963 6.50367 19.5 7.125 19.5H19.875C20.4963 19.5 21 18.9963 21 18.375V6H16.125C15.5063 6 15 5.49375 15 4.875ZM20.6705 3.42052L17.5795 0.329484C17.3685 0.11852 17.0824 1.55998e-06 16.784 0L16.5 0V4.5H21V4.21598C21 3.91763 20.8815 3.63149 20.6705 3.42052Z" fill="#485E6E" />
                  </svg>
                </button>
              </div>
            </div>
            <div className='mt-5'>
              <button type="button" class="yellow_btn mr-3" onClick={() => {
                handleUpdateProfile();
              }}>Save</button>
              {/*<button type="submit" class="yellow_btn yellow_dark">Save</button>*/}
            </div>
        
          </form>
        </div>
        <div className="col-lg-6 col-md-4 order-md-0 order-sm-1">
          <ul className="profile_images">
            <li>
              <h4>Profile Image </h4>
              <div className="profile_image">

                {/*{profilePic ? (
                      <img
                        className="upload-profile "
                        src={URL.createObjectURL(profilePic)}
                        alt="profile-pic"
                      />
                    ) : (
                      ""
                    )}*/}


                <div className="overlat_btn">
                  <div className="upload-btn-wrapper img_edit_btn">
                    <button class="btn"><i class="fa fa-edit fa-lg"></i></button>
                    <input type="file" name="myfile" />
                  </div>
                </div>

              </div>
              <div className="profile_image">
                {/* <img alt='' src={'../img/profile/profile1.png'} class="img-fluid profile_circle_img" /> */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    ref={imageUploader}
                    style={{
                      display: "none"
                    }}
                  />
                  <div className="profile_me"
                    style={{
                      height: "160px",
                      width: "160px"
                    }}
                    onClick={() => imageUploader.current.click()}
                  >
                    <img
                      ref={uploadedImage}
                      src={profilePic? profilePic:'../img/profile/profile1.png'}
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                      className="img-fluid profile_circle_img"
                    />
                    <div class="overlat_btn"><button type="" class="img_edit_btn"><i class="fa fa-edit fa-lg"></i></button></div>
                  </div>
                </div>

              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Profile
