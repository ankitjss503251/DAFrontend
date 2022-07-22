   <BrowserRouter>

       

        <Routes>

          <Route path="sadmin" element={<Login />} />

          <Route element={<><Navbar /><Outlet/></>}>  

          <Route path="/" element={<Home />} />

          {/* <Route

            path="navbar"

            model={mode}

            element={<Navbar />}

            toggleMode={toggleMode}

          /> */}

          <Route path="admins" element={<Admins />}></Route>

          <Route path="createcollection" element={<CreateCollection />} />

          <Route path="createnfts" element={<CreateNFTs />} />

          <Route path="createbrands" element={<CreateBrands />} />

          <Route path="login" element={<Login />} />

          <Route path="register" element={<Register />} />

          <Route path="importedNfts/:address" element={<ImportCard />} />

          <Route path="importedNfts/:address/:id" element={<NftDetail />} />

          <Route

            path="createcategories"

            showNotificationPopup={()=>{}}

            element={<CreateCategories />}

          />

          <Route

            path="notificationpopup"

            notificationpopup={notificationpopup}

            element={<NotificationPopup />}

          />

          </Route>

        </Routes>

        <NotificationContainer />

      </BrowserRouter>