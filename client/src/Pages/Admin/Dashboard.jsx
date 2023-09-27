import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, } from 'recharts';
import styled from 'styled-components';
import AdminLayout from '../../Components/admin/AdminLayout';
import { Apartment, CardMembership, CurrencyRupee } from '@mui/icons-material';
import axiosInstance from '../../axios/axiosInstance';


const MainBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 3vh;
`;

const Title = styled.h1`
  text-align: center;
  color: #96B6C5;
  /* color: #36454F; */
`;

const OrderCardBlue = styled.div`
  color: #fff;
  background: linear-gradient(45deg,#4099ff,#73b4ff);
  border-radius: 5px;
  -webkit-box-shadow: 0 1px 2.94px 0.06px rgba(4,26,55,0.16);
  box-shadow: 0 1px 2.94px 0.06px rgba(4,26,55,0.16);
  border: none;
  margin-bottom: 30px;
  -webkit-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
  height: 24vh;
`;
const OrderCardYellow = styled.div`
  color: #fff;
  background: linear-gradient(45deg,#FFB64D,#ffcb80);
  border-radius: 5px;
  -webkit-box-shadow: 0 1px 2.94px 0.06px rgba(4,26,55,0.16);
  box-shadow: 0 1px 2.94px 0.06px rgba(4,26,55,0.16);
  border: none;
  margin-bottom: 30px;
  -webkit-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
  height: 24vh;

`;
const OrderCardPink = styled.div`
  color: #fff;
  background: linear-gradient(45deg,#FF5370,#ff869a);
  border-radius: 5px;
  -webkit-box-shadow: 0 1px 2.94px 0.06px rgba(4,26,55,0.16);
  box-shadow: 0 1px 2.94px 0.06px rgba(4,26,55,0.16);
  border: none;
  margin-bottom: 30px;
  -webkit-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
  height: 24vh;

`;

const CardBlock = styled.div`
  padding: 25px;
`;

const Head2 = styled.h2`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PieDiv = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 2vh;
  align-items: center;
  justify-content: center;
  overflow-x:scroll;
  border-radius: 10px;
  box-shadow: 5px 5px 22px -6px rgba(0,0,0,0.5);
  background-color: #ffffff;
  width: 40%;
  @media (max-width:800px){
    width: 100%;
  }

  &::-webkit-scrollbar {
    width: 0.01em;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: transparent;
  }
`;

const LineGraph = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 2vh;
  align-items: center;
  overflow-x:scroll;
  border-radius: 10px;
  box-shadow: 5px 5px 22px -6px rgba(0,0,0,0.5);
  background-color: #ffffff;
  margin-left: 5vw;
  @media (max-width:800px){
    width: 100%;
    margin-left: 0;
  }

  &::-webkit-scrollbar {
    width: 0.01em;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: transparent;
  }
`;

const GraphsDiv = styled.div`
  display: flex;
  justify-content: space-between;
  @media (max-width: 1200px){
    flex-direction: column;
  }
`;

const Dashboard = () => {
  const [cardDeets, setCardDeets] = useState({})
  const [pieDeets, setPieDeets] = useState({})
  const [graphData, setGraphData] = useState([])

  const getCardDeets = async () => {
    await axiosInstance.get("/admin/carddeets")
      .then((res) => {
        console.log(res.data)

        setCardDeets(res.data)
      })

  }

  const getPieDeets = async () => {
    await axiosInstance.get("/admin/piedeets")
      .then((res) => {
        console.log(res.data)
        setPieDeets(res.data)
      })
  }

  const getGraphData = async () => {
    await axiosInstance.get("/admin/graphdata")
      .then((res) => {
        console.log(res.data)
        setGraphData(res.data)
      })
  }

  useEffect(() => {
    getCardDeets();
    getPieDeets();
    getGraphData();
  }, [])

  console.log(pieDeets)
  const colors = ['#338BFF', '#9933FF', '#FFC300', '#33FF57', '#FF5733'];

  const pieData = [
    { name: 'Residential', value: pieDeets["residential"], fill: colors[0] },
    { name: 'Commercial', value: pieDeets["commercial"], fill: colors[1] },
    { name: 'Plot', value: pieDeets["plot"], fill: colors[2] },
  ];



  return (
    <AdminLayout>
      <MainBox>
        <Title>Dashboard</Title>
        <div className="row">
          <div className="col-md-4 col-xl-4">
            <OrderCardBlue>
              <CardBlock>
                <h3 className="m-b-20">Listed Properties</h3>
                <Head2 ><Apartment style={{ fontSize: '35px' }} /><span>{cardDeets.props}</span></Head2>
              </CardBlock>
            </OrderCardBlue>
          </div>

          <div className="col-md-4 col-xl-4">
            <OrderCardYellow>
              <CardBlock>
                <h3 className="m-b-20">Total Revenue</h3>
                <Head2 ><CurrencyRupee style={{ fontSize: '35px' }} /><span>{cardDeets.revenue}</span></Head2>
              </CardBlock>
            </OrderCardYellow>
          </div>

          <div className="col-md-4 col-xl-4">
            <OrderCardPink>
              <CardBlock>
                <h3 className="m-b-20">Subscribers</h3>
                <Head2 ><CardMembership style={{ fontSize: '35px' }} /><span>{cardDeets.subscribers}</span></Head2>
              </CardBlock>
            </OrderCardPink>
          </div>
        </div>

        <div className="row">

          <PieDiv className="col-sm-12 col-md-6 col-lg-6 col-xl-6" >
            <h3>Property Types</h3>
            <PieChart width={400} height={400}>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={130}
                label
              />
              <Tooltip />
              <Legend />
            </PieChart>
          </PieDiv>


          <LineGraph className="col-sm-12 col-md-6 col-lg-6 col-xl-6" >
            <h2>Listings per month</h2>
            <LineChart width={400} height={300} data={graphData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </LineGraph>

        </div>




      </MainBox>

    </AdminLayout>
  )
}

export default Dashboard