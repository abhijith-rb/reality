import React, { useState, useEffect, useRef } from 'react'
import UserLayout from '../../Components/user/UserLayout'
import { styled } from 'styled-components';
import ListPost from '../../Components/user/ListPost';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../../axios/axiosInstance';
import { Button, Form } from 'react-bootstrap';
import { Cancel, Close } from '@mui/icons-material';

const FullWrap = styled.div`
    width:100%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 3vh;
    
`;

const TopDiv = styled.div`
    width:100%;
    height: 14vh;
    position: sticky;
    top: 15vh;
    left: 0;
    display: flex;
    align-items: center;
    @media (max-width:800px){
        top: 10vh;
        flex-direction: column;
        width: 100vw;
        height: 14vh;
    }
    border-radius: 5px;
    color: #ffffff;
    /* background-color: #1876D0; */
    background-color: #79AC78;
`;

const LgDiv = styled.div`
    width:100%;
    height: 10vh;
    display: flex;
    align-items: center;
    /* border: 3px solid green; */
    @media (max-width:800px){
        display:none;
    }
`;


const SmDiv = styled.div`
    display: none;
    @media (max-width:800px){
        width:100%;
        height: 12vh;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 1vw;
        /* border: 3px solid green; */
    }
`;


const Wrapper = styled.div`
    width: 100%;
    height: fit-content;
    display: flex;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 1vh;
`;




const MainDiv = styled.div`
    padding-top: 4vh;
    padding-bottom: 4vh;
    flex: 8;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2vh;
    width: 100%;
`;

const BotDiv = styled.div`
    width: 50%;
    height: 5vh;
    /* border: 2px solid blue; */
    display: flex;
    align-items: center;
    justify-content: space-around;
`;

const NavBtn = styled.button`
    width:30%;
    height: 4vh;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    color: #ffffff;
    background-color: #79AC78;
`;

const FilterBox = styled.div`
    width: 100%;
    height: 60vh;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    position: absolute;
    top: 0;
    z-index:8;
    padding: 0 4vw;
    background-color: #88C4FE;
`;

