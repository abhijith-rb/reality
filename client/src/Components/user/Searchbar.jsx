import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    width: 60%;
    height: 16vh;
    border-radius: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom:4vh;
    background-color: aliceblue;
`;

const TopDiv = styled.div`
    flex: 1;
    width: 100%;
    border-radius: 2rem 2rem 0 0;
    padding-top:3vh;
    background-color: #88c5fe9e;
`;

const BotDiv = styled.div`
    flex: 1;
    width: 100%;
    border-radius:0 0 2rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-around;
    background-color: #1876D0;
`;

const Ul = styled.ul`
  list-style: none;
  display: flex;
  justify-content: space-around;
`;

const Li = styled.li`
  cursor: pointer;
`;

const Bar = styled.input`
    width: 70%;
    height: 5vh;
    padding-left: 2rem;
    border: none;
`;

const SearchBtn = styled.button`
    width: 10%;
    height: 4vh;
    color: white;
    border: none;
    background-color: #3a9cfd;
`;

const Searchbar = () => {
  return (
    <Container>
        <TopDiv>
            <Ul>
            <Li>Buy</Li>
            <Li>Rent</Li>
            <Li>Sell</Li>
            <Li>Plots</Li>
            <Li>Commercial</Li>
            <Li>Project</Li>
            </Ul>
        </TopDiv>

        <BotDiv>
            <Bar placeholder='Search...'/>

            <SearchBtn>
                Search
            </SearchBtn>

        </BotDiv>

    </Container>
  )
}

export default Searchbar