import React from "react";
import "../CardMovie/CardCommon.css";

// Card skeleton for loading state
const CardSkeleton = () => (
  <div className="card-common">
    <div className="card-common-img-wrapper position-relative overflow-hidden">
      <div className="card-common-img skeleton" style={{height:0,paddingTop:'150%',background:'#23242b',borderRadius:'inherit',width:'100%'}} />
    </div>
    <div className="card-common-content">
      <div className="card-common-title skeleton" style={{height:18,width:'80%',margin:'10px auto',background:'#23242b',borderRadius:6}} />
    </div>
  </div>
);

export default CardSkeleton; 