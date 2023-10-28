import { useState,CSSProperties } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import PulseLoader from "react-spinners/PulseLoader";
import ScaleLoader from "react-spinners/ScaleLoader"
import CircleLoader from "react-spinners/CircleLoader"
import ClipLoader from "react-spinners/ClipLoader"
import SyncLoader from "react-spinners/SyncLoader"
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

            {/* <ClipLoader
                color={"ffffff"}
                loading={loading}
                cssOverride={override}
                size={50}
                // aria-label="Loading Spinner"
                // data-testid="loader"
            /> */}

            {/* <BeatLoader color="#7393A7"/> */}
            {/* <SyncLoader color="#7393A7"/> */}

            {/* <PulseLoader/> */}
            <ScaleLoader color="#7393A7"/>
            {/* <CircleLoader/> */}

        </Wrapper>
    );
}

export default Loader;