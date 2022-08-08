import React from 'react';
import BlogContent from '../components/BlogContent';
import Footer from '../components/footer';


var register_bg = {
    backgroundImage: "url(./img/Blog/blog-banner.jpg)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPositionX: "center",
    backgroundPositionY: "center",
};



function blog() {
  return (
    <div>
        <section className='register_hd pdd_12' style={register_bg}>
            <div className='container'>
                <div className='row'>
                    <div className='col-md-12'>
                        <h1>Blogs</h1>
                    </div>
                </div>
            </div>
        </section>
        <section className="pdd_8">
            <div className="container">
                <BlogContent />
            </div>
        </section>
        <Footer />
    </div>
  )
}

export default blog
