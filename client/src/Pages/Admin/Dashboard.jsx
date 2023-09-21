import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, } from 'recharts';
import styled from 'styled-components';
import AdminLayout from '../../Components/admin/AdminLayout';

const MainBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 3vh;
`;

const Title = styled.h1`
  text-align: center;
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

`;

const CardBlock = styled.div`
  padding: 25px;
`;

const Head2 = styled.h2`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Fleft = styled.i`
  font-size: 26px;

`;

const Fright = styled.span`
  float: right;
`;

const LineGraph = styled.div`
display: flex;
align-items: center;
  overflow-x:scroll;
  border: 2px solid grey;
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

const PieDiv = styled.div`
  display: flex;
align-items: center;
justify-content: center;
  overflow-x:scroll;
  border: 2px solid grey;
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

const Dashboard = () => {

  const data = [
    { name: 'Jan', value: 100 },
    { name: 'Feb', value: 125 },
    { name: 'Mar', value: 350 },
    { name: 'Apr', value: 175 },
    { name: 'May', value: 200 },
    { name: 'Jun', value: 225 },
    { name: 'Jul', value: 250 },
    { name: 'Aug', value: 275 },
    { name: 'Sep', value: 300 },
    { name: 'Oct', value: 125 },
    { name: 'Nov', value: 350 },
    { name: 'Dec', value: 375 },
  ];


  const colors = ['#FF5733', '#338BFF', '#9933FF', '#FFC300', '#33FF57'];

  const pieData = [
    { name: 'Category A', value: 30, fill:colors[0] },
    { name: 'Category B', value: 20 , fill:colors[1]},
    { name: 'Category C', value: 50 , fill:colors[2]},
  ];



  return (
    <AdminLayout>
      <MainBox>
        <Title>Dashboard</Title>
        <div className="row">
          <div className="col-md-4 col-xl-4">
            <OrderCardBlue>
              <CardBlock>
                <h6 className="m-b-20">Orders Received</h6>
                <Head2 ><Fleft className="fa fa-cart-plus"></Fleft><span>486</span></Head2>
                <p className="m-b-0">Completed Orders<Fright className="f-right">351</Fright></p>
              </CardBlock>
            </OrderCardBlue>
          </div>

          <div className="col-md-4 col-xl-4">
            <OrderCardYellow>
              <CardBlock>
                <h6 className="m-b-20">Orders Received</h6>
                <Head2 ><Fleft className="fa fa-refresh"></Fleft><span>486</span></Head2>
                <p className="m-b-0">Completed Orders<Fright className="f-right">351</Fright></p>
              </CardBlock>
            </OrderCardYellow>
          </div>

          <div className="col-md-4 col-xl-4">
            <OrderCardPink>
              <CardBlock>
                <h6 className="m-b-20">Orders Received</h6>
                <Head2 ><Fleft className="fa fa-credit-card"></Fleft><span>486</span></Head2>
                <p className="m-b-0">Completed Orders<Fright className="f-right">351</Fright></p>
              </CardBlock>
            </OrderCardPink>
          </div>
        </div>

        <div className='row'>
          

          <PieDiv className="col-sm-12 col-md-6 col-lg-6 col-xl-6" >
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
            <LineChart width={600} height={300} data={data}>
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