import React from 'react';
import Footer from '../components/footer';
import BlogContent from '../components/BlogContent';

function BlogTagged() {
  return (
    <div>
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
