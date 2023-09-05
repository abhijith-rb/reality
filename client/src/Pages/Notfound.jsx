import React from 'react';
import { styled } from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #5d5dfc;
`;

const Notfound = () => {
  return (
    <Wrapper>
        <div className="container-fluid page-body-wrapper full-page-wrapper d-flex align-items-center justify-content-center">
         <div className="content-wrapper d-flex align-items-center justify-content-center text-center error-page bg-primary">
           <div className="row flex-grow">

        <div className="col-lg-12 mx-auto text-white">
          <div className="row align-items-center d-flex flex-row">
            <div className="col-lg-6 text-lg-right pr-lg-4">
              <h1 className="display-1 mb-0">404</h1>
            </div>
            <div className="col-lg-12 error-page-divider text-lg-left pl-lg-4">
              <h2>SORRY!</h2>
              <h3 className="font-weight-light">The page you're looking for was not found.</h3>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-12 text-center mt-xl-2">
              <a className="text-white font-weight-medium" href="/">Back to home</a>
            </div>
          </div>
        </div>

           </div>
         </div>
       </div>
    </Wrapper>
     

  )
}

export default Notfound