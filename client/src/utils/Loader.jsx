import { useState } from "react";

import ScaleLoader from "react-spinners/ScaleLoader"

import styled from "styled-components";


const Wrapper = styled.div`
width: 100vw;
height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #E8ECF1;
    z-index: 90;
`;

function Loader({loading}){
    // let [loading, setLoading] = useState(true);
    let [color, setColor] = useState("#ffffff");
    const override = {
        display:"block",
        margin:"0 auto",
        borderColor:"red",
    }

    return(
        <Wrapper>

            <ScaleLoader color="#7393A7"/>

        </Wrapper>
    );
}

export default Loader;