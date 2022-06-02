import React from 'react';
import Footer from '../components/footer';
import BlogContent from '../components/BlogContent';


var bgImgStyle = {
  backgroundImage: "url(./img/background.jpg)",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPositionX: "center",
  backgroundPositionY: "center",
  backgroundColor: "#000",
};

function BlogTagged() {
  return (
    <div style={bgImgStyle} >
      <section className="pdd_8 blogtagged">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="mb-5">Tips and Tricks</h1>
            </div>
          </div>
          <BlogContent />
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default BlogTagged