const Listing = () => {
    const [posts, setPosts] = useState([]);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('q');
    const nav = queryParams.get('nav');
    console.log(query)
    console.log(query?.length)
    console.log(nav)

    const [type, setType] = useState('Residential')
    const [min, setMin] = useState(100000)
    const [max, setMax] = useState(500000)
    const [sort, setSort] = useState('latest')
    const [page, setPage] = useState(1)

    const [filter, setFilter] = useState(false)


    const obj = {
        1: [0, 5],
        2: [5, 10],
        3: [10, 15],
        4: [15, 20],
    }

    const movePrev = () => {
        if (page > 1) {
            setPage(page - 1)
        }
    }

    const moveNext = () => {
        const upLimit = Math.ceil(posts.length / 5)
        if (page < upLimit) {
            setPage(page + 1)
        }
    }

    const getPosts = async () => {
        let searchUrl;

        if (query) {
            searchUrl = `/search-property?squery=${query}&type=${type}&min=${min}&max=${max}`
        } else if (nav) {
            searchUrl = `/search-property?nav=${nav}&type=${type}&min=${min}&max=${max}`

        }

        try {
            await axiosInstance.get(searchUrl)
                .then((response) => {
                    console.log(response.data)
                    const fetched = response.data
                    sortFunction(fetched)
                })
                .catch((err) => {
                    console.log(err)
                })

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        console.log("target useEffect")
        getPosts()
    }, [query, nav, type, min, max])

    const sortFunction = (arr)=>{
        if (sort === "latest") {
            const Latest = [...arr].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            setPosts(Latest)
        } else if (sort === "asc") {
            const Asc = [...arr].sort((a, b) => a.price - b.price)
            console.log(Asc)
            setPosts(Asc)
        } else if (sort === "desc") {
            const Desc = [...arr].sort((a, b) => b.price - a.price)
            console.log(Desc)
            setPosts(Desc)
        }
    }

    useEffect(() => {
        sortFunction(posts)
    }, [sort])

    console.log(posts)
    return (
        <UserLayout>

            <FullWrap>
                <TopDiv>
                    <LgDiv>
                        <Form style={{
                            width: "70%", display: 'flex',
                            alignItems: 'center', justifyContent: 'space-around',
                        }}>
                            <Form.Group controlId='type'>
                                <Form.Label>Type</Form.Label>
                                <Form.Select type='text' name='type' value={type} onChange={(e) => setType(e.target.value)} >
                                    <option value="Residential">Residential</option>
                                    <option value="Commercial">Commercial</option>
                                    <option value="Plot">Plot</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group controlId='minPrice'>
                                <Form.Label>Minimum Price</Form.Label>
                                <Form.Select type='number' name='minPrice' value={min} onChange={(e) => setMin(e.target.value)} >
                                    <option value={100000}> ₹ 1 Lac</option>
                                    <option value={500000}>₹ 5 Lac</option>
                                    <option value={1000000}>₹ 10 Lac</option>
                                    <option value={5000000}>₹ 50 Lac</option>
                                    <option value={10000000}>₹ 1 Cr</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group controlId='maxPrice'>
                                <Form.Label>Maximum Price</Form.Label>
                                <Form.Select type='number' name='maxPrice' value={max} onChange={(e) => setMax(e.target.value)}>
                                    <option value={500000}>₹ 5 Lac</option>
                                    <option value={1000000}>₹ 10 Lac</option>
                                    <option value={5000000}>₹ 50 Lac</option>
                                    <option value={10000000}>₹ 1 Cr</option>
                                    <option value={50000000}>₹ 5 Cr</option>
                                </Form.Select>
                            </Form.Group>
                        </Form>

                        <Form style={{
                            width: "30%", display: 'flex',
                            alignItems: 'center', justifyContent: 'flex-end',
                            paddingRight: "2rem", 
                        }}>
                            <Form.Group controlId='sort' >
                                <Form.Label>Sort by</Form.Label>
                                <Form.Select type='text' name='sort' value={sort} onChange={(e) => setSort(e.target.value)}>
                                    <option value="latest">Latest</option>
                                    <option value="asc">Price - Low to High</option>
                                    <option value="desc">Price - High to Low</option>
                                </Form.Select>
                            </Form.Group>

                        </Form>
                    </LgDiv>

                    <SmDiv>
                        <Button onClick={() => setFilter(true)} variant='warning'>Apply Filters</Button>



                        <Form style={{
                            width: "60%", display: 'flex',
                            alignItems: 'center', justifyContent: 'flex-end',
                            paddingRight: "2rem"
                        }}>
                            <Form.Group controlId='sort' >
                                <Form.Label>Sort by</Form.Label>
                                <Form.Select type='text' name='sort' value={sort} onChange={(e) => setSort(e.target.value)}>
                                    <option value="latest">Latest</option>
                                    <option value="asc">Price - Low to High</option>
                                    <option value="desc">Price - High to Low</option>
                                </Form.Select>
                            </Form.Group>

                        </Form>
                    </SmDiv>

                    {
                            filter &&
                            <FilterBox>
                                <Cancel onClick={()=> setFilter(false)}/>
                                <Form style={{
                                    width: "80%",height:"80%", display: 'flex', flexDirection:'column',
                                     justifyContent:'space-around'
                                }}>
                                    <Form.Group controlId='type'>
                                        <Form.Label>Type</Form.Label>
                                        <Form.Select type='text' name='type' value={type} onChange={(e) => setType(e.target.value)} >
                                            <option value="Residential">Residential</option>
                                            <option value="Commercial">Commercial</option>
                                            <option value="Plot">Plot</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group controlId='minPrice'>
                                        <Form.Label>Minimum Price</Form.Label>
                                        <Form.Select type='number' name='minPrice' value={min} onChange={(e) => setMin(e.target.value)} >
                                            <option value={100000}> ₹ 1 Lac</option>
                                            <option value={500000}>₹ 5 Lac</option>
                                            <option value={1000000}>₹ 10 Lac</option>
                                            <option value={5000000}>₹ 50 Lac</option>
                                            <option value={10000000}>₹ 1 Cr</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group controlId='maxPrice'>
                                        <Form.Label>Maximum Price</Form.Label>
                                        <Form.Select type='number' name='maxPrice' value={max} onChange={(e) => setMax(e.target.value)}>
                                            <option value={500000}>₹ 5 Lac</option>
                                            <option value={1000000}>₹ 10 Lac</option>
                                            <option value={5000000}>₹ 50 Lac</option>
                                            <option value={10000000}>₹ 1 Cr</option>
                                            <option value={50000000}>₹ 5 Cr</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Form>
                            </FilterBox>
                        }
                </TopDiv>
                <Wrapper>
                

                    <MainDiv>
                        {posts.length > 0 ?
                            posts?.slice(obj[page][0], obj[page][1]).map((post, i) => (
                                <ListPost post={post} key={i} />
                            ))

                            : <h1>No Matching Search Results</h1>
                        }
                    </MainDiv>

                </Wrapper>
                <BotDiv>
                    <NavBtn onClick={movePrev}>Prev</NavBtn>
                    <span>{page}</span>
                    <NavBtn onClick={moveNext}>Next</NavBtn>
                </BotDiv>

            </FullWrap>
        </UserLayout>

    )
}

export default Listing